import { useCallback, useState } from "react";

import { DroneState, GameState, Landmark, RewardMarker } from "@/types";

// Eiffel Tower landmark data
export const EIFFEL_TOWER: Landmark = {
  name: "Eiffel Tower",
  position: [0, 0, -20], // Placed forward from the starting position
  scale: [10, 30, 10], // Tall and thin structure
  rotation: [0, 0, 0], // No rotation initially
};

// Initial reward markers positioned around the Eiffel Tower
export const INITIAL_REWARD_MARKERS: RewardMarker[] = [
  // Markers at different heights around the tower
  { id: 1, position: [5, 10, -20], collected: false }, // Right side, mid-height
  { id: 2, position: [-5, 15, -20], collected: false }, // Left side, higher up
  { id: 3, position: [0, 25, -20], collected: false }, // Top of the tower
  { id: 4, position: [0, 5, -25], collected: false }, // Behind the tower
  { id: 5, position: [0, 8, -15], collected: false }, // In front of the tower
];

// Collision detection parameters
export const COLLISION_THRESHOLD = 2; // Distance threshold for collision detection
export const MARKER_COLLECTION_RADIUS = 1.5; // Distance needed to collect a marker

export function useGameState(resetDronePosition: () => void) {
  const [gameState, setGameState] = useState<GameState>({
    landmarks: [EIFFEL_TOWER],
    rewardMarkers: INITIAL_REWARD_MARKERS,
    collisions: {
      hitGround: false,
      hitLandmark: false,
      collidedWithMarker: null,
    },
    score: 0,
  });

  // Check collision with ground
  const checkGroundCollision = useCallback(
    (droneState: DroneState): boolean => {
      return droneState.position[1] <= 0.2; // If drone is very close to ground
    },
    []
  );

  // Check collision with landmark
  const checkLandmarkCollision = useCallback(
    (droneState: DroneState): boolean => {
      const landmark = EIFFEL_TOWER;
      const droneX = droneState.position[0];
      const droneY = droneState.position[1];
      const droneZ = droneState.position[2];

      // Simplified collision box for the Eiffel Tower
      const towerMinX = landmark.position[0] - landmark.scale[0] / 2;
      const towerMaxX = landmark.position[0] + landmark.scale[0] / 2;
      const towerMinY = landmark.position[1];
      const towerMaxY = landmark.position[1] + landmark.scale[1];
      const towerMinZ = landmark.position[2] - landmark.scale[2] / 2;
      const towerMaxZ = landmark.position[2] + landmark.scale[2] / 2;

      return (
        droneX >= towerMinX &&
        droneX <= towerMaxX &&
        droneY >= towerMinY &&
        droneY <= towerMaxY &&
        droneZ >= towerMinZ &&
        droneZ <= towerMaxZ
      );
    },
    []
  );

  // Check if drone has collected any reward markers
  const checkMarkerCollection = useCallback(
    (droneState: DroneState): number | null => {
      for (const marker of gameState.rewardMarkers) {
        if (marker.collected) continue;

        const distance = Math.sqrt(
          Math.pow(droneState.position[0] - marker.position[0], 2) +
            Math.pow(droneState.position[1] - marker.position[1], 2) +
            Math.pow(droneState.position[2] - marker.position[2], 2)
        );

        if (distance < MARKER_COLLECTION_RADIUS) {
          return marker.id;
        }
      }
      return null;
    },
    [gameState.rewardMarkers]
  );

  // Update game state based on drone position
  const updateGameState = useCallback(
    (droneState: DroneState) => {
      const hitGround = checkGroundCollision(droneState);
      const hitLandmark = checkLandmarkCollision(droneState);
      const collidedWithMarker = checkMarkerCollection(droneState);

      if (hitGround || hitLandmark) {
        resetDronePosition();
      }

      if (collidedWithMarker) {
        // Update the marker as collected and increase score
        setGameState((prev) => {
          const updatedMarkers = prev.rewardMarkers.map((marker) =>
            marker.id === collidedWithMarker
              ? { ...marker, collected: true }
              : marker
          );

          return {
            ...prev,
            rewardMarkers: updatedMarkers,
            score: prev.score + 100,
            collisions: { hitGround, hitLandmark, collidedWithMarker },
          };
        });
      } else {
        setGameState((prev) => ({
          ...prev,
          collisions: { hitGround, hitLandmark, collidedWithMarker },
        }));
      }
    },
    [
      checkGroundCollision,
      checkLandmarkCollision,
      checkMarkerCollection,
      resetDronePosition,
    ]
  );

  // Reset all game state
  const resetGame = useCallback(() => {
    setGameState({
      landmarks: [EIFFEL_TOWER],
      rewardMarkers: INITIAL_REWARD_MARKERS,
      collisions: {
        hitGround: false,
        hitLandmark: false,
        collidedWithMarker: null,
      },
      score: 0,
    });
    resetDronePosition();
  }, [resetDronePosition]);

  return {
    gameState,
    updateGameState,
    resetGame,
  };
}
