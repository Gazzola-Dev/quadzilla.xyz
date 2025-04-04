import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ApeProps {
  position: [number, number, number];
  active: boolean;
}

const Ape: React.FC<ApeProps> = ({ position, active }) => {
  const apeRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Mesh>(null);
  const swingDirection = useRef(1);
  const swingSpeed = useRef(2);
  const ref = useRef<THREE.Group>(null);

  // Planes circling the tower
  const planes = useRef<THREE.Group[]>([]);
  const planeRefs = Array(3)
    .fill(0)
    .map(() => ref);

  useEffect(() => {
    // Initialize planes when component mounts
    planes.current = planeRefs.map((ref) => ref.current!);
  }, []);

  useFrame((_, delta) => {
    if (!active || !apeRef.current || !armRef.current) return;

    // Make ape rotate slowly to look around
    apeRef.current.rotation.y += delta * 0.3;

    // Swing arm
    if (armRef.current) {
      armRef.current.rotation.z +=
        delta * swingSpeed.current * swingDirection.current;

      // Change direction when arm reaches limits
      if (armRef.current.rotation.z > 0.7) {
        swingDirection.current = -1;
      } else if (armRef.current.rotation.z < -0.2) {
        swingDirection.current = 1;
      }
    }

    // Move planes in circular paths
    planes.current.forEach((plane, i) => {
      if (plane) {
        // Different radius and height for each plane
        const radius = 15 + i * 3;
        const height = position[1] + 5 - i * 2;
        const speed = 1 + i * 0.3;

        // Calculate new position in circular path
        const angle = (Date.now() * 0.001 * speed) % (Math.PI * 2);
        const x = position[0] + Math.cos(angle) * radius;
        const z = position[2] + Math.sin(angle) * radius;

        plane.position.set(x, height, z);

        // Make plane face tangent to circle
        plane.rotation.y = angle + Math.PI / 2;

        // Check if plane is close to ape's arm
        const distToApe = Math.sqrt(
          Math.pow(x - position[0], 2) + Math.pow(z - position[2], 2)
        );

        // If ape's arm is swinging in this direction and plane is close, "hit" the plane
        if (
          distToApe < 8 &&
          armRef.current &&
          ((swingDirection.current > 0 && x > position[0]) ||
            (swingDirection.current < 0 && x < position[0]))
        ) {
          // Apply "hit" effect - make plane wobble and move away
          plane.rotation.z = Math.sin(Date.now() * 0.01) * 0.5;
          plane.position.y += Math.sin(Date.now() * 0.01) * 0.2;
        } else {
          // Reset rotation when not hit
          plane.rotation.z = Math.sin(Date.now() * 0.005) * 0.1;
        }
      }
    });
  });

  if (!active) return null;

  return (
    <group
      position={position}
      ref={apeRef}
    >
      {/* Ape Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial
          color="#663300"
          roughness={0.8}
        />
      </mesh>

      {/* Ape Head */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial
          color="#663300"
          roughness={0.8}
        />
      </mesh>

      {/* Ape Face */}
      <mesh position={[0, 2.5, 1.2]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color="#442200"
          roughness={0.9}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.5, 3, 1.2]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.5, 3, 1.2]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Left Arm (The one that swings) */}
      <group position={[-2, 0.5, 0]}>
        <mesh
          ref={armRef}
          position={[-1.5, 0, 0]}
        >
          <capsuleGeometry args={[0.8, 4, 8, 8]} />
          <meshStandardMaterial
            color="#663300"
            roughness={0.9}
          />
        </mesh>
      </group>

      {/* Right Arm (Static, holding onto the tower) */}
      <mesh
        position={[1.5, -1, 0]}
        rotation={[0, 0, -0.5]}
      >
        <capsuleGeometry args={[0.8, 3, 8, 8]} />
        <meshStandardMaterial
          color="#663300"
          roughness={0.9}
        />
      </mesh>

      {/* Planes circling the tower */}
      {planeRefs.map((ref, i) => (
        <group
          key={i}
          ref={ref}
          position={[15, position[1] + i * 2, 0]}
        >
          {/* Plane body */}
          <mesh>
            <boxGeometry args={[3, 0.3, 0.8]} />
            <meshStandardMaterial color="#DDD" />
          </mesh>

          {/* Wings */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 0.1, 4]} />
            <meshStandardMaterial color="#CCC" />
          </mesh>

          {/* Tail */}
          <mesh position={[-1.8, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.6, 0.1]} />
            <meshStandardMaterial color="#DDD" />
          </mesh>

          {/* Propeller */}
          <mesh
            position={[1.6, 0, 0]}
            rotation={[0, 0, (i + 1) * Date.now() * 0.01]}
          >
            <boxGeometry args={[0.1, 0.8, 0.1]} />
            <meshStandardMaterial color="#999" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default Ape;
