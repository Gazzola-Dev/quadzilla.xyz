import { Landmark } from "@/types";
import React from "react";

interface EiffelTowerProps {
  landmark: Landmark;
}

const EiffelTower: React.FC<EiffelTowerProps> = ({ landmark }) => {
  const { position, scale, rotation } = landmark;

  return (
    <group
      position={[position[0], position[1], position[2]]}
      rotation={[rotation[0], rotation[1], rotation[2]]}
    >
      {/* Base of the tower */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[scale[0], 4, scale[2]]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      {/* Middle section */}
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[scale[0] * 0.7, 12, scale[2] * 0.7]} />
        <meshStandardMaterial color="#777777" />
      </mesh>

      {/* Upper middle section */}
      <mesh position={[0, 18, 0]}>
        <boxGeometry args={[scale[0] * 0.4, 8, scale[2] * 0.4]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Top spire */}
      <mesh position={[0, 26, 0]}>
        <coneGeometry args={[scale[0] * 0.2, 8, 4]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Base legs - X shape */}
      <mesh
        position={[scale[0] / 2 - 1, 1, scale[2] / 2 - 1]}
        rotation={[0, 0, Math.PI / 6]}
      >
        <boxGeometry args={[4, 1, 1]} />
        <meshStandardMaterial color="#999999" />
      </mesh>

      <mesh
        position={[-scale[0] / 2 + 1, 1, scale[2] / 2 - 1]}
        rotation={[0, 0, -Math.PI / 6]}
      >
        <boxGeometry args={[4, 1, 1]} />
        <meshStandardMaterial color="#999999" />
      </mesh>

      <mesh
        position={[scale[0] / 2 - 1, 1, -scale[2] / 2 + 1]}
        rotation={[0, 0, Math.PI / 6]}
      >
        <boxGeometry args={[4, 1, 1]} />
        <meshStandardMaterial color="#999999" />
      </mesh>

      <mesh
        position={[-scale[0] / 2 + 1, 1, -scale[2] / 2 + 1]}
        rotation={[0, 0, -Math.PI / 6]}
      >
        <boxGeometry args={[4, 1, 1]} />
        <meshStandardMaterial color="#999999" />
      </mesh>
    </group>
  );
};

export default EiffelTower;
