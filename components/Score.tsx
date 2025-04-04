import { GameState } from "@/types";
import React from "react";

interface ScoreDisplayProps {
  gameState: GameState;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ gameState }) => {
  const { score, rewardMarkers } = gameState;
  const totalMarkers = rewardMarkers.length;
  const collectedMarkers = rewardMarkers.filter((m) => m.collected).length;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontFamily: "Arial, sans-serif",
        zIndex: 1000,
        display: "block", // Always display
        pointerEvents: "none", // Make sure it doesn't interfere with interactions
        fontSize: "18px", // Larger font size for better visibility
        fontWeight: "bold", // Make text bolder
      }}
    >
      <div>Score: {score}</div>
      <div>
        Markers: {collectedMarkers}/{totalMarkers}
      </div>
    </div>
  );
};

export default ScoreDisplay;
