// Type definitions for the drone simulator
export interface DroneState {
  position: [number, number, number];
  rotation: [number, number, number];
  velocity: [number, number, number];
  rotationVelocity: [number, number, number];
  isHovering: boolean;
}

export interface DroneInputs {
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  moveUp: boolean;
  moveDown: boolean;
  yawLeft: boolean;
  yawRight: boolean;
}

export interface DroneControls {
  setInputs: (inputs: Partial<DroneInputs>) => void;
  resetPosition: () => void;
  updatePhysics: (delta: number) => void; // Added updatePhysics function
}

export interface DronePhysicsConfig {
  maxSpeed: number;
  acceleration: number;
  drag: number;
  gravity: number;
  hoverStrength: number;
  maxRotation: number;
  rotationSpeed: number;
  rotationDamping: number;
}

// Type definitions for the landmark and reward system
export interface Landmark {
  name: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
}

export interface RewardMarker {
  id: number;
  position: [number, number, number];
  collected: boolean;
}

export interface CollisionState {
  hitGround: boolean;
  hitLandmark: boolean;
  collidedWithMarker: number | null;
}

export interface GameState {
  landmarks: Landmark[];
  rewardMarkers: RewardMarker[];
  collisions: CollisionState;
  score: number;
}
