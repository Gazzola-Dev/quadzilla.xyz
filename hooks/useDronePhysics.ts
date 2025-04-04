import {
  DroneControls,
  DroneInputs,
  DronePhysicsConfig,
  DroneState,
} from "@/types";
import { useRef, useState } from "react";

const defaultPhysicsConfig: DronePhysicsConfig = {
  maxSpeed: 5,
  acceleration: 10,
  drag: 0.95,
  gravity: 9.8,
  hoverStrength: 9.8,
  maxRotation: Math.PI / 6, // 30 degrees
  rotationSpeed: 2,
  rotationDamping: 0.9,
};

export function useDronePhysics(
  initialPosition: [number, number, number] = [0, 5, 0],
  config: Partial<DronePhysicsConfig> = {}
): [DroneState, DroneControls] {
  const physicsConfig = { ...defaultPhysicsConfig, ...config };

  const [droneState, setDroneState] = useState<DroneState>({
    position: initialPosition,
    rotation: [0, 0, 0],
    velocity: [0, 0, 0],
    rotationVelocity: [0, 0, 0],
    isHovering: true,
  });

  const inputsRef = useRef<DroneInputs>({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
    yawLeft: false,
    yawRight: false,
  });

  const setInputs = (inputs: Partial<DroneInputs>) => {
    inputsRef.current = { ...inputsRef.current, ...inputs };
  };

  const resetPosition = () => {
    setDroneState({
      position: initialPosition,
      rotation: [0, 0, 0],
      velocity: [0, 0, 0],
      rotationVelocity: [0, 0, 0],
      isHovering: true,
    });
  };

  // This function will be called from a component inside the Canvas
  const updatePhysics = (delta: number) => {
    if (delta > 0.1) delta = 0.1; // Cap delta time to prevent jumps after tab switching

    setDroneState((prevState) => {
      const inputs = inputsRef.current;

      // Calculate acceleration from inputs
      const acceleration: [number, number, number] = [0, 0, 0];
      const targetRotation: [number, number, number] = [...prevState.rotation];

      // Forward/Backward movement (Z axis)
      if (inputs.moveForward) {
        acceleration[2] -= physicsConfig.acceleration;
        targetRotation[0] = physicsConfig.maxRotation;
      }
      if (inputs.moveBackward) {
        acceleration[2] += physicsConfig.acceleration;
        targetRotation[0] = -physicsConfig.maxRotation;
      }

      // Left/Right movement (X axis)
      if (inputs.moveLeft) {
        acceleration[0] -= physicsConfig.acceleration;
        targetRotation[2] = physicsConfig.maxRotation;
      }
      if (inputs.moveRight) {
        acceleration[0] += physicsConfig.acceleration;
        targetRotation[2] = -physicsConfig.maxRotation;
      }

      // Up/Down movement (Y axis)
      if (inputs.moveUp) {
        acceleration[1] += physicsConfig.acceleration;
      }
      if (inputs.moveDown) {
        acceleration[1] -= physicsConfig.acceleration;
      }

      // Yaw rotation (Y axis rotation)
      if (inputs.yawLeft) {
        targetRotation[1] += delta * physicsConfig.rotationSpeed;
      }
      if (inputs.yawRight) {
        targetRotation[1] -= delta * physicsConfig.rotationSpeed;
      }

      // Smoothly interpolate to target rotation
      let newRotationVelocity: [number, number, number] = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        if (i === 1 && (inputs.yawLeft || inputs.yawRight)) {
          // For yaw, we use direct control
          newRotationVelocity[i] = prevState.rotationVelocity[i];
        } else {
          // For pitch and roll, we move toward target with dampening
          newRotationVelocity[i] =
            (targetRotation[i] - prevState.rotation[i]) *
            physicsConfig.rotationSpeed;
        }
      }

      // Apply dampening
      newRotationVelocity = newRotationVelocity.map(
        (v) => v * physicsConfig.rotationDamping
      ) as [number, number, number];

      // Update rotation
      const newRotation = prevState.rotation.map(
        (r, i) => r + newRotationVelocity[i] * delta
      ) as [number, number, number];

      // If not moving, gradually return to level rotation (except for yaw)
      if (!inputs.moveForward && !inputs.moveBackward) {
        newRotation[0] *= 0.9;
      }
      if (!inputs.moveLeft && !inputs.moveRight) {
        newRotation[2] *= 0.9;
      }

      // Apply hover force + gravity
      const hoverForce = prevState.isHovering ? physicsConfig.hoverStrength : 0;
      const gravityForce = physicsConfig.gravity;
      acceleration[1] += hoverForce - gravityForce;

      // Apply acceleration to velocity
      let newVelocity = prevState.velocity.map(
        (v, i) => v + acceleration[i] * delta
      ) as [number, number, number];

      // Apply drag to velocity
      newVelocity = newVelocity.map((v) => v * physicsConfig.drag) as [
        number,
        number,
        number
      ];

      // Limit maximum speed
      const speed = Math.sqrt(
        newVelocity[0] * newVelocity[0] +
          newVelocity[1] * newVelocity[1] +
          newVelocity[2] * newVelocity[2]
      );

      if (speed > physicsConfig.maxSpeed) {
        const factor = physicsConfig.maxSpeed / speed;
        newVelocity = newVelocity.map((v) => v * factor) as [
          number,
          number,
          number
        ];
      }

      // Apply velocity to position
      const newPosition = prevState.position.map(
        (p, i) => p + newVelocity[i] * delta
      ) as [number, number, number];

      // Prevent drone from going below ground
      if (newPosition[1] < 0) {
        newPosition[1] = 0;
        newVelocity[1] = 0;
      }

      return {
        position: newPosition,
        rotation: newRotation,
        velocity: newVelocity,
        rotationVelocity: newRotationVelocity,
        isHovering: prevState.isHovering,
      };
    });
  };

  return [
    droneState,
    {
      setInputs,
      resetPosition,
      updatePhysics, // Expose the update function
    },
  ];
}

export function useKeyboardControls(droneControls: DroneControls): void {
  const { setInputs } = droneControls;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
          setInputs({ moveForward: true });
          break;
        case "s":
          setInputs({ moveBackward: true });
          break;
        case "a":
          setInputs({ moveLeft: true });
          break;
        case "d":
          setInputs({ moveRight: true });
          break;
        case " ":
          setInputs({ moveUp: true });
          break;
        case "shift":
          setInputs({ moveDown: true });
          break;
        case "q":
          setInputs({ yawLeft: true });
          break;
        case "e":
          setInputs({ yawRight: true });
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
          setInputs({ moveForward: false });
          break;
        case "s":
          setInputs({ moveBackward: false });
          break;
        case "a":
          setInputs({ moveLeft: false });
          break;
        case "d":
          setInputs({ moveRight: false });
          break;
        case " ":
          setInputs({ moveUp: false });
          break;
        case "shift":
          setInputs({ moveDown: false });
          break;
        case "q":
          setInputs({ yawLeft: false });
          break;
        case "e":
          setInputs({ yawRight: false });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setInputs]);
}

// Import missing useEffect
import { useEffect } from "react";
