import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const VoiceHalo = () => {
  const groupRef = useRef<THREE.Group>(null);
  const barsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    // Animate sound bars
    if (barsRef.current) {
      barsRef.current.children.forEach((bar, i) => {
        const targetScale = 0.66 + Math.sin(clock.elapsedTime * 3.1 + i * 1.15) * 0.26;
        bar.scale.y = THREE.MathUtils.damp(bar.scale.y, targetScale, 13, delta);
      });
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.22} floatIntensity={0.45}>
      <group ref={groupRef}>
        {/* Microphone head (capsule) */}
        <mesh position={[0, 0.25, 0]}>
          <capsuleGeometry args={[0.3, 0.35, 16, 32]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive="#c96b3e"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
        {/* Mic grille lines */}
        <mesh position={[0, 0.35, 0]}>
          <torusGeometry args={[0.3, 0.015, 16, 32]} />
          <meshStandardMaterial
            color="#d7b19b"
            emissive="#c96b3e"
            emissiveIntensity={0.8}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.3, 0.012, 16, 32]} />
          <meshStandardMaterial
            color="#64748b"
            emissive="#c96b3e"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.12}
            transparent
            opacity={0.6}
          />
        </mesh>
        {/* Mic stand */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
          <meshStandardMaterial
            color="#d7b19b"
            emissive="#c96b3e"
            emissiveIntensity={0.2}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.62, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.06, 32]} />
          <meshStandardMaterial
            color="#d7b19b"
            emissive="#c96b3e"
            emissiveIntensity={0.3}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
        {/* Audio wave bars */}
        <group ref={barsRef}>
          {[-0.35, -0.18, 0, 0.18, 0.35].map((x, i) => (
            <mesh key={i} position={[x, -0.85, 0]} scale={[0.04, 0.6, 0.04]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color="#c96b3e"
                emissive="#c96b3e"
                emissiveIntensity={1.2}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
};

const ChatHalo = () => {
  const groupRef = useRef<THREE.Group>(null);
  const dotsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    // Typing dots animation
    if (dotsRef.current) {
      dotsRef.current.children.forEach((dot, i) => {
        dot.position.y = -0.05 + Math.sin(clock.elapsedTime * 2.1 + i * 0.8) * 0.06;
        const mat = (dot as THREE.Mesh).material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.8 + Math.sin(clock.elapsedTime * 2.1 + i * 0.8) * 0.4;
      });
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.45}>
      <group ref={groupRef}>
        {/* Chat bubble body - rounded box */}
        <mesh position={[0, 0.1, 0]} scale={[1, 0.75, 0.4]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive="#c96b3e"
            emissiveIntensity={0.5}
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
        {/* Bubble tail */}
        <mesh position={[-0.35, -0.35, 0]} rotation={[0, 0, Math.PI / 6]} scale={[0.15, 0.2, 0.12]}>
          <coneGeometry args={[1, 1.5, 3]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive="#c96b3e"
            emissiveIntensity={0.5}
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
        {/* Typing indicator dots */}
        <group ref={dotsRef}>
          {[-0.15, 0, 0.15].map((x, i) => (
            <mesh key={i} position={[x, 0.1, 0.25]} scale={0.06}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color="#c96b3e"
                emissive="#c96b3e"
                emissiveIntensity={1}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
};

const AutomationHalo = () => {
  const groupRef = useRef<THREE.Group>(null);
  const gear1Ref = useRef<THREE.Mesh>(null);
  const gear2Ref = useRef<THREE.Mesh>(null);

  // Create gear shape
  const gearShape = (teeth: number, outerR: number, innerR: number) => {
    const shape = new THREE.Shape();
    const step = (Math.PI * 2) / teeth;
    for (let i = 0; i < teeth; i++) {
      const a1 = i * step;
      const a2 = a1 + step * 0.3;
      const a3 = a1 + step * 0.5;
      const a4 = a1 + step * 0.8;
      shape.lineTo(Math.cos(a1) * innerR, Math.sin(a1) * innerR);
      shape.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
      shape.lineTo(Math.cos(a3) * outerR, Math.sin(a3) * outerR);
      shape.lineTo(Math.cos(a4) * innerR, Math.sin(a4) * innerR);
    }
    shape.closePath();
    return shape;
  };

  const bigGear = gearShape(8, 0.55, 0.42);
  const smallGear = gearShape(6, 0.32, 0.24);

  useFrame(({ clock }, delta) => {
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.12;
    if (gear1Ref.current) gear1Ref.current.rotation.z -= delta * 0.55;
    if (gear2Ref.current) gear2Ref.current.rotation.z += delta * 0.8;
  });

  return (
    <Float speed={1.0} rotationIntensity={0.16} floatIntensity={0.35}>
      <group ref={groupRef}>
        {/* Big gear */}
        <mesh ref={gear1Ref} position={[-0.15, 0.1, 0]}>
          <extrudeGeometry args={[bigGear, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 }]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive="#c96b3e"
            emissiveIntensity={0.6}
            metalness={0.95}
            roughness={0.12}
          />
        </mesh>
        {/* Small gear */}
        <mesh ref={gear2Ref} position={[0.42, -0.32, 0.06]}>
          <extrudeGeometry args={[smallGear, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 }]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#c96b3e"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
        {/* Center hub big gear */}
        <mesh position={[-0.15, 0.1, 0.07]}>
          <cylinderGeometry args={[0.12, 0.12, 0.16, 32]} />
          <meshStandardMaterial
            color="#d7b19b"
            emissive="#c96b3e"
            emissiveIntensity={0.8}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
        {/* Center hub small gear */}
        <mesh position={[0.42, -0.32, 0.13]}>
          <cylinderGeometry args={[0.07, 0.07, 0.16, 32]} />
          <meshStandardMaterial
            color="#d7b19b"
            emissive="#c96b3e"
            emissiveIntensity={0.8}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
};

interface FeatureIcon3DProps {
  type: "voice" | "chat" | "automation";
}

const FeatureIcon3D = ({ type }: FeatureIcon3DProps) => (
  <div className="relative w-24 h-24 translate-y-2">
    <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 3, 5]} intensity={0.6} color="#d7b19b" />
      <pointLight position={[-2, 1, 3]} intensity={0.4} color="#c96b3e" />
      <pointLight position={[2, -1, -2]} intensity={0.2} color="#c96b3e" />
      {type === "voice" && <VoiceHalo />}
      {type === "chat" && <ChatHalo />}
      {type === "automation" && <AutomationHalo />}
    </Canvas>
  </div>
);

export default FeatureIcon3D;
