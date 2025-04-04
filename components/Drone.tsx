import { DroneControls, DroneState } from "@/types";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { Color, Group } from "three";

// Define keyboard controls map type
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

interface DroneProps {
  droneState: DroneState;
  droneControls: DroneControls;
}

const Drone: React.FC<DroneProps> = ({ droneState, droneControls }) => {
  const groupRef = useRef<Group>(null);

  // Use keyboard controls with proper selector function
  const forward = useKeyboardControls<Controls>((state) => state.moveForward);
  const backward = useKeyboardControls<Controls>((state) => state.moveBackward);
  const left = useKeyboardControls<Controls>((state) => state.moveLeft);
  const right = useKeyboardControls<Controls>((state) => state.moveRight);
  const up = useKeyboardControls<Controls>((state) => state.moveUp);
  const down = useKeyboardControls<Controls>((state) => state.moveDown);
  const yawLeft = useKeyboardControls<Controls>((state) => state.yawLeft);
  const yawRight = useKeyboardControls<Controls>((state) => state.yawRight);

  // Update drone inputs based on keyboard state
  useEffect(() => {
    droneControls.setInputs({
      moveForward: forward,
      moveBackward: backward,
      moveLeft: left,
      moveRight: right,
      moveUp: up,
      moveDown: down,
      yawLeft: yawLeft,
      yawRight: yawRight,
    });
  }, [
    forward,
    backward,
    left,
    right,
    up,
    down,
    yawLeft,
    yawRight,
    droneControls,
  ]);

  // Update physics in useFrame
  useFrame((_, delta) => {
    // Call the updatePhysics function
    if (droneControls.updatePhysics) {
      droneControls.updatePhysics(delta);
    }

    // Update the drone's position and rotation
    if (!groupRef.current) return;
    const { position, rotation } = droneState;
    groupRef.current.position.set(position[0], position[1], position[2]);
    groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
  });

  // Motor animation
  const propeller1Ref = useRef<Group>(null);
  const propeller2Ref = useRef<Group>(null);
  const propeller3Ref = useRef<Group>(null);
  const propeller4Ref = useRef<Group>(null);

  useFrame((_, delta) => {
    // Animate propellers
    const rotationSpeed = 10;

    if (propeller1Ref.current)
      propeller1Ref.current.rotation.y += rotationSpeed * delta;
    if (propeller2Ref.current)
      propeller2Ref.current.rotation.y += rotationSpeed * delta;
    if (propeller3Ref.current)
      propeller3Ref.current.rotation.y += rotationSpeed * delta;
    if (propeller4Ref.current)
      propeller4Ref.current.rotation.y += rotationSpeed * delta;
  });

  return (
    <group ref={groupRef}>
      {/* Drone body */}
      <mesh>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Arms */}
      <group>
        {/* Front-left arm */}
        <mesh position={[-0.7, 0, -0.7]}>
          <boxGeometry args={[0.1, 0.1, 0.8]} />
          <meshStandardMaterial color="darkgray" />
        </mesh>

        {/* Front-right arm */}
        <mesh position={[0.7, 0, -0.7]}>
          <boxGeometry args={[0.1, 0.1, 0.8]} />
          <meshStandardMaterial color="darkgray" />
        </mesh>

        {/* Back-left arm */}
        <mesh position={[-0.7, 0, 0.7]}>
          <boxGeometry args={[0.1, 0.1, 0.8]} />
          <meshStandardMaterial color="darkgray" />
        </mesh>

        {/* Back-right arm */}
        <mesh position={[0.7, 0, 0.7]}>
          <boxGeometry args={[0.1, 0.1, 0.8]} />
          <meshStandardMaterial color="darkgray" />
        </mesh>
      </group>

      {/* Propellers */}
      <group
        ref={propeller1Ref}
        position={[-0.7, 0.1, -0.7]}
      >
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.05, 0.1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.05, 0.1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      <group
        ref={propeller2Ref}
        position={[0.7, 0.1, -0.7]}
      >
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.05, 0.1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.05, 0.1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      <group
        ref={propeller3Ref}
        position={[-0.7, 0.1, 0.7]}
      >
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.05, 0.1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.05, 0.1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      <group
        ref={propeller4Ref}
        position={[0.7, 0.1, 0.7]}
      >
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.05, 0.1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.8, 0.05, 0.1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      {/* LED lights */}
      <pointLight
        position={[-0.7, 0.1, -0.7]}
        intensity={0.2}
        color={new Color("red")}
        distance={1}
      />
      <pointLight
        position={[0.7, 0.1, -0.7]}
        intensity={0.2}
        color={new Color("green")}
        distance={1}
      />
      <pointLight
        position={[-0.7, 0.1, 0.7]}
        intensity={0.2}
        color={new Color("blue")}
        distance={1}
      />
      <pointLight
        position={[0.7, 0.1, 0.7]}
        intensity={0.2}
        color={new Color("yellow")}
        distance={1}
      />
    </group>
  );
};

export default Drone;
