import io
import uuid
import cv2
import numpy as np
import requests
from PIL import Image
from datetime import datetime
import cloudinary
import cloudinary.uploader
import cloudinary.api
from fastapi import HTTPException
from app.config.settings import CLOUDINARY_CONFIG
from app.config.logging_config import logger

# Configure Cloudinary - IMPORTANT: Do this at module level
cloudinary.config(
    cloud_name=CLOUDINARY_CONFIG["cloud_name"],
    api_key=CLOUDINARY_CONFIG["api_key"],
    api_secret=CLOUDINARY_CONFIG["api_secret"],
    secure=CLOUDINARY_CONFIG["secure"]
)

def download_image_from_url(url):
    """Download image from URL and return PIL Image"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        content_type = response.headers.get('content-type', '')
        if 'image' not in content_type:
            try:
                image = Image.open(io.BytesIO(response.content))
                return image.convert("RGB")
            except Exception:
                raise HTTPException(
                    status_code=400, 
                    detail="URL does not point to a valid image."
                )
        
        image = Image.open(io.BytesIO(response.content))
        return image.convert("RGB")
    except requests.exceptions.RequestException:
        raise HTTPException(
            status_code=400, 
            detail="Failed to download image from URL."
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=400, 
            detail="Invalid image URL or unsupported format."
        )

def upload_to_cloudinary(image, public_id, folder="AgroBot"):
    """Upload image to Cloudinary and return URL"""
    try:
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        # Log the upload attempt
        logger.info(f"Uploading to Cloudinary: public_id={public_id}, folder={folder}")
        
        response = cloudinary.uploader.upload(
            img_byte_arr,
            public_id=public_id,
            folder=folder,
            resource_type="image",
            format="png"
        )
        
        logger.info(f"Cloudinary upload successful: {response.get('secure_url')}")
        
        return {
            "url": response.get("secure_url"),
            "public_id": response.get("public_id"),
            "width": response.get("width"),
            "height": response.get("height"),
            "format": response.get("format"),
            "bytes": response.get("bytes"),
            "created_at": response.get("created_at")
        }
    except Exception as e:
        logger.error(f"Cloudinary upload error: {str(e)}")
        logger.error(f"Cloudinary config: cloud_name={CLOUDINARY_CONFIG['cloud_name']}, api_key={CLOUDINARY_CONFIG['api_key'][:5]}...")
        return None

def create_and_upload_segmentation_images(mask_array, original_image, filename_prefix):
    """Create and upload segmentation images to Cloudinary"""
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        base_name = f"{filename_prefix}_{timestamp}_{unique_id}"
        
        logger.info(f"Creating segmentation images for: {base_name}")
        
        # Ensure mask is binary (0/1)
        mask = (mask_array > 0.5).astype(np.uint8)
        
        # Resize mask to original image size
        mask_resized = cv2.resize(mask, original_image.size, interpolation=cv2.INTER_NEAREST)
        mask_resized = (mask_resized > 0.5).astype(np.uint8)
        
        # Convert original image to numpy array
        orig_np = np.array(original_image)
        
        image_urls = {}
        
        # 1. Upload original image
        orig_result = upload_to_cloudinary(original_image, f"original_{base_name}")
        if orig_result:
            image_urls["original"] = orig_result
            logger.info(f"Uploaded original image: {orig_result.get('url')}")
        
        # 2. Create and upload segmented mask image
        mask_image = mask_resized * 255
        mask_image = np.stack([mask_image] * 3, axis=2)
        mask_pil = Image.fromarray(mask_image.astype(np.uint8))
        
        mask_result = upload_to_cloudinary(mask_pil, f"mask_{base_name}")
        if mask_result:
            image_urls["mask"] = mask_result
            logger.info(f"Uploaded mask image: {mask_result.get('url')}")
        
        # 3. Create and upload overlay image (red overlay on affected areas)
        overlay = np.zeros_like(orig_np, dtype=np.uint8)
        overlay[:, :, 0] = 255  # Red color for overlay
        overlay[:, :, 1] = 0
        overlay[:, :, 2] = 0
        
        overlay_alpha = 0.6
        orig_np_copy = orig_np.copy()
        mask_3d = np.stack([mask_resized] * 3, axis=2)
        
        # Apply overlay only where mask is 1
        blended = np.where(
            mask_3d > 0,
            (1 - overlay_alpha) * orig_np_copy + overlay_alpha * overlay,
            orig_np_copy
        ).astype(np.uint8)
        
        overlay_pil = Image.fromarray(blended)
        overlay_result = upload_to_cloudinary(overlay_pil, f"overlay_{base_name}")
        if overlay_result:
            image_urls["overlay"] = overlay_result
            logger.info(f"Uploaded overlay image: {overlay_result.get('url')}")
        
        logger.info(f"Successfully uploaded {len(image_urls)} images for {base_name}")
        
        return {
            "base_filename": base_name,
            "images": image_urls
        }
    except Exception as e:
        logger.error(f"Error creating segmentation images: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return None