import { GameState } from "@/types";
import React, { useEffect, useState } from "react";

interface ScoreDisplayProps {
  gameState: GameState;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ gameState }) => {
  const { rewardMarkers } = gameState;
  const totalMarkers = rewardMarkers.length;
  const collectedMarkers = rewardMarkers.filter((m) => m.collected).length;
  const [showKongMessage, setShowKongMessage] = useState(false);

  // Check if all markers are collected
  const allMarkersCollected = collectedMarkers === totalMarkers;

  // Show message when Kong appears
  useEffect(() => {
    if (allMarkersCollected && !showKongMessage) {
      setShowKongMessage(true);

      // Hide message after 5 seconds
      const timer = setTimeout(() => {
        setShowKongMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [allMarkersCollected, showKongMessage]);

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
      <div>
        Markers: {collectedMarkers}/{totalMarkers}
      </div>
      {allMarkersCollected && (
        <div
          style={{
            marginTop: "10px",
            color: "#ff9900",
            fontSize: "16px",
          }}
        >
          King Kong Unleashed!
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;
