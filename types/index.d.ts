// Drone physics and control types
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
  updatePhysics: (delta: number) => void;
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

// Game simulation types
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

export interface Collisions {
  hitGround: boolean;
  hitLandmark: boolean;
  collidedWithMarker: number | null;
}

export interface GameState {
  landmarks: Landmark[];
  rewardMarkers: RewardMarker[];
  collisions: Collisions;
  score: number;
}

// King Kong effects
export interface Plane {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  hit: boolean;
}

export interface ApeState {
  active: boolean;
  armSwing: number;
  armSwingDirection: number;
  planes: Plane[];
}
