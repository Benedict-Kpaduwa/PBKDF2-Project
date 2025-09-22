import React from "react";
import { motion } from "motion/react";

type RocketAnimationProps = {
  trigger: number;
};

const RocketAnimation: React.FC<RocketAnimationProps> = ({ trigger }) => {
  return (
    <motion.div
      key={trigger}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: -300, opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 flex justify-center"
    >
      <div className="w-16 h-32 bg-gradient-to-b from-silver to-gray-800 rounded-t-full relative">
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-500 rounded-full blur-md"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-2 h-2 bg-yellow-300 rounded-full"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 50 + i * 10, x: Math.random() * 20 - 10, opacity: 0 }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default RocketAnimation;
