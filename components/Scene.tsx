import { useDronePhysics } from "@/hooks/useDronePhysics";
import {
  Environment,
  KeyboardControls,
  OrbitControls,
} from "@react-three/drei";
import React from "react";
import Drone from "./Drone";

// Define keyboard controls map
enum Controls {
  moveForward = "moveForward",
  moveBackward = "moveBackward",
  moveLeft = "moveLeft",
  moveRight = "moveRight",
  moveUp = "moveUp",
  moveDown = "moveDown",
  yawLeft = "yawLeft",
  yawRight = "yawRight",
}

const Scene: React.FC = () => {
  // Initialize drone physics inside the Scene component
  const [droneState, droneControls] = useDronePhysics([0, 5, 0]);

  return (
    <KeyboardControls
      map={[
        { name: Controls.moveForward, keys: ["w", "ArrowUp"] },
        { name: Controls.moveBackward, keys: ["s", "ArrowDown"] },
        { name: Controls.moveLeft, keys: ["a", "ArrowLeft"] },
        { name: Controls.moveRight, keys: ["d", "ArrowRight"] },
        { name: Controls.moveUp, keys: [" "] },
        { name: Controls.moveDown, keys: ["Shift"] },
        { name: Controls.yawLeft, keys: ["q"] },
        { name: Controls.yawRight, keys: ["e"] },
      ]}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Scene environment */}
      <Environment preset="sunset" />

      {/* Drone */}
      <Drone
        droneState={droneState}
        droneControls={droneControls}
      />

      {/* Ground */}
      <mesh
        position={[0, -0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#5a7d7c" />
      </mesh>

      {/* Camera controls */}
      <OrbitControls
        target={[
          droneState.position[0],
          droneState.position[1],
          droneState.position[2],
        ]}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={20}
      />
    </KeyboardControls>
  );
};

export default Scene;
