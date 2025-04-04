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
