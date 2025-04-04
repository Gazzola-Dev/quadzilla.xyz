import { RewardMarker } from "@/types";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { Mesh } from "three";

interface RewardMarkerProps {
  marker: RewardMarker;
}

const RewardMarkerComponent: React.FC<RewardMarkerProps> = ({ marker }) => {
  const { position, collected } = marker;
  const sphereRef = useRef<Mesh>(null);

  // Rotating animation for the reward marker
  useFrame((_, delta) => {
    if (sphereRef.current && !collected) {
      sphereRef.current.rotation.y += delta * 2;
    }
  });

  if (collected) return null; // Don't render collected markers

  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Glowing sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFCC00"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Point light to make it glow */}
      <pointLight
        color="#FFCC00"
        intensity={0.8}
        distance={3}
      />
    </group>
  );
};

export default RewardMarkerComponent;
