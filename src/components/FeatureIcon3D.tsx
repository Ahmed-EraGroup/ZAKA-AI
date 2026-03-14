import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const VoiceHalo = () => {
  const barsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (barsRef.current) {
      barsRef.current.children.forEach((bar, i) => {
        const targetScale = 0.5 + Math.sin(clock.elapsedTime * 3.5 + i * 1.2) * 0.45;
        bar.scale.y = THREE.MathUtils.damp(bar.scale.y, targetScale, 12, delta);
      });
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group>
        {/* Microphone capsule */}
        <mesh position={[0, 0.25, 0]}>
          <capsuleGeometry args={[0.3, 0.35, 16, 32]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#c96b3e"
            emissiveIntensity={1.2}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
        {/* Grille rings */}
        {[0.35, 0.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <torusGeometry args={[0.3, 0.014, 16, 32]} />
            <meshStandardMaterial
              color="#d7b19b"
              emissive="#c96b3e"
              emissiveIntensity={i === 0 ? 2.0 : 1.2}
              metalness={0.95}
              roughness={0.05}
            />
          </mesh>
        ))}
        {/* Stand */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
          <meshStandardMaterial color="#d7b19b" emissive="#c96b3e" emissiveIntensity={0.5} metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.62, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.06, 32]} />
          <meshStandardMaterial color="#d7b19b" emissive="#c96b3e" emissiveIntensity={0.6} metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Audio bars */}
        <group ref={barsRef}>
          {[-0.35, -0.18, 0, 0.18, 0.35].map((x, i) => (
            <mesh key={i} position={[x, -0.88, 0]} scale={[0.05, 0.55, 0.05]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color="#c96b3e"
                emissive="#c96b3e"
                emissiveIntensity={2.5}
                transparent
                opacity={0.9}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
};

const ChatHalo = () => {
  const dotsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (dotsRef.current) {
      dotsRef.current.children.forEach((dot, i) => {
        dot.position.y = -0.05 + Math.sin(clock.elapsedTime * 2.2 + i * 0.9) * 0.07;
        const mat = (dot as THREE.Mesh).material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.5 + Math.sin(clock.elapsedTime * 2.2 + i * 0.9) * 1.0;
      });
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.5}>
      <group>
        {/* Bubble body */}
        <mesh position={[0, 0.1, 0]} scale={[1, 0.75, 0.4]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#c96b3e"
            emissiveIntensity={0.9}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
        {/* Bubble tail */}
        <mesh position={[-0.35, -0.35, 0]} rotation={[0, 0, Math.PI / 6]} scale={[0.15, 0.2, 0.12]}>
          <coneGeometry args={[1, 1.5, 3]} />
          <meshStandardMaterial color="#0f172a" emissive="#c96b3e" emissiveIntensity={0.9} metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Typing dots */}
        <group ref={dotsRef}>
          {[-0.15, 0, 0.15].map((x, i) => (
            <mesh key={i} position={[x, 0.1, 0.25]} scale={0.07}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="#c96b3e" emissive="#c96b3e" emissiveIntensity={2.0} />
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

  const gearShape = (teeth: number, outerR: number, innerR: number) => {
    const shape = new THREE.Shape();
    const step = (Math.PI * 2) / teeth;
    for (let i = 0; i < teeth; i++) {
      const a1 = i * step, a2 = a1 + step * 0.3, a3 = a1 + step * 0.5, a4 = a1 + step * 0.8;
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
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.14;
    if (gear1Ref.current) gear1Ref.current.rotation.z -= delta * 0.55;
    if (gear2Ref.current) gear2Ref.current.rotation.z += delta * 0.8;
  });

  return (
    <Float speed={1.0} rotationIntensity={0.16} floatIntensity={0.35}>
      <group ref={groupRef}>
        <mesh ref={gear1Ref} position={[-0.15, 0.1, 0]}>
          <extrudeGeometry args={[bigGear, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 }]} />
          <meshStandardMaterial color="#0f172a" emissive="#c96b3e" emissiveIntensity={1.1} metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh ref={gear2Ref} position={[0.42, -0.32, 0.06]}>
          <extrudeGeometry args={[smallGear, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 }]} />
          <meshStandardMaterial color="#0d1117" emissive="#c96b3e" emissiveIntensity={0.9} metalness={0.9} roughness={0.12} />
        </mesh>
        {/* Hubs */}
        <mesh position={[-0.15, 0.1, 0.09]}>
          <cylinderGeometry args={[0.12, 0.12, 0.18, 32]} />
          <meshStandardMaterial color="#d7b19b" emissive="#c96b3e" emissiveIntensity={2.0} metalness={0.95} roughness={0.08} />
        </mesh>
        <mesh position={[0.42, -0.32, 0.15]}>
          <cylinderGeometry args={[0.07, 0.07, 0.18, 32]} />
          <meshStandardMaterial color="#d7b19b" emissive="#c96b3e" emissiveIntensity={2.0} metalness={0.95} roughness={0.08} />
        </mesh>
      </group>
    </Float>
  );
};

interface FeatureIcon3DProps {
  type: "voice" | "chat" | "automation";
}

const FeatureIcon3D = ({ type }: FeatureIcon3DProps) => (
  <div className="relative w-36 h-36">
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 45 }}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.4,
        antialias: true,
      }}
    >
      <ambientLight intensity={0.05} />
      <directionalLight position={[4, 4, 5]} intensity={0.5} color="#d7b19b" />
      <pointLight position={[-2, 2, 3]} intensity={1.8} color="#c96b3e" />
      <pointLight position={[2, -2, -1]} intensity={0.6} color="#4facfe" />
      <Environment preset="city" />

      {type === "voice" && <VoiceHalo />}
      {type === "chat" && <ChatHalo />}
      {type === "automation" && <AutomationHalo />}

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.5}
          luminanceSmoothing={0.8}
          intensity={1.8}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  </div>
);

export default FeatureIcon3D;
