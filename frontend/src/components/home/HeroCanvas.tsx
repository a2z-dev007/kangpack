"use client";

import React, { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Html } from "@react-three/drei";
import { MotionValue } from "framer-motion";

// Custom liquid noise background shader
const BackgroundShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;
    
    float noise(vec2 p) {
      return sin(p.x * 3.5 + uTime * 0.15) * cos(p.y * 3.5 + uTime * 0.2) * 0.5 + 0.5;
    }
    
    void main() {
      vec2 uv = vUv;
      
      float n1 = noise(uv * 1.8 + vec2(uTime * 0.04, -uTime * 0.02));
      float n2 = noise(uv * 2.2 - vec2(uTime * 0.03, uTime * 0.03));
      
      vec3 colorDark = vec3(0.015, 0.015, 0.018); // deep charcoal
      vec3 colorMedium = vec3(0.05, 0.05, 0.06); // metallic graphite
      vec3 colorGold = vec3(0.65, 0.48, 0.32); // luxurious gold accent (#a67c52)
      
      float mixVal = smoothstep(0.0, 1.0, uv.y + n1 * 0.25 - 0.1);
      vec3 base = mix(colorDark, colorMedium, mixVal);
      
      // Dynamic moving gold highlight driven by time and cursor
      float distToMouse = distance(uv, uMouse * 0.5 + 0.5);
      float mouseGlow = smoothstep(0.5, 0.0, distToMouse) * 0.08;
      
      float goldGlow = smoothstep(0.7, 0.0, distance(uv, vec2(0.5 + sin(uTime * 0.15) * 0.25, 0.5 + cos(uTime * 0.1) * 0.2))) * 0.05;
      
      vec3 finalColor = base + colorGold * (mouseGlow + goldGlow + n2 * 0.012);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

const Background = () => {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      // Smoothly lerp mouse position for the shader glow
      const targetMouseX = state.pointer.x;
      const targetMouseY = state.pointer.y;
      materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value.x,
        targetMouseX,
        0.05
      );
      materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value.y,
        targetMouseY,
        0.05
      );
    }
  });

  const shaderData = useMemo(() => ({ ...BackgroundShaderMaterial }), []);

  return (
    <mesh ref={meshRef} position={[0, 0, -8]} scale={[viewport.width * 1.8, viewport.height * 1.8, 1]}>
      <planeGeometry />
      <shaderMaterial
        ref={materialRef}
        args={[shaderData]}
        depthWrite={false}
        depthTest={true}
      />
    </mesh>
  );
};

// Volumetric dust particles drifting upward
const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 120;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      spd[i] = 0.015 + Math.random() * 0.02;
    }
    return [pos, spd];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const geo = pointsRef.current.geometry;
    const posArr = geo.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += speeds[i] * 0.4; // float up
      posArr[i * 3] += Math.sin(time * 0.5 + i) * 0.002; // sway

      // recycle when going off screen top
      if (posArr[i * 3 + 1] > 8) {
        posArr[i * 3 + 1] = -8;
        posArr[i * 3] = (Math.random() - 0.5) * 16;
      }
    }
    geo.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a67c52"
        size={0.06}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

// Generates procedural normal/bump map for ballistic nylon weave texture
const useProceduralNylonTexture = () => {
  return useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Fill normal map base (pointing straight out [128,128,255])
    ctx.fillStyle = "#8080ff";
    ctx.fillRect(0, 0, 128, 128);

    const imgData = ctx.getImageData(0, 0, 128, 128);
    const data = imgData.data;

    for (let y = 0; y < 128; y++) {
      for (let x = 0; x < 128; x++) {
        const idx = (y * 128 + x) * 4;
        
        // Checker weave pattern
        const wx = (x % 4) < 2 ? 1 : -1;
        const wy = (y % 4) < 2 ? 1 : -1;
        
        data[idx] = 128 + wx * 25;     // R: normal vector x
        data[idx + 1] = 128 + wy * 25; // G: normal vector y
        data[idx + 2] = 255;           // B: normal vector z
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    return texture;
  }, []);
};

interface HotspotProps {
  position: [number, number, number];
  title: string;
  desc: string;
  visible: boolean;
  onClick: () => void;
  active: boolean;
}

const HotspotMarker: React.FC<HotspotProps> = ({ position, title, desc, visible, onClick, active }) => {
  if (!visible) return null;

  return (
    <group position={position}>
      <Html center distanceFactor={8} zIndexRange={[10, 50]}>
        <div className="relative flex items-center justify-center select-none pointer-events-auto">
          {/* Pulse ring */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className={`w-6 h-6 flex items-center justify-center rounded-full bg-black/60 border border-white/30 backdrop-blur-md transition-all duration-300 group ${
              active ? "border-[#a67c52] ring-2 ring-[#a67c52]/30 scale-110" : "hover:scale-105"
            }`}
          >
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${active ? "bg-[#a67c52]" : "bg-white group-hover:bg-[#a67c52]"}`} />
            <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-60 pointer-events-none" />
          </button>

          {/* Details Card */}
          <div
            className={`absolute left-8 w-60 p-4 rounded-2xl dark-glass border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-500 origin-left flex flex-col gap-1.5 ${
              active ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-75 translate-x-[-10px] pointer-events-none"
            }`}
          >
            <h4 className="text-xs font-black text-white tracking-[0.15em] uppercase">{title}</h4>
            <p className="text-[10px] text-white/50 leading-relaxed font-light">{desc}</p>
          </div>
        </div>
      </Html>
    </group>
  );
};

interface BagModelProps {
  scrollProgress: MotionValue<number>;
  activeHotspot: number | null;
  setActiveHotspot: (index: number | null) => void;
}

const LaptopBag: React.FC<BagModelProps> = ({ scrollProgress, activeHotspot, setActiveHotspot }) => {
  const bagGroup = useRef<THREE.Group>(null);
  const mainBodyRef = useRef<THREE.Mesh>(null);
  const flapPivot = useRef<THREE.Group>(null);
  const laptopRef = useRef<THREE.Group>(null);
  const mouseRef = useRef<THREE.Group>(null);
  const earbudsRef = useRef<THREE.Group>(null);
  const chargerRef = useRef<THREE.Group>(null);

  const nylonTexture = useProceduralNylonTexture();

  // Hotspots definitions
  const hotspotsData = [
    {
      position: [0, 0.4, 1.15] as [number, number, number],
      title: "M1 Ballistic Nylon",
      desc: "Water-repellent, high-tensile weave with military-grade tear resistance.",
    },
    {
      position: [0, -1.2, 1.15] as [number, number, number],
      title: "MagSnap Buckle",
      desc: "Self-aligning magnetic lock. Snaps shut instantly; slide horizontally to unlock.",
    },
    {
      position: [0, 0.8, 0.3] as [number, number, number],
      title: "SafeGuard Shell",
      desc: "Inner impact foam & shock-absorbing corners cushion tech accessories from drops.",
    },
    {
      position: [-1.75, 1.0, 0] as [number, number, number],
      title: "AirSling Harness",
      desc: "Distributes weight dynamically to relieve pressure off neck and shoulder muscles.",
    }
  ];

  useFrame((state) => {
    const scrollVal = scrollProgress.get();
    const time = state.clock.getElapsedTime();

    // Mouse interactive tilt (Depth Parallax & Inertia)
    const targetTiltX = state.pointer.y * 0.15;
    const targetTiltY = state.pointer.x * 0.2;

    if (bagGroup.current) {
      // 1. Slow floating idle animation (applied at low scroll)
      const idleFloat = Math.sin(time * 1.2) * 0.08;
      const idleRotateY = Math.cos(time * 0.8) * 0.05;

      // 2. Main Bag Rotation & Zoom targets based on Scroll Phases
      let targetRotX = 0;
      let targetRotY = 0;
      let targetRotZ = 0;
      let targetPosX = 0;
      let targetPosY = 0;
      let targetPosZ = 0;

      // Handle Hotspot camera overrides
      if (activeHotspot !== null) {
        // Zoom & Rotate specifically to showcase that feature
        if (activeHotspot === 0) {
          // Ballistic fabric closeup
          targetPosZ = 2.5;
          targetRotY = 0.5;
          targetRotX = 0.2;
          targetPosY = -0.3;
        } else if (activeHotspot === 1) {
          // Buckle closeup
          targetPosZ = 2.8;
          targetPosY = 1.0;
          targetRotX = 0.1;
        } else if (activeHotspot === 2) {
          // Inside compartments
          targetPosZ = 2.2;
          targetRotX = 0.4;
          targetRotY = -0.2;
          targetPosY = -0.8;
        } else if (activeHotspot === 3) {
          // Shoulder mounts
          targetPosZ = 2.3;
          targetPosX = 1.4;
          targetRotY = -0.8;
          targetPosY = -0.4;
        }
      } else {
        // Normal Scroll Storytelling progression
        if (scrollVal < 0.25) {
          // Phase 1: Intro. Centered. Gradual spin and slow fade.
          const progress = scrollVal / 0.25;
          targetRotY = THREE.MathUtils.lerp(-Math.PI * 0.2, 0, progress) + idleRotateY;
          targetRotX = THREE.MathUtils.lerp(0.1, 0, progress) + targetTiltX;
          targetRotZ = 0;
          targetPosZ = THREE.MathUtils.lerp(-1.5, 0, progress);
          targetPosY = idleFloat;
        } else if (scrollVal < 0.5) {
          // Phase 2: Open Flap & Separate layers.
          const progress = (scrollVal - 0.25) / 0.25;
          targetRotY = targetTiltY;
          targetRotX = THREE.MathUtils.lerp(0, 0.1, progress) + targetTiltX;
          targetPosZ = THREE.MathUtils.lerp(0, 0.8, progress); // zoom in slightly
          targetPosY = THREE.MathUtils.lerp(0, -0.4, progress) + idleFloat;
        } else if (scrollVal < 0.75) {
          // Phase 3: Macro view zoom and active hotspots.
          const progress = (scrollVal - 0.5) / 0.25;
          // Rotate bag to show side stitching / construction
          targetRotY = THREE.MathUtils.lerp(0, Math.PI * 0.6, progress) + targetTiltY;
          targetRotX = THREE.MathUtils.lerp(0.1, 0.25, progress) + targetTiltX;
          targetPosZ = THREE.MathUtils.lerp(0.8, 1.8, progress);
          targetPosY = THREE.MathUtils.lerp(-0.4, -0.2, progress) + idleFloat;
        } else {
          // Phase 4: Final Pan and prep to exit.
          const progress = (scrollVal - 0.75) / 0.25;
          targetRotY = THREE.MathUtils.lerp(Math.PI * 0.6, Math.PI * 2.0, progress) + targetTiltY;
          targetRotX = THREE.MathUtils.lerp(0.25, 0, progress) + targetTiltX;
          targetPosZ = THREE.MathUtils.lerp(1.8, -0.5, progress);
          targetPosY = THREE.MathUtils.lerp(-0.2, -1.5, progress); // slide downward out of frame
        }
      }

      // Smooth interpolation for bag transformation
      bagGroup.current.rotation.x = THREE.MathUtils.lerp(bagGroup.current.rotation.x, targetRotX, 0.05);
      bagGroup.current.rotation.y = THREE.MathUtils.lerp(bagGroup.current.rotation.y, targetRotY, 0.05);
      bagGroup.current.rotation.z = THREE.MathUtils.lerp(bagGroup.current.rotation.z, targetRotZ, 0.05);
      bagGroup.current.position.x = THREE.MathUtils.lerp(bagGroup.current.position.x, targetPosX, 0.05);
      bagGroup.current.position.y = THREE.MathUtils.lerp(bagGroup.current.position.y, targetPosY, 0.05);
      bagGroup.current.position.z = THREE.MathUtils.lerp(bagGroup.current.position.z, targetPosZ, 0.05);
    }

    // 3. Flap Opening Hinge rotation (Scroll 0.25 -> 0.5)
    if (flapPivot.current) {
      let targetFlapAngle = 0;
      if (activeHotspot === null) {
        if (scrollVal >= 0.25 && scrollVal < 0.5) {
          const progress = (scrollVal - 0.25) / 0.25;
          targetFlapAngle = progress * (-Math.PI * 0.7); // open flap up to 125 degrees
        } else if (scrollVal >= 0.5) {
          targetFlapAngle = -Math.PI * 0.7; // keep open
        }
      } else {
        // If compartment hotspot clicked, keep flap open
        if (activeHotspot === 2) {
          targetFlapAngle = -Math.PI * 0.7;
        }
      }
      flapPivot.current.rotation.x = THREE.MathUtils.lerp(flapPivot.current.rotation.x, targetFlapAngle, 0.06);
    }

    // 4. Internal Laptop slide up (Scroll 0.35 -> 0.55)
    if (laptopRef.current) {
      let targetLaptopY = -0.3; // inside
      if (activeHotspot === null) {
        if (scrollVal >= 0.35 && scrollVal < 0.55) {
          const progress = (scrollVal - 0.35) / 0.2;
          targetLaptopY = THREE.MathUtils.lerp(-0.3, 1.6, progress);
        } else if (scrollVal >= 0.55) {
          targetLaptopY = 1.6; // peek out
        }
      } else {
        if (activeHotspot === 2) {
          targetLaptopY = 1.4;
        }
      }
      laptopRef.current.position.y = THREE.MathUtils.lerp(laptopRef.current.position.y, targetLaptopY, 0.06);
    }

    // 5. Floating Modular Accessories
    // Accessories fade and drift away outwards as exploded view opens (Scroll 0.2 -> 0.6)
    let accProgress = 0;
    if (scrollVal >= 0.2 && scrollVal < 0.6) {
      accProgress = (scrollVal - 0.2) / 0.4;
    } else if (scrollVal >= 0.6) {
      accProgress = 1.0;
    }

    // Hover floating sine-wave effect
    const hoverScale = Math.sin(time * 1.5) * 0.05;

    // Mouse wireless accessory (Right)
    if (mouseRef.current) {
      const startPos = [0.8, -0.5, 0.5];
      const endPos = [2.2, -0.6, 0.8];
      mouseRef.current.position.x = THREE.MathUtils.lerp(startPos[0], endPos[0], accProgress);
      mouseRef.current.position.y = THREE.MathUtils.lerp(startPos[1], endPos[1], accProgress) + hoverScale;
      mouseRef.current.position.z = THREE.MathUtils.lerp(startPos[2], endPos[2], accProgress);
      mouseRef.current.rotation.y = time * 0.4;
      mouseRef.current.rotation.x = time * 0.2;
    }

    // Earbuds capsule (Bottom Right)
    if (earbudsRef.current) {
      const startPos = [0.5, -1.0, 0.3];
      const endPos = [1.8, -1.8, 1.1];
      earbudsRef.current.position.x = THREE.MathUtils.lerp(startPos[0], endPos[0], accProgress);
      earbudsRef.current.position.y = THREE.MathUtils.lerp(startPos[1], endPos[1], accProgress) + hoverScale * 0.7;
      earbudsRef.current.position.z = THREE.MathUtils.lerp(startPos[2], endPos[2], accProgress);
      earbudsRef.current.rotation.z = time * 0.3;
      earbudsRef.current.rotation.y = time * 0.5;
    }

    // Charger Pouch (Left)
    if (chargerRef.current) {
      const startPos = [-0.8, -0.2, 0.4];
      const endPos = [-2.4, 0.5, 0.9];
      chargerRef.current.position.x = THREE.MathUtils.lerp(startPos[0], endPos[0], accProgress);
      chargerRef.current.position.y = THREE.MathUtils.lerp(startPos[1], endPos[1], accProgress) - hoverScale;
      chargerRef.current.position.z = THREE.MathUtils.lerp(startPos[2], endPos[2], accProgress);
      chargerRef.current.rotation.y = -time * 0.3;
      chargerRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <group ref={bagGroup} scale={[0.9, 0.9, 0.9]}>
      {/* 3D LIGHT SOURCE GIZMO (Sweep effect follows camera/time) */}

      {/* A. Outer Main Shell (Nylon fabric textured) */}
      <mesh ref={mainBodyRef} castShadow receiveShadow>
        <boxGeometry args={[3.2, 4.2, 1.2]} />
        <meshPhysicalMaterial
          color="#161618"
          roughness={0.8}
          metalness={0.15}
          normalMap={nylonTexture || undefined}
          normalScale={new THREE.Vector2(0.35, 0.35)}
          clearcoat={0.1}
          clearcoatRoughness={0.8}
        />
      </mesh>

      {/* B. Zipper Trim (Golden Metallic Border wrapping edges) */}
      <mesh position={[0, 0, 0.6]}>
        <boxGeometry args={[3.22, 4.22, 0.05]} />
        <meshPhysicalMaterial
          color="#a67c52" // copper gold
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* C. Front Accessory Compartment Shell */}
      <mesh position={[0, -0.3, 0.85]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 3.2, 0.4]} />
        <meshPhysicalMaterial
          color="#111"
          roughness={0.9}
          metalness={0.05}
          normalMap={nylonTexture || undefined}
          normalScale={new THREE.Vector2(0.2, 0.2)}
        />
      </mesh>

      {/* D. Front Flap (Pivots from y=1.2, z=0.85) */}
      <group ref={flapPivot} position={[0, 1.25, 0.85]}>
        {/* Cover panel */}
        <mesh position={[0, -1.2, 0.22]} castShadow>
          <boxGeometry args={[2.84, 2.4, 0.06]} />
          <meshPhysicalMaterial
            color="#1c1c1f"
            roughness={0.7}
            metalness={0.2}
            normalMap={nylonTexture || undefined}
            normalScale={new THREE.Vector2(0.4, 0.4)}
          />
        </mesh>

        {/* Magnetic buckle lock base (metallic gold) */}
        <mesh position={[0, -2.4, 0.23]} castShadow>
          <boxGeometry args={[0.35, 0.5, 0.08]} />
          <meshPhysicalMaterial
            color="#a67c52"
            roughness={0.15}
            metalness={0.95}
            clearcoat={1.0}
          />
        </mesh>

        {/* Buckle release latch (silver metal) */}
        <mesh position={[0, -2.55, 0.28]}>
          <boxGeometry args={[0.22, 0.08, 0.05]} />
          <meshPhysicalMaterial
            color="#e2e8f0"
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* E. Top Leather Handle */}
      <mesh position={[0, 2.18, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.4, 16]} />
        <meshPhysicalMaterial
          color="#0d0d0d"
          roughness={0.95}
          metalness={0.1}
        />
      </mesh>
      {/* Handle Metal brackets */}
      <mesh position={[-0.7, 2.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.12, 0.04, 8, 16]} />
        <meshPhysicalMaterial color="#a67c52" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.7, 2.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.12, 0.04, 8, 16]} />
        <meshPhysicalMaterial color="#a67c52" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* F. Strap connector rings (Sides) */}
      <group position={[-1.65, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.18, 0.05, 8, 16]} />
          <meshPhysicalMaterial color="#a67c52" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
      <group position={[1.65, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.18, 0.05, 8, 16]} />
          <meshPhysicalMaterial color="#a67c52" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* G. Internal Laptop (Slides Up) */}
      <group ref={laptopRef} position={[0, -0.3, 0.15]}>
        {/* Metal Body */}
        <mesh castShadow>
          <boxGeometry args={[2.7, 3.8, 0.08]} />
          <meshPhysicalMaterial
            color="#e2e8f0" // Space silver
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        
        {/* Glowing Apple-style dashboard Screen (Front Face) */}
        <mesh position={[0, 0, 0.042]}>
          <planeGeometry args={[2.5, 3.6]} />
          <meshBasicMaterial
            color="#a67c52"
            toneMapped={false}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>

      {/* H. Floating Accessories (Modular Pockets) */}
      {/* 1. Wireless Mouse */}
      <group ref={mouseRef}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.5, 0.15]} />
          <meshPhysicalMaterial
            color="#1e1e20"
            roughness={0.3}
            metalness={0.6}
            clearcoat={0.8}
          />
        </mesh>
        {/* Scroll wheel */}
        <mesh position={[0, 0.15, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 8]} />
          <meshBasicMaterial color="#a67c52" />
        </mesh>
      </group>

      {/* 2. Earbuds Capsule */}
      <group ref={earbudsRef}>
        <mesh castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.35, 16]} />
          <meshPhysicalMaterial
            color="#0f0f10"
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>
        {/* Golden ring */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.145, 0.145, 0.03, 16]} />
          <meshBasicMaterial color="#a67c52" />
        </mesh>
      </group>

      {/* 3. Modular Charger Pouch */}
      <group ref={chargerRef}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.7, 0.25]} />
          <meshPhysicalMaterial
            color="#18181a"
            roughness={0.85}
            metalness={0.1}
            normalMap={nylonTexture || undefined}
            normalScale={new THREE.Vector2(0.2, 0.2)}
          />
        </mesh>
        {/* Accent loop */}
        <mesh position={[-0.3, 0.3, 0.12]}>
          <boxGeometry args={[0.08, 0.2, 0.05]} />
          <meshBasicMaterial color="#a67c52" />
        </mesh>
      </group>

      {/* --- HOTSPOT MARKERS --- */}
      {hotspotsData.map((spot, i) => (
        <HotspotMarker
          key={i}
          position={spot.position}
          title={spot.title}
          desc={spot.desc}
          visible={scrollProgress.get() > 0.45 && scrollProgress.get() < 0.8}
          active={activeHotspot === i}
          onClick={() => {
            // Toggle active hotspot click
            if (activeHotspot === i) {
              setActiveHotspot(null);
            } else {
              setActiveHotspot(i);
            }
          }}
        />
      ))}
    </group>
  );
};

// Spotlight volumetric glow effect helper
const VolumetricLight = () => {
  const lightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      // Sweeping motion: moves side to side slowly
      const time = state.clock.getElapsedTime();
      lightRef.current.position.x = Math.sin(time * 0.5) * 4;
      lightRef.current.position.y = 5 + Math.cos(time * 0.4) * 1.5;
    }
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, 6, 4]}
      angle={0.4}
      penumbra={0.9}
      intensity={6.0}
      color="#ffffff"
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
  );
};

const MouseSpotlight = () => {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      // Convert standard pointer coords [-1, 1] to canvas units
      const x = state.pointer.x * 4;
      const y = state.pointer.y * 3.5;
      
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, x, 0.05);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, y, 0.05);
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 2.5]}
      intensity={5.0}
      distance={6}
      color="#a67c52"
      decay={2}
    />
  );
};

interface HeroCanvasProps {
  scrollProgress: MotionValue<number>;
  activeHotspot: number | null;
  setActiveHotspot: (index: number | null) => void;
}

const HeroCanvas: React.FC<HeroCanvasProps> = ({ scrollProgress, activeHotspot, setActiveHotspot }) => {
  return (
    <div className="w-full h-full absolute inset-0 z-10 select-none pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        className="pointer-events-auto"
      >
        <color attach="background" args={["#030303"]} />
        
        {/* ambient base */}
        <ambientLight intensity={0.15} />
        
        {/* standard fill light */}
        <directionalLight position={[-4, 3, -2]} intensity={0.5} color="#454550" />
        
        {/* premium lighting */}
        <VolumetricLight />
        <MouseSpotlight />
        
        {/* background custom shader plane */}
        <Background />
        
        {/* floating ambient particles */}
        <ParticleField />
        
        {/* Laptop bag 3D geometry */}
        <LaptopBag
          scrollProgress={scrollProgress}
          activeHotspot={activeHotspot}
          setActiveHotspot={setActiveHotspot}
        />
      </Canvas>
    </div>
  );
};

export default HeroCanvas;
