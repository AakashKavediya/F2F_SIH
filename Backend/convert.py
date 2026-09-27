#!/usr/bin/env python3
"""
Convert a PyTorch U-Net checkpoint to ONNX format.
Fixed version that handles Resize operator compatibility.
"""

import argparse
import os
import torch
import torch.nn as nn
import torch.nn.functional as F

# ── U-Net architecture ──────────────────────────────────────────────────────────
class DoubleConv(nn.Module):
    def __init__(self, in_channels, out_channels, mid_channels=None):
        super().__init__()
        if not mid_channels:
            mid_channels = out_channels
        self.double_conv = nn.Sequential(
            nn.Conv2d(in_channels, mid_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(mid_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(mid_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
        )

    def forward(self, x):
        return self.double_conv(x)


class Down(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.maxpool_conv = nn.Sequential(
            nn.MaxPool2d(2), 
            DoubleConv(in_channels, out_channels)
        )

    def forward(self, x):
        return self.maxpool_conv(x)


class Up(nn.Module):
    def __init__(self, in_channels, out_channels, bilinear=True):
        super().__init__()
        if bilinear:
            self.up = nn.Upsample(scale_factor=2, mode="bilinear", align_corners=True)
        else:
            self.up = nn.ConvTranspose2d(in_channels, in_channels // 2, kernel_size=2, stride=2)
        self.conv = DoubleConv(in_channels, out_channels)

    def forward(self, x1, x2):
        x1 = self.up(x1)
        diffY = x2.size()[2] - x1.size()[2]
        diffX = x2.size()[3] - x1.size()[3]
        x1 = F.pad(x1, [diffX // 2, diffX - diffX // 2, diffY // 2, diffY - diffY // 2])
        x = torch.cat([x2, x1], dim=1)
        return self.conv(x)


class OutConv(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.conv = nn.Conv2d(in_channels, out_channels, kernel_size=1)

    def forward(self, x):
        return self.conv(x)


class UNet(nn.Module):
    def __init__(self, n_channels=3, n_classes=1, bilinear=True):
        super().__init__()
        self.n_channels = n_channels
        self.n_classes = n_classes
        self.bilinear = bilinear

        self.inc = DoubleConv(n_channels, 64)
        self.down1 = Down(64, 128)
        self.down2 = Down(128, 256)
        self.down3 = Down(256, 512)
        factor = 2 if bilinear else 1
        self.down4 = Down(512, 1024 // factor)
        self.up1 = Up(1024, 512 // factor, bilinear)
        self.up2 = Up(512, 256 // factor, bilinear)
        self.up3 = Up(256, 128 // factor, bilinear)
        self.up4 = Up(128, 64, bilinear)
        self.outc = OutConv(64, n_classes)

    def forward(self, x):
        x1 = self.inc(x)
        x2 = self.down1(x1)
        x3 = self.down2(x2)
        x4 = self.down3(x3)
        x5 = self.down4(x4)
        x = self.up1(x5, x4)
        x = self.up2(x, x3)
        x = self.up3(x, x2)
        x = self.up4(x, x1)
        return self.outc(x)


def strip_module_prefix(state_dict):
    """Remove 'module.' prefix from keys if present"""
    new_state = {}
    for k, v in state_dict.items():
        new_key = k.replace("module.", "") if k.startswith("module.") else k
        new_state[new_key] = v
    return new_state


def load_checkpoint(checkpoint_path, map_location="cpu"):
    """Load checkpoint with various formats"""
    chk = torch.load(checkpoint_path, map_location=map_location)
    
    if isinstance(chk, dict):
        # Try common keys
        for key in ("model_state_dict", "state_dict", "model"):
            if key in chk:
                sd = chk[key]
                return strip_module_prefix(sd) if isinstance(sd, dict) else sd
        
        # Check if it's already a state_dict
        if all(isinstance(v, torch.Tensor) for v in chk.values()):
            return strip_module_prefix(chk)
    
    return chk


def convert_to_onnx(checkpoint_path, output_path, img_size=256, opset=11):
    """Convert PyTorch model to ONNX with proper handling"""
    
    print("🔄 Loading PyTorch model...")
    
    # Check if checkpoint exists
    if not os.path.exists(checkpoint_path):
        print(f"❌ Checkpoint not found: {checkpoint_path}")
        print("Looking for alternative paths...")
        
        # Try alternative paths
        alternatives = [
            "app/models/disease_detection/best_model_tuned.pth",
            "app/models/disease_detection/best_model.pth",
            "./best_model_tuned.pth",
            "./best_model.pth"
        ]
        
        for alt in alternatives:
            if os.path.exists(alt):
                checkpoint_path = alt
                print(f"✅ Found checkpoint at: {checkpoint_path}")
                break
        else:
            print("❌ Could not find checkpoint file.")
            print("Please specify the correct path with --checkpoint")
            return False
    
    # Create output directory
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Build model
    model = UNet(n_channels=3, n_classes=1, bilinear=True)
    
    # Load state dict
    sd = load_checkpoint(checkpoint_path)
    try:
        model.load_state_dict(sd)
        print("✅ Model weights loaded")
    except Exception as e:
        print(f"❌ Failed to load state_dict: {e}")
        print("Trying to load with strict=False...")
        try:
            model.load_state_dict(sd, strict=False)
            print("✅ Model weights loaded with strict=False")
        except Exception as e2:
            print(f"❌ Still failed: {e2}")
            return False
    
    model.eval()
    
    # Create dummy input
    dummy_input = torch.randn(1, 3, img_size, img_size)
    
    print(f"🔄 Exporting to ONNX (opset={opset})...")
    
    try:
        # Try with newer opset
        torch.onnx.export(
            model,
            dummy_input,
            output_path,
            export_params=True,
            opset_version=opset,
            do_constant_folding=True,
            input_names=["input"],
            output_names=["output"],
            dynamic_axes={
                "input": {0: "batch_size", 2: "height", 3: "width"},
                "output": {0: "batch_size", 2: "height", 3: "width"}
            },
            verbose=False
        )
        print(f"✅ ONNX model saved to: {output_path}")
        return True
        
    except Exception as e:
        print(f"❌ Export failed with opset {opset}: {e}")
        
        # Try with different opset
        try:
            print("🔄 Trying with opset 12...")
            output_path_alt = output_path.replace(".onnx", "_opset12.onnx")
            torch.onnx.export(
                model,
                dummy_input,
                output_path_alt,
                export_params=True,
                opset_version=12,
                do_constant_folding=True,
                input_names=["input"],
                output_names=["output"],
                dynamic_axes={
                    "input": {0: "batch_size", 2: "height", 3: "width"},
                    "output": {0: "batch_size", 2: "height", 3: "width"}
                },
                verbose=False
            )
            print(f"✅ ONNX model saved to: {output_path_alt}")
            return True
        except Exception as e2:
            print(f"❌ Export failed with opset 12: {e2}")
            
            # Try one more time with opset 13
            try:
                print("🔄 Trying with opset 13...")
                output_path_alt = output_path.replace(".onnx", "_opset13.onnx")
                torch.onnx.export(
                    model,
                    dummy_input,
                    output_path_alt,
                    export_params=True,
                    opset_version=13,
                    do_constant_folding=True,
                    input_names=["input"],
                    output_names=["output"],
                    dynamic_axes={
                        "input": {0: "batch_size", 2: "height", 3: "width"},
                        "output": {0: "batch_size", 2: "height", 3: "width"}
                    },
                    verbose=False
                )
                print(f"✅ ONNX model saved to: {output_path_alt}")
                return True
            except Exception as e3:
                print(f"❌ All export attempts failed: {e3}")
                return False


def main():
    parser = argparse.ArgumentParser(description="Convert PyTorch U-Net to ONNX")
    parser.add_argument(
        "--checkpoint", 
        default="app/models/disease_detection/best_model_tuned.pth",
        help="Path to PyTorch checkpoint"
    )
    parser.add_argument(
        "--output", 
        default="app/models/disease_detection/best_model.onnx",
        help="Output ONNX path"
    )
    parser.add_argument(
        "--img-size", 
        type=int, 
        default=256,
        help="Input image size"
    )
    parser.add_argument(
        "--opset", 
        type=int, 
        default=11,
        help="ONNX opset version (try 11, 12, or 13)"
    )
    args = parser.parse_args()
    
    success = convert_to_onnx(
        args.checkpoint,
        args.output,
        img_size=args.img_size,
        opset=args.opset
    )
    
    if success:
        print("\n🎉 Conversion complete!")
        print("📁 Output:", args.output)
    else:
        print("\n❌ Conversion failed. Please check the errors above.")
        sys.exit(1)


if __name__ == "__main__":
    import sys
    main()