import { useState, useEffect, useRef } from "react";
import Scenario from "./components/Scenario";
import Progress from "./components/Progress";
import VictoryScreen from "./components/VictoryScreen";
import RocketAnimation from "./components/RocketAnimation";
import Playground from "./components/Playground";

type Option = {
  id: string;
  label: string;
  correct: boolean;
};

type Scene = {
  id: number;
  title: string;
  description: string;
  options: Option[];
  learningObjective: string;
};

function App() {
  const [step, setStep] = useState<number>(-1);
  const [showPlayground, setShowPlayground] = useState<boolean>(false);
  const [audio] = useState(new Audio("/background.wav"));
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const scenes: Scene[] = [
    {
      id: 1,
      title: "Quest 1: The Astronaut Explorer",
      description:
        "Aliens are invading the space station! Lock the main door with the keypad. They know your old weak password—quick, create a secure one!",
      options: [
        {
          id: "weak",
          label: "Use a simple password like '1234'",
          correct: false,
        },
        {
          id: "hash",
          label: "Hash the password for uniqueness and irreversibility",
          correct: true,
        },
      ],
      learningObjective:
        "A cryptographic hash function creates a unique, irreversible, fixed-size output from any input. It protects against rainbow table attacks by making precomputed tables useless without salts.",
    },
    {
      id: 2,
      title: "Quest 2: The Defender",
      description:
        "Oh no! Aliens cracked your first hash. Reinforce the second door—add something to make rainbow tables ineffective.",
      options: [
        {
          id: "reuse",
          label: "Reuse the same hash without changes",
          correct: false,
        },
        {
          id: "salt",
          label: "Add a unique salt to the PBKDF2 process",
          correct: true,
        },
      ],
      learningObjective:
        "PBKDF2 uses inputs like password, salt (random data to uniquify hashes), iterations, and a hash function (e.g., SHA-256). Salt prevents rainbow table attacks by requiring unique computations per user.",
    },
    {
      id: 3,
      title: "Quest 3: Iteration Fortress",
      description:
        "Aliens are brute-forcing! Slow them down by increasing the computational cost without changing the password.",
      options: [
        {
          id: "low",
          label: "Use low iterations (fast but weak)",
          correct: false,
        },
        {
          id: "high",
          label: "Increase iterations in PBKDF2 for higher resistance",
          correct: true,
        },
      ],
      learningObjective:
        "Iterations in PBKDF2 repeat the HMAC process many times (e.g., 100,000+), slowing brute-force and dictionary attacks. It's scalable but increases login time.",
    },
    {
      id: 4,
      title: "Quest 4: Alien Tunnel Breach",
      description:
        "Aliens entered the tunnel! PBKDF2 is simple to implement, but is it enough against advanced threats?",
      options: [
        { id: "ignore", label: "Ignore pros/cons and proceed", correct: false },
        {
          id: "balance",
          label: "Use PBKDF2's scalability for variable resistance",
          correct: true,
        },
      ],
      learningObjective:
        "Pros of PBKDF2: Easy to implement, converts any password to a fixed key, scalable iterations. It's used in legacy systems for message authentication and encryption.",
    },
    {
      id: 5,
      title: "Quest 5: Eavesdropper Alert",
      description:
        "An alien eavesdropper is listening! PBKDF2 slows attacks, but what about GPU-accelerated cracking?",
      options: [
        {
          id: "cpu",
          label: "Rely on CPU-intensive design alone",
          correct: false,
        },
        {
          id: "aware",
          label:
            "Acknowledge GPU vulnerability and consider alternatives like Argon2",
          correct: true,
        },
      ],
      learningObjective:
        "Cons: PBKDF2 slows (but doesn't stop) attacks; vulnerable to GPUs for parallel cracking. Superseded by Argon2, but still in RFC 8018 and legacy systems (NIST deprecated in 2025).",
    },
    {
      id: 6,
      title: "Quest 6: Call for Backup",
      description:
        "Need help from Earth? Secure the comms channel with a derived key—choose the full PBKDF2 setup.",
      options: [
        { id: "basic", label: "Use just a password", correct: false },
        {
          id: "full",
          label: "Apply PBKDF2 with salt, iterations, hash, and key length",
          correct: true,
        },
      ],
      learningObjective:
        "PBKDF2 derives keys from password + salt + iterations + hash (e.g., HMAC-SHA256) to a specified length. It's the first standardized KDF, reducing risks from low-entropy passwords.",
    },
  ];

  const total = scenes.length;
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [rocketTrigger, setRocketTrigger] = useState<number>(0);
  const finished = step >= total;

  function handleAnswer(correct: boolean) {
    setLastCorrect(correct);
    if (correct) {
      setRocketTrigger((t) => t + 1);
      if (step + 1 < total) {
        setStep(step + 1);
      } else {
        setStep(total);
        setShowPlayground(true);
      }
    }
  }

  function startMission() {
    setStep(0);
    if (!isAudioPlaying) {
      audio
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch((err) => console.log("Audio play failed:", err));
    }
  }

  function restart() {
    setStep(0);
    setLastCorrect(null);
    setRocketTrigger(0);
    setShowPlayground(false);
    if (!isAudioPlaying) {
      audio
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch((err) => console.log("Audio play failed:", err));
    }
  }

  useEffect(() => {
    const img = new Image();
    img.src = "/space.jpg";
    img.onload = () => {
      if (backgroundRef.current) {
        backgroundRef.current.style.backgroundImage = `url(${img.src})`;
      }
    };

    const forceRepaint = () => {
      if (backgroundRef.current) {
        backgroundRef.current.style.display = "none";
        backgroundRef.current.offsetHeight;
        backgroundRef.current.style.display = "";
      }
    };
    forceRepaint();

    audio.volume = 0.3;
    audio.loop = true;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  return (
    <div
      ref={backgroundRef}
      className="min-h-screen moving-background text-white p-6 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto relative">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">PBKDF2: Mission Escape</h1>
          <div className="text-sm text-gray-200">
            {finished
              ? "Mission Complete!"
              : step === -1
              ? "Prepare for Launch"
              : `Quest ${step + 1} / ${total}`}
          </div>
        </header>

        {step === -1 ? (
          <div className="text-center mt-20">
            <h2 className="text-4xl font-bold mb-6">Welcome, Astronaut!</h2>
            <p className="text-lg mb-6">
              Aliens are approaching! Secure the station with PBKDF2 knowledge.
            </p>
            <button
              className="px-6 py-3 bg-green-600 rounded-lg shadow hover:bg-green-500 text-xl cursor-pointer"
              onClick={startMission}
            >
              Start Mission
            </button>
          </div>
        ) : (
          <>
            {!finished && <Progress step={step} total={total} />}
            <main className="mt-6">
              {!finished ? (
                <>
                  <Scenario
                    key={scenes[step].id}
                    data={scenes[step]}
                    onAnswer={handleAnswer}
                  />
                  <RocketAnimation trigger={rocketTrigger} />
                  <div className="mt-6 flex gap-2 items-center">
                    <button
                      className="px-4 py-2 bg-gray-600 rounded shadow hover:bg-indigo-500"
                      onClick={() => setStep((s) => Math.max(s - 1, 0))}
                      disabled={step === 0}
                    >
                      Prev Quest
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 rounded shadow hover:bg-green-500"
                      onClick={() => setStep((s) => Math.min(s + 1, total - 1))}
                      disabled={step === total - 1}
                    >
                      Next Quest
                    </button>
                    <div className="ml-auto text-sm text-gray-200">
                      {lastCorrect === null
                        ? "Choose an option!"
                        : lastCorrect
                        ? "Correct - Aliens repelled!"
                        : "Incorrect - Try again!"}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <VictoryScreen onRestart={restart} />
                  {showPlayground && <Playground />}
                </>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
