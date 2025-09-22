import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

type VictoryScreenProps = {
  onRestart: () => void;
};

const VictoryScreen: React.FC<VictoryScreenProps> = ({ onRestart }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    new Audio("/victory.mp3").play();
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center py-12">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <h2 className="text-4xl font-bold mb-4">Mission Accomplished!</h2>
      <p className="text-xl mb-6">
        You've secured the station with PBKDF2 knowledge. Aliens defeated!
      </p>
      <button
        className="px-6 py-3 bg-green-600 rounded-lg shadow hover:bg-green-500 cursor-pointer"
        onClick={onRestart}
      >
        Restart Mission
      </button>
      <p className="mt-4 text-sm text-gray-300">
        Playground unlocked: Experiment with PBKDF2 below!
      </p>
    </div>
  );
};

export default VictoryScreen;
