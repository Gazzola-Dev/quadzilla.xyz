import { DroneState } from "@/types";
import React from "react";

interface HUDProps {
  droneState: DroneState;
}

const HUD: React.FC<HUDProps> = ({ droneState }) => {
  const { position, velocity } = droneState;

  // Calculate speed
  const speed = Math.sqrt(
    velocity[0] * velocity[0] +
      velocity[1] * velocity[1] +
      velocity[2] * velocity[2]
  );

  // Format values for display
  const formatPosition = (pos: [number, number, number]) => {
    return pos.map((v) => v.toFixed(2)).join(", ");
  };

  const formatVelocity = (vel: [number, number, number]) => {
    return vel.map((v) => v.toFixed(2)).join(", ");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontFamily: "monospace",
        fontSize: "14px",
      }}
    >
      <div>
        <strong>Position:</strong> {formatPosition(position)}
      </div>
      <div>
        <strong>Velocity:</strong> {formatVelocity(velocity)}
      </div>
      <div>
        <strong>Speed:</strong> {speed.toFixed(2)} m/s
      </div>
      <div>
        <strong>Altitude:</strong> {position[1].toFixed(2)} m
      </div>
    </div>
  );
};

export default HUD;
