import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const RING_COUNT = 3;

const VoiceHalo = () => {
  const orbRef    = useRef<THREE.Mesh>(null);
  const ringsRef  = useRef<(THREE.Mesh | null)[]>([]);
  const groupRef  = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;

    // Orb gentle pulse
    if (orbRef.current) {
      const s = 1 + Math.sin(t * 2.2) * 0.045;
      orbRef.current.scale.setScalar(s);
      (orbRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.8 + Math.sin(t * 2.2) * 0.7;
    }

    // Rings expand outward and fade
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      const phase = (t * 0.7 + i / RING_COUNT) % 1;
      const s = 0.55 + phase * 1.1;
      ring.scale.setScalar(s);
      (ring.material as THREE.MeshStandardMaterial).opacity = (1 - phase) * 0.55;
    });

    // Slow group rotation
    if (groupRef.current)
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.25;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.1} floatIntensity={0.4}>
      <group ref={groupRef}>

        {/* Pulsing rings */}
        {Array.from({ length: RING_COUNT }).map((_, i) => (
          <mesh
            key={i}
            ref={(el) => { ringsRef.current[i] = el; }}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.42, 0.018, 8, 56]} />
            <meshStandardMaterial
              color="#c96b3e"
              emissive="#c96b3e"
              emissiveIntensity={2.0}
              transparent
              opacity={0.5}
              toneMapped={false}
            />
          </mesh>
        ))}

        {/* Central orb */}
        <mesh ref={orbRef}>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial
            color="#0d1b2a"
            emissive="#c96b3e"
            emissiveIntensity={1.8}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>

        {/* Inner glare highlight */}
        <mesh position={[-0.08, 0.1, 0.22]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.6}
            transparent
            opacity={0.18}
            toneMapped={false}
          />
        </mesh>

        {/* Mic stem */}
        <mesh position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.22, 12]} />
          <meshStandardMaterial
            color="#c96b3e"
            emissive="#c96b3e"
            emissiveIntensity={1.2}
            metalness={0.9}
            roughness={0.1}
            toneMapped={false}
          />
        </mesh>

        {/* Mic base bar */}
        <mesh position={[0, -0.53, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.28, 12]} />
          <meshStandardMaterial
            color="#c96b3e"
            emissive="#c96b3e"
            emissiveIntensity={1.2}
            metalness={0.9}
            roughness={0.1}
            toneMapped={false}
          />
        </mesh>

      </group>
    </Float>
  );
};

// Typing dot — bobs up/down with staggered delay
const TypingDot = ({ x, delay }: { x: number; delay: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = 0.24 + Math.sin(clock.elapsedTime * 3.5 + delay) * 0.055;
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      1.2 + Math.sin(clock.elapsedTime * 3.5 + delay) * 0.8;
  });
  return (
    <mesh ref={ref} position={[x, 0.24, 0.07]}>
      <sphereGeometry args={[0.055, 12, 12]} />
      <meshStandardMaterial color="#c96b3e" emissive="#c96b3e" emissiveIntensity={1.5} toneMapped={false} />
    </mesh>
  );
};

const ChatHalo = () => {
  const groupRef  = useRef<THREE.Group>(null);
  const bubble1   = useRef<THREE.Mesh>(null);
  const bubble2   = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current)
      groupRef.current.rotation.y = Math.sin(t * 0.32) * 0.22;

    // AI bubble gentle pulse
    if (bubble2.current) {
      (bubble2.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.6 + Math.sin(t * 2.0) * 0.5;
    }
    // User bubble subtle pulse
    if (bubble1.current) {
      (bubble1.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.1 + Math.sin(t * 1.6 + 1.2) * 0.3;
    }
  });

  return (
    <Float speed={0.9} rotationIntensity={0.08} floatIntensity={0.35}>
      <group ref={groupRef}>

        {/* User bubble — top left */}
        <group position={[-0.22, 0.32, 0]} rotation={[0, 0, 0.08]}>
          <mesh ref={bubble1}>
            <boxGeometry args={[0.72, 0.32, 0.12]} />
            <meshStandardMaterial
              color="#0d2a40"
              emissive="#4facfe"
              emissiveIntensity={1.1}
              metalness={0.5}
              roughness={0.3}
              transparent
              opacity={0.92}
            />
          </mesh>
          {/* Tail */}
          <mesh position={[0.3, -0.18, 0]} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[0.07, 0.14, 4]} />
            <meshStandardMaterial color="#0d2a40" emissive="#4facfe" emissiveIntensity={1.1} transparent opacity={0.92} />
          </mesh>
          {/* Lines inside (text lines) */}
          {[-0.18, 0, 0.18].map((x, i) => (
            <mesh key={i} position={[x, 0, 0.07]}>
              <boxGeometry args={[0.18 - i * 0.04, 0.028, 0.01]} />
              <meshStandardMaterial color="#4facfe" emissive="#4facfe" emissiveIntensity={0.8} transparent opacity={0.6} toneMapped={false} />
            </mesh>
          ))}
        </group>

        {/* AI bubble — bottom right with typing dots */}
        <group position={[0.18, -0.22, 0]} rotation={[0, 0, -0.06]}>
          <mesh ref={bubble2}>
            <boxGeometry args={[0.68, 0.32, 0.12]} />
            <meshStandardMaterial
              color="#1a0e08"
              emissive="#c96b3e"
              emissiveIntensity={1.6}
              metalness={0.6}
              roughness={0.2}
              transparent
              opacity={0.94}
            />
          </mesh>
          {/* Tail */}
          <mesh position={[-0.28, -0.18, 0]} rotation={[0, 0, -0.5]}>
            <coneGeometry args={[0.07, 0.14, 4]} />
            <meshStandardMaterial color="#1a0e08" emissive="#c96b3e" emissiveIntensity={1.6} transparent opacity={0.94} />
          </mesh>
          {/* Typing dots */}
          <TypingDot x={-0.13} delay={0} />
          <TypingDot x={0}     delay={0.8} />
          <TypingDot x={0.13}  delay={1.6} />
        </group>

      </group>
    </Float>
  );
};

// Single rotating gear in the XY plane
const Gear = ({
  position,
  radius,
  teethCount,
  speed,
  color = "#c96b3e",
  zOffset = 0,
}: {
  position: [number, number, number];
  radius: number;
  teethCount: number;
  speed: number; // rad/s, sign sets direction
  color?: string;
  zOffset?: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const thickness = 0.11;
  const toothH    = radius * 0.22;
  const toothW    = (2 * Math.PI * radius) / teethCount * 0.52;

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.z += delta * speed;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Disc body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, thickness, 40]} />
        <meshStandardMaterial
          color="#0d1b2a"
          emissive={color}
          emissiveIntensity={0.7}
          metalness={0.95}
          roughness={0.06}
        />
      </mesh>

      {/* Outer rim */}
      <mesh>
        <torusGeometry args={[radius, 0.022, 8, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.8}
          metalness={0.9}
          roughness={0.08}
          toneMapped={false}
        />
      </mesh>

      {/* Inner hub ring */}
      <mesh>
        <torusGeometry args={[radius * 0.38, 0.016, 8, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.3}
          metalness={0.9}
          roughness={0.1}
          toneMapped={false}
        />
      </mesh>

      {/* Teeth */}
      {Array.from({ length: teethCount }).map((_, i) => {
        const angle = (i / teethCount) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * (radius + toothH * 0.5),
              Math.sin(angle) * (radius + toothH * 0.5),
              0,
            ]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[toothH, toothW, thickness * 0.88]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={2.0}
              metalness={0.9}
              roughness={0.08}
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {/* Center axle */}
      <mesh>
        <sphereGeometry args={[radius * 0.15, 10, 10]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.9}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

const AutomationHalo = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current)
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.22;
  });

  // Large gear: r=0.44, 10 teeth, speed +0.55
  // Small gear right: r=0.22, 5 teeth, speed -1.1  (meshes at x≈0.66)
  // Small gear top-left: r=0.20, 5 teeth, speed -1.21 (meshes at top-left)
  return (
    <Float speed={0.85} rotationIntensity={0.09} floatIntensity={0.3}>
      <group ref={groupRef}>
        <Gear position={[-0.08,  0.04, 0]}   radius={0.44} teethCount={10} speed={ 0.55} />
        <Gear position={[ 0.66, -0.18, 0.02]} radius={0.22} teethCount={5}  speed={-1.10} color="#4facfe" />
      </group>
    </Float>
  );
};

interface FeatureIcon3DProps {
  type: "voice" | "chat" | "automation";
}

const FeatureIcon3D = ({ type }: FeatureIcon3DProps) => (
  <div className="relative w-48 h-48">
    <Canvas
      camera={{ position: [0, 0, 2.8], fov: 50 }}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.6,
        antialias: true,
      }}
    >
      <ambientLight intensity={0.08} />
      <directionalLight position={[4, 4, 5]} intensity={0.7} color="#d7b19b" />
      <pointLight position={[-2, 2, 3]} intensity={2.2} color="#c96b3e" />
      <pointLight position={[2, -2, -1]} intensity={0.8} color="#4facfe" />
      <pointLight position={[0, 0, 4]} intensity={0.4} color="#ffffff" />

      {type === "voice" && <VoiceHalo />}
      {type === "chat" && <ChatHalo />}
      {type === "automation" && <AutomationHalo />}
    </Canvas>
  </div>
);

export default FeatureIcon3D;
