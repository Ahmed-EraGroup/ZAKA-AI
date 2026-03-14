import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";

const BAR_COUNT = 32;

const VoiceHalo = () => {
  const barsRef = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }, delta) => {
    // Spectrum bars — smooth audio-like animation
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const target = 0.12 + Math.abs(Math.sin(clock.elapsedTime * 2.8 + i * 0.42)) * 0.88;
      bar.scale.y = THREE.MathUtils.damp(bar.scale.y, target, 8, delta);
    });
  });

  return (
    <Float speed={1.0} rotationIntensity={0.08} floatIntensity={0.35}>
      <group>
        {/* Circular spectrum bars */}
        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          const angle = (i / BAR_COUNT) * Math.PI * 2;
          const r = 0.56;
          return (
            <mesh
              key={i}
              ref={(el) => { barsRef.current[i] = el; }}
              position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}
              rotation={[0, -angle, 0]}
              scale={[0.038, 0.18, 0.038]}
            >
              <boxGeometry />
              <meshStandardMaterial
                color="#c96b3e"
                emissive="#c96b3e"
                emissiveIntensity={2.8}
                transparent
                opacity={0.95}
                toneMapped={false}
              />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
};

const U = new THREE.Vector3(-0.44, -0.28, 0);
const A = new THREE.Vector3( 0.44,  0.28, 0);

const MsgToken = ({ from, to, speed, offset, color }: {
  from: THREE.Vector3; to: THREE.Vector3;
  speed: number; offset: number; color: string;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const t   = useRef(offset);
  useFrame((_, delta) => {
    t.current = (t.current + delta * speed) % 1;
    ref.current?.position.lerpVectors(from, to, t.current);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 10, 10]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.5} toneMapped={false} />
    </mesh>
  );
};

const ChatHalo = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current)
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.18;
  });

  return (
    <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.38}>
      <group ref={groupRef}>

        {/* Connection */}
        <Line
          points={[U.toArray() as [number,number,number], A.toArray() as [number,number,number]]}
          color="#1e4060"
          lineWidth={1.2}
          transparent
          opacity={0.6}
        />

        {/* 2 tokens each direction */}
        <MsgToken from={U} to={A} speed={0.5}  offset={0}    color="#4facfe" />
        <MsgToken from={U} to={A} speed={0.5}  offset={0.5}  color="#4facfe" />
        <MsgToken from={A} to={U} speed={0.55} offset={0.25} color="#c96b3e" />
        <MsgToken from={A} to={U} speed={0.55} offset={0.75} color="#c96b3e" />

        {/* User orb */}
        <mesh position={U.toArray() as [number,number,number]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#0d1b2a" emissive="#4facfe" emissiveIntensity={1.8} metalness={0.95} roughness={0.08} />
        </mesh>

        {/* AI orb + ring */}
        <group position={A.toArray() as [number,number,number]}>
          <mesh>
            <sphereGeometry args={[0.28, 28, 28]} />
            <meshStandardMaterial color="#0d1b2a" emissive="#c96b3e" emissiveIntensity={2.2} metalness={0.95} roughness={0.05} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.36, 0.02, 8, 56]} />
            <meshStandardMaterial color="#c96b3e" emissive="#c96b3e" emissiveIntensity={1.6} transparent opacity={0.65} toneMapped={false} />
          </mesh>
        </group>

      </group>
    </Float>
  );
};

// Hub-and-spoke topology: center hub + 5 surrounding nodes
const HUB: [number, number, number] = [0, 0, 0];
const SPOKE_NODES: [number, number, number][] = [
  [0,     0.72,  0.05],
  [-0.64, 0.22,  0],
  [0.64,  0.22,  0],
  [-0.45, -0.58, 0.05],
  [0.45,  -0.58, 0.05],
];
// Two extra peer edges (not through hub) for realism
const PEER_EDGES: [[number,number,number],[number,number,number]][] = [
  [SPOKE_NODES[0], SPOKE_NODES[1]],
  [SPOKE_NODES[2], SPOKE_NODES[3]],
];

// Packet traveling from A → B along an edge
const DataPacket = ({
  from, to, speed, offset,
}: {
  from: [number,number,number];
  to: [number,number,number];
  speed: number;
  offset: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(offset);
  const vA = useMemo(() => new THREE.Vector3(...from), [from]);
  const vB = useMemo(() => new THREE.Vector3(...to),   [to]);

  useFrame((_, delta) => {
    t.current = (t.current + delta * speed) % 1;
    ref.current?.position.lerpVectors(vA, vB, t.current);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.038, 8, 8]} />
      <meshStandardMaterial
        color="#d7b19b"
        emissive="#c96b3e"
        emissiveIntensity={3.5}
        toneMapped={false}
      />
    </mesh>
  );
};

// Pulsing ring around the hub
const HubRing = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 2.5) * 0.06;
    ref.current.scale.setScalar(s);
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      1.2 + Math.sin(clock.elapsedTime * 2.5) * 0.8;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.18, 0.025, 12, 48]} />
      <meshStandardMaterial
        color="#c96b3e"
        emissive="#c96b3e"
        emissiveIntensity={1.5}
        metalness={0.9}
        roughness={0.1}
        toneMapped={false}
      />
    </mesh>
  );
};

const AutomationHalo = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current)
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.28) * 0.2;
  });

  return (
    <Float speed={0.9} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef}>

        {/* Hub → spoke edges */}
        {SPOKE_NODES.map((node, i) => (
          <Line
            key={`hub-${i}`}
            points={[HUB, node]}
            color="#c96b3e"
            lineWidth={0.8}
            transparent
            opacity={0.35}
          />
        ))}

        {/* Peer edges */}
        {PEER_EDGES.map(([a, b], i) => (
          <Line
            key={`peer-${i}`}
            points={[a, b]}
            color="#4a7fa5"
            lineWidth={0.6}
            transparent
            opacity={0.25}
          />
        ))}

        {/* Data packets along hub→spoke */}
        {SPOKE_NODES.map((node, i) => (
          <DataPacket
            key={`pkt-${i}`}
            from={HUB}
            to={node}
            speed={0.55 + i * 0.08}
            offset={i / SPOKE_NODES.length}
          />
        ))}

        {/* Spoke nodes */}
        {SPOKE_NODES.map((pos, i) => (
          <group key={`node-${i}`} position={pos}>
            <mesh>
              <sphereGeometry args={[0.085, 16, 16]} />
              <meshStandardMaterial
                color="#1e3a5a"
                emissive="#c96b3e"
                emissiveIntensity={0.7}
                metalness={0.95}
                roughness={0.1}
              />
            </mesh>
            {/* outer ring on each node */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.13, 0.012, 8, 32]} />
              <meshStandardMaterial
                color="#c96b3e"
                emissive="#c96b3e"
                emissiveIntensity={0.5}
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        ))}

        {/* Center hub */}
        <group position={HUB}>
          <mesh>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive="#c96b3e"
              emissiveIntensity={1.8}
              metalness={0.95}
              roughness={0.05}
            />
          </mesh>
          <HubRing />
        </group>

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
