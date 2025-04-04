import RewardMarkerComponent from "@/components/RewardMarket";
import { DroneControls, DroneState, GameState } from "@/types";
import {
  Environment,
  KeyboardControls,
  OrbitControls,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import Ape from "./Ape";
import Drone from "./Drone";
import EiffelTower from "./EiffelTower";

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

const Scene = ({
  droneState,
  droneControls,
  gameState,
  updateGameState,
}: {
  droneState: DroneState;
  droneControls: DroneControls;
  gameState: GameState;
  updateGameState: (droneState: DroneState) => void;
}) => {
  // Initialize game state with landmarks and reward markers
  // Update game state in each frame
  useFrame(() => {
    updateGameState(droneState);
  });

  // Check if all markers are collected to show the ape
  const allMarkersCollected = gameState.rewardMarkers.every(
    (marker) => marker.collected
  );

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
      {/* Eiffel Tower landmark */}
      <EiffelTower landmark={gameState.landmarks[0]} />
      {/* King Kong ape that appears when all markers are collected */}
      <Ape
        position={[0, 30, -20]} // Position at the top of the tower
        active={allMarkersCollected}
      />
      {/* Reward Markers */}
      {gameState.rewardMarkers.map((marker) => (
        <RewardMarkerComponent
          key={marker.id}
          marker={marker}
        />
      ))}
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
