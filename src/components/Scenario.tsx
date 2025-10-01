import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Option = {
  id: string;
  label: string;
  correct: boolean;
};

type ScenarioData = {
  id: number;
  title: string;
  description: string;
  options: Option[];
  learningObjectiveCorrect: string;
  learningObjectiveIncorrect: string;
};

type ScenarioProps = {
  data: ScenarioData;
  onAnswer: (correct: boolean) => void;
};

const Scenario: React.FC<ScenarioProps> = ({ data, onAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);

  const handleChoose = (option: Option) => {
    if (answered) return;
    setSelected(option.id);
    setAnswered(true);
    new Audio(option.correct ? "/confirm.wav" : "/reject.wav").play();
    setTimeout(() => {
      onAnswer(option.correct);
      setAnswered(false);
      if (!option.correct) setSelected(null);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-6 opacity-100 backdrop-blur-md rounded-2xl shadow-lg border border-gray-500"
    >
      <h2 className="text-2xl font-semibold mb-2">{data.title}</h2>
      <p className="text-gray-300 mb-4">{data.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.options.map((opt) => {
          const isSelected = selected === opt.id;
          const statusClass = answered
            ? opt.correct
              ? "border-green-500 bg-green-900/30"
              : isSelected
              ? "border-red-500 bg-red-900/30 animate-shake"
              : "border-gray-500 bg-transparent"
            : "border-gray-500 hover:shadow-xl hover:scale-105 transition-all";

          return (
            <motion.div
              key={opt.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg cursor-pointer border ${statusClass}`}
              onClick={() => {
                handleChoose(opt);
              }}
            >
              <div className="font-medium">{opt.label}</div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 bg-indigo-900/50 rounded-lg border border-gray-500"
          >
            <div className="text-sm text-gray-200">
              {selected &&
                (data.options.find((o) => o.id === selected)?.correct
                  ? "Correct! " + data.learningObjectiveCorrect
                  : "Not quite—aliens are closer! " +
                    data.learningObjectiveIncorrect)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Scenario;
