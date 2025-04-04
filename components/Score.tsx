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
        position: "absolute",
        top: "20px",
        left: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontFamily: "Arial, sans-serif",
        zIndex: 1000,
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
