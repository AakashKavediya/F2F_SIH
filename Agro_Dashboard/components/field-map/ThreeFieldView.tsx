'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFarm } from '@/context/FarmContext';
import { Bot, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export function ThreeFieldView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { openFieldPassportFor, setSelectedRobot, setIsRobotModalOpen, agroBots } = useFarm();
  const [selectedEntity, setSelectedEntity] = useState<string>('Field C (Tomato) — Zone C4 Selected');

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF0FDF4);
    scene.fog = new THREE.FogExp2(0xF0FDF4, 0.015);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 45, 60);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8e7, 1.2);
    sunLight.position.set(40, 60, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // 5. Farm Terrain Plane
    const terrainGeo = new THREE.PlaneGeometry(80, 80, 24, 24);
    terrainGeo.rotateX(-Math.PI / 2);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xE8F5E9,
      roughness: 0.8,
      metalness: 0.1,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 6. Four Field Boundary Planes
    const fieldsGroup = new THREE.Group();

    // Field A (Top-Left)
    const fieldAGeo = new THREE.PlaneGeometry(32, 32);
    fieldAGeo.rotateX(-Math.PI / 2);
    const fieldAMat = new THREE.MeshStandardMaterial({ color: 0x81C784, roughness: 0.9 });
    const fieldA = new THREE.Mesh(fieldAGeo, fieldAMat);
    fieldA.position.set(-18, 0.05, -18);
    fieldA.receiveShadow = true;
    fieldA.name = 'Field A';
    fieldsGroup.add(fieldA);

    // Field B (Top-Right - Cotton - Slightly drier soil)
    const fieldBGeo = new THREE.PlaneGeometry(32, 32);
    fieldBGeo.rotateX(-Math.PI / 2);
    const fieldBMat = new THREE.MeshStandardMaterial({ color: 0xD7CCC8, roughness: 0.95 });
    const fieldB = new THREE.Mesh(fieldBGeo, fieldBMat);
    fieldB.position.set(18, 0.05, -18);
    fieldB.receiveShadow = true;
    fieldB.name = 'Field B';
    fieldsGroup.add(fieldB);

    // Field C (Bottom-Left - Tomato with Early Blight Zone C4 in red tint)
    const fieldCGeo = new THREE.PlaneGeometry(32, 32);
    fieldCGeo.rotateX(-Math.PI / 2);
    const fieldCMat = new THREE.MeshStandardMaterial({ color: 0x66BB6A, roughness: 0.9 });
    const fieldC = new THREE.Mesh(fieldCGeo, fieldCMat);
    fieldC.position.set(-18, 0.05, 18);
    fieldC.receiveShadow = true;
    fieldC.name = 'Field C';
    fieldsGroup.add(fieldC);

    // Field C Zone C4 Hotspot Marker (reddish boundary)
    const hotspotGeo = new THREE.PlaneGeometry(12, 12);
    hotspotGeo.rotateX(-Math.PI / 2);
    const hotspotMat = new THREE.MeshBasicMaterial({
      color: 0xEF4444,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const hotspot = new THREE.Mesh(hotspotGeo, hotspotMat);
    hotspot.position.set(-14, 0.1, 14);
    fieldsGroup.add(hotspot);

    // Field D (Bottom-Right - Wheat)
    const fieldDGeo = new THREE.PlaneGeometry(32, 32);
    fieldDGeo.rotateX(-Math.PI / 2);
    const fieldDMat = new THREE.MeshStandardMaterial({ color: 0xC8E6C9, roughness: 0.9 });
    const fieldD = new THREE.Mesh(fieldDGeo, fieldDMat);
    fieldD.position.set(18, 0.05, 18);
    fieldD.receiveShadow = true;
    fieldD.name = 'Field D';
    fieldsGroup.add(fieldD);

    scene.add(fieldsGroup);

    // 7. Crop Rows & Low-Poly Representative Plants
    const plantGeo = new THREE.ConeGeometry(0.35, 0.8, 4);
    const plantMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.6 });
    const tomatoFruitMat = new THREE.MeshStandardMaterial({ color: 0xEF4444, roughness: 0.3 });
    const fruitGeo = new THREE.SphereGeometry(0.12, 4, 4);

    // Add rows of plants to Field C
    for (let row = -14; row <= 14; row += 2.5) {
      for (let p = -14; p <= 14; p += 2.0) {
        const plant = new THREE.Mesh(plantGeo, plantMat);
        plant.position.set(-18 + row, 0.45, 18 + p);
        plant.castShadow = true;
        scene.add(plant);

        // Add tomato fruits
        if (Math.random() > 0.4) {
          const fruit = new THREE.Mesh(fruitGeo, tomatoFruitMat);
          fruit.position.set(-18 + row + 0.15, 0.5, 18 + p + 0.15);
          scene.add(fruit);
        }
      }
    }

    // Add rows to Field A
    for (let row = -14; row <= 14; row += 3.0) {
      for (let p = -14; p <= 14; p += 2.2) {
        const plant = new THREE.Mesh(plantGeo, plantMat);
        plant.position.set(-18 + row, 0.45, -18 + p);
        plant.castShadow = true;
        scene.add(plant);
      }
    }

    // 8. Water Tank & Central Pump Station
    const tankGeo = new THREE.CylinderGeometry(2.5, 2.5, 4.5, 16);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x1E88E5, metalness: 0.6, roughness: 0.2 });
    const waterTank = new THREE.Mesh(tankGeo, tankMat);
    waterTank.position.set(0, 2.25, 0);
    waterTank.castShadow = true;
    scene.add(waterTank);

    // Irrigation pipes (Blue thin lines)
    const lineMat = new THREE.LineBasicMaterial({ color: 0x0288D1, linewidth: 2 });
    const pointsA = [new THREE.Vector3(0, 0.1, 0), new THREE.Vector3(-18, 0.1, 0), new THREE.Vector3(-18, 0.1, 18)];
    const pipeGeoA = new THREE.BufferGeometry().setFromPoints(pointsA);
    scene.add(new THREE.Line(pipeGeoA, lineMat));

    const pointsB = [new THREE.Vector3(0, 0.1, 0), new THREE.Vector3(18, 0.1, 0), new THREE.Vector3(18, 0.1, -18)];
    const pipeGeoB = new THREE.BufferGeometry().setFromPoints(pointsB);
    scene.add(new THREE.Line(pipeGeoB, lineMat));

    // 9. AgroBot AGB-02 3D Model (Chassis, wheels, and rotating LiDAR scanner)
    const robotGroup = new THREE.Group();
    robotGroup.position.set(-14, 0.4, 18);

    // Chassis
    const chassisGeo = new THREE.BoxGeometry(1.6, 0.6, 2.2);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.7, roughness: 0.3 });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.4;
    chassis.castShadow = true;
    robotGroup.add(chassis);

    // Top Green Cover
    const coverGeo = new THREE.BoxGeometry(1.4, 0.3, 1.8);
    const coverMat = new THREE.MeshStandardMaterial({ color: 0x16A34A, roughness: 0.4 });
    const cover = new THREE.Mesh(coverGeo, coverMat);
    cover.position.y = 0.85;
    robotGroup.add(cover);

    // LiDAR cylinder
    const lidarGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.35, 12);
    const lidarMat = new THREE.MeshStandardMaterial({ color: 0x2563EB, metalness: 0.9, roughness: 0.1 });
    const lidar = new THREE.Mesh(lidarGeo, lidarMat);
    lidar.position.y = 1.15;
    robotGroup.add(lidar);

    // 4 Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.8 });
    const w1 = new THREE.Mesh(wheelGeo, wheelMat); w1.position.set(-0.9, 0.35, 0.8); robotGroup.add(w1);
    const w2 = new THREE.Mesh(wheelGeo, wheelMat); w2.position.set(0.9, 0.35, 0.8); robotGroup.add(w2);
    const w3 = new THREE.Mesh(wheelGeo, wheelMat); w3.position.set(-0.9, 0.35, -0.8); robotGroup.add(w3);
    const w4 = new THREE.Mesh(wheelGeo, wheelMat); w4.position.set(0.9, 0.35, -0.8); robotGroup.add(w4);

    // Translucent LiDAR Scanning Cone
    const coneGeo = new THREE.ConeGeometry(3.5, 3.0, 16, 1, true);
    coneGeo.rotateX(Math.PI);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const scanCone = new THREE.Mesh(coneGeo, coneMat);
    scanCone.position.set(0, 0.1, 0);
    robotGroup.add(scanCone);

    scene.add(robotGroup);

    // 10. Mouse Interaction / Smooth Orbit Control
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let theta = 0.8;
    let phi = 0.7;
    let radius = 70;

    const updateCameraPosition = () => {
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = Math.max(10, radius * Math.cos(phi));
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 0, 0);
    };
    updateCameraPosition();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      theta -= deltaX * 0.008;
      phi = Math.max(0.2, Math.min(Math.PI / 2.2, phi - deltaY * 0.008));

      updateCameraPosition();
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      radius = Math.max(25, Math.min(110, radius + e.deltaY * 0.05));
      updateCameraPosition();
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 11. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate LiDAR scanner
      lidar.rotation.y += 0.05;
      scanCone.rotation.y -= 0.03;

      // Slight patrol motion for AgroBot along row
      robotGroup.position.z = 18 + Math.sin(elapsedTime * 0.8) * 4;

      renderer.render(scene, camera);
    };
    animate();

    // 12. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#F0FDF4] shadow-subtle select-none">
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Entity HUD */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] shadow-subtle text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="font-bold text-[#111827]">{selectedEntity}</span>
        </div>
        <p className="text-[11px] text-[#6B7280]">
          Drag to rotate • Scroll to zoom • Low-poly terrain digital twin
        </p>
      </div>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2 text-[11px] bg-white/90 backdrop-blur-md p-2 rounded-xl border border-[#E5E7EB] shadow-subtle">
        <span className="inline-flex items-center gap-1 text-[#166534] font-semibold">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#81C784]" /> Field A (Tomato)
        </span>
        <span className="inline-flex items-center gap-1 text-[#8D6E63] font-semibold">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#D7CCC8]" /> Field B (Cotton)
        </span>
        <span className="inline-flex items-center gap-1 text-[#EF4444] font-semibold">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" /> Zone C4 Hotspot
        </span>
        <span className="inline-flex items-center gap-1 text-[#1E88E5] font-semibold">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#1E88E5]" /> Water Tank & Drip
        </span>
        <span className="inline-flex items-center gap-1 text-[#111827] font-semibold">
          <Bot className="w-3 h-3 text-[#16A34A]" /> AgroBot AGB-02
        </span>
      </div>

      {/* Quick Action Button */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => openFieldPassportFor('FIELD-C')}
          className="px-3 py-1.5 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] text-xs font-semibold shadow-sm transition-colors"
        >
          Inspect Field C
        </button>
      </div>
    </div>
  );
}
