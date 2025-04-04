"use client";
import Scene from "@/components/Scene";
import ScoreDisplay from "@/components/Score";
import { useDronePhysics } from "@/hooks/useDronePhysics";
import { useGameState } from "@/hooks/useGameState";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";

export default function QuadcopterSimulator() {
  const [droneState, droneControls] = useDronePhysics([0, 5, 0]);
  const [showHelp, setShowHelp] = useState(true);

  const { gameState, updateGameState } = useGameState(
    droneControls.resetPosition
  );

  // Hide help after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelp(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <ScoreDisplay gameState={gameState} />

      {showHelp && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          <h2>Quadcopter Simulator</h2>
          <p>Use WASD keys to move horizontally.</p>
          <p>Space to go up, Shift to go down.</p>
          <p>Q and E to rotate left and right.</p>
          <button
            onClick={() => setShowHelp(false)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Got it!
          </button>
        </div>
      )}
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene
            updateGameState={updateGameState}
            droneState={droneState}
            gameState={gameState}
            droneControls={droneControls}
          />
        </Suspense>
        {/* Stats component removed */}
      </Canvas>
      {/* Reset position button removed */}
    </div>
  );
}
