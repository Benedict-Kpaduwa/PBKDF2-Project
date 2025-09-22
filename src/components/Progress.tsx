import React from "react";

type ProgressProps = {
  step: number;
  total: number;
};

const Progress: React.FC<ProgressProps> = ({ step, total }) => {
  const pct = Math.round((step / total) * 100);

  return (
    <div className="w-full">
      <div className="text-sm mb-2 flex justify-between">
        <span>Mission Progress: {pct}%</span>
        <span>🛸 Aliens Approaching!</span>
      </div>
      <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-100 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;
