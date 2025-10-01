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
  learningObjectiveCorrect: string;
  learningObjectiveIncorrect: string;
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
      learningObjectiveCorrect:
        "Correct! A cryptographic hash function creates a unique, irreversible, fixed-size output from any input. It protects against rainbow table attacks by making precomputed tables useless without salts.",
      learningObjectiveIncorrect:
        "No! A cryptographic hash function creates a unique, irreversible, fixed-size output from any input. It protects against rainbow table attacks by making precomputed tables useless without salts.",
    },
    {
      id: 2,
      title: "Quest 2: The Defender",
      description:
        "Oh no! Aliens cracked your first hash. Reinforce the second door — add something to make rainbow table attacks ineffective.",
      options: [
        {
          id: "reuse",
          label: "Reuse the same hash without changes",
          correct: false,
        },
        {
          id: "salt",
          label: "Add a unique salt to the process",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "Right! PBKDF2 uses inputs like password, salt (random data to uniquify hashes), iterations, and a hash function (e.g., SHA-256). Salt prevents rainbow table attacks by requiring unique computations per user.",
      learningObjectiveIncorrect:
        "No, PBKDF2 uses inputs like password, salt (random data to uniquify hashes), iterations, and a hash function (e.g., SHA-256). Salt prevents rainbow table attacks by requiring unique computations per user.",
    },
    {
      id: 3,
      title: "Quest 3: Complexity",
      description:
        "The second door won't hold them off for too long, you need to make the third password even better!",
      options: [
        {
          id: "high",
          label: "Use high entropy password",
          correct: true,
        },
        {
          id: "low",
          label: "Minimize entropy",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "Correct! Higher entropy passwords that are longer and more random are more difficult to brute-force",
      learningObjectiveIncorrect:
        "No! Minimizing entropy would decrease the randomness and only help attackers",
    },
    {
      id: 4,
      title: "Quest 4: Algorithms",
      description:
        "High-entropy password is good, but won't do much without a hashing algorithm",
      options: [
        {
          id: "fast",
          label: "Use a fast SHA-1 algorithm",
          correct: false,
        },
        {
          id: "slow",
          label: "Use a more complex, but slow algorithm",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "Despite being slower to compute, the benefit of much higher entropy of many modern hashing algorithms is uncomparable",
      learningObjectiveIncorrect:
        "Even though it is fast, its low entropy score makes it easily crackable",
    },
    {
      id: 5,
      title: "Quest 5: Keys",
      description: "We need to further slow the aliens down!",
      options: [
        {
          id: "KDF",
          label: "Use KDF to derive a key",
          correct: true,
        },
        {
          id: "RFC",
          label: "Use RFC2898 to improve a password",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "That's right! Using a key derivation function (KDF) is a good way to slow down a brute-force attack",
      learningObjectiveIncorrect:
        "No! RFC2898 is a RSA's document where the first standardized KDF was introduced",
    },
    {
      id: 6,
      title: "Quest 6: Authenticity",
      description:
        "We received a transmission from HQ. We now need to ensure its authenticity and integrity",
      options: [
        {
          id: "question",
          label: "Ask them questions only the HQ should be able to answer",
          correct: false,
        },
        {
          id: "authentication",
          label: "Use HMAC to ensure both",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "Exactly! HMAC (or Hash based Message Authentication Code) does exactly what its name is, it helps with message authentication, and it helps with maintaining integrity",
      learningObjectiveIncorrect:
        "Not quite, as that can leak potentially important information",
    },
    {
      id: 7,
      title: "Quest 7: MAC vs HMAC",
      description:
        "We now need to reply. What do we use for integrity and authenticity?",
      options: [
        {
          id: "MAC",
          label: "MAC",
          correct: false,
        },
        {
          id: "HMAC",
          label: "HMAC",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "Yes, HMAC helps with ensuring both integrity and authenticityz",
      learningObjectiveIncorrect:
        "While a naive MAC-SHA256 ensures integrity, it is still vulnerable to extension attacks",
    },
    {
      id: 8,
      title: "Quest 8: HMAC",
      description: "What are some other benefits of using HMAC?",
      options: [
        {
          id: "collision",
          label: "It is collision-resistant",
          correct: true,
        },
        {
          id: "secretKey",
          label: "It eliminates the need for secret key",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "That's right. It also produces outputs of predictable fixed size",
      learningObjectiveIncorrect:
        "No, HMAC uses the secret key in combination with a cryptographic hash function",
    },
    {
      id: 9,
      title: "Quest 9: PBKDF2",
      description:
        "The HQ message said that we should try to improve security with PBKDF2, however some of the instructions got corrupted. You need to restore them! First, what inputs does PBKDF2 take?",
      options: [
        {
          id: "corInput",
          label: "P, S, c, dkLen, PRF",
          correct: true,
        },
        {
          id: "incInput",
          label: "P, D, m, dkVar, KDF",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "Correct! P - password, S - salt, c - interation count, dkLen - derived key's length, and Pseudo Random Function. Also, the output is called DK (derived key)",
      learningObjectiveIncorrect:
        "Oh no, while P is indeed use as a password, we don't use variables D, m, or dkVar. Also, PBKDF2 is a KDF itself, and does  not take KDF as an input",
    },
    {
      id: 10,
      title: "Quest 10: PBKDF2",
      description:
        "We have the inputs. What is the maximum size of key that we can get?",
      options: [
        {
          id: "corLen",
          label: "2^32*dkLen",
          correct: false,
        },
        {
          id: "incLen",
          label: "2^32*hLen",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "No, dkLen is the key size itself, and we a looking for the dkLen's maximum value",
      learningObjectiveIncorrect:
        "Yes, the maximum size of dkLen is 2^32 blocks of PRF output (aka hLen)",
    },
    {
      id: 11,
      title: "Quest 11: PBKDF2",
      description:
        "We almost got it! One last thing, what does the PRF take as inputs on second and consequent iterations?",
      options: [
        {
          id: "corIter",
          label: "P and previous round's output",
          correct: true,
        },
        {
          id: "incIter",
          label: "P, S, and previous round's output",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "Yes, while on the first iteration, PRF uses P, S, and c, on every other iteration, it only needs P and previous round's output (U_i)",
      learningObjectiveIncorrect:
        "No, S is only used in the first round of encryption, after that it is part of previous round's output, along with the counter c",
    },
    {
      id: 12,
      title: "Quest 12:  PBKF2",
      description:
        "You want to use PBKDF2 to derive functions keys You have two options two choose fom, which one is more secure?",
      options: [
        {
          id: "sha256",
          label: "HMAC-SH256",
          correct: false,
        },
        {
          id: "sha512",
          label: "HMAC-SHA512",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "Longer keys are less vulnerable to brute-force attacks",
      learningObjectiveIncorrect:
        "Short keys are more vulnerable to brute-force attacks",
    },
    {
      id: 13,
      title: "Quest 13: Rainbow Tables",
      description:
        "One of our critical passwords is in a Rainbow Table, but we use a key derived from it through PBKDF2. Are we at risk? ",
      options: [
        {
          id: "13w",
          label: "Yes, PBKDF2 does not help in any way in this case",
          correct: false,
        },
        {
          id: "13c",
          label: "Yes, it is a matter of time before the password is cracked",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "Right, PBKDF2 only slows down the attack depending on number of iterations. We should really change that password quickly!",
      learningObjectiveIncorrect:
        " While using passwords from rainbow tables always put a system at risk, PBKDF2 does actually help slow down the attack",
    },
    {
      id: 14,
      title: "Quest 14: Advantages",
      description:
        "We have some concerns regarding PBKDF2. What are its advantages?",
      options: [
        {
          id: "14c",
          label: "Deterministic, customizable, scalable",
          correct: true,
        },
        {
          id: "14w",
          label: "Authentic, monolithic, secure",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "Right, PBKDF2 is deterministic, allows changing its PRF (scalable) and setting up a number of iterations (customizable)",
      learningObjectiveIncorrect:
        "No, PBKDF2 does not have anything to do with authenticity. Additionally, it is modular, rather than mnonolithic, and security is not guaranteed",
    },
    {
      id: 15,
      title: "Quest 15: Advantages",
      description: "What other benefits does PBKDF2 have?",
      options: [
        {
          id: "15c",
          label: "Reduced password comlexity requirements, simple",
          correct: true,
        },
        {
          id: "15w",
          label: "Fast key derivation with low computational cost",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "Exactly, PBKDF2 is very simple and easy to implement, and due to its nature, passwords don't have to be as complex as they otherwise would",
      learningObjectiveIncorrect:
        "Not exactly, while it is true that with smaller number of iterations keys are computed faster and require less resources, the whole point of PBKDF2 is to make such computations slow and complex, making this option not beneficial for PBKDF2",
    },
    {
      id: 16,
      title: "Quest 16: Concerns",
      description: "What about PBKDF2's disadvantages?",
      options: [
        {
          id: "16w",
          label: "PBKDF2's code is public, and thus, insecure",
          correct: false,
        },
        {
          id: "16c",
          label: "PBKDF2 can only slow attacks, not mitigate them",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "Correct! One of the concerns is that PBKDF2 can only slow brute-force attacks, and only with substantial number of iterations (above 10000)",
      learningObjectiveIncorrect:
        "PBKDF2's code is indeed public, which, however, does not make it any less secure, because security by obscurity is wrong",
    },
    {
      id: 17,
      title: "Quest 17: Problem",
      description: "Finally, are there any major problems with PBKDF2?",
      options: [
        {
          id: "17w",
          label: "Yes, it is very CPU-intensive",
          correct: false,
        },
        {
          id: "17c",
          label: "Yes, it is not GPU-intensive",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "Right on! This is a huge problem, as anyone with GPU cluster can mitigate PBKDF2 easily",
      learningObjectiveIncorrect:
        "While PBKDF2 is indeed cpu-intensive, this is not a disadvantage of an algorithm, as it is designed to be resource-intensive to slow down attacks",
    },
    {
      id: 18,
      title: "Quest 18: Applications",
      description:
        "Now that we know that PBKDF2 is vulnerable, we need to know which of our systems still use it!",
      options: [
        {
          id: "18c",
          label: "LastPass, iOS and Mac OS, Bitwarden, VeraCrypt",
          correct: true,
        },
        {
          id: "18w",
          label: "OpenBSD, PHP, Enpass, Django, WinZip",
          correct: false,
        },
      ],
      learningObjectiveCorrect: "Yes, all of these make use of PBKDF2",
      learningObjectiveIncorrect:
        "While Enpass, Django, and WinZip use PBKDF2, OpenBSD and PHP use a different KDF",
    },
    {
      id: 19,
      title: "Quest 19:  WPA2 vs WPA3",
      description:
        "You just bought a new Wi-Fi router. Fortunately, you have the option to choose between WPA2 or WPA3. Which one is more secure?",
      options: [
        {
          id: "19w",
          label: "WPA2",
          correct: true,
        },
        {
          id: "19c",
          label: "WPA3",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "WPA3 uses Simultaneous Authentication of Equals, which prevents offline password guessing",
      learningObjectiveIncorrect:
        "WPA2 is susceptible to offline dictionary attacks and brute-force attacks, especially if the Wi-Fi is weak",
    },
    {
      id: 20,
      title: "Quest 20:  WPA2",
      description:
        "Unfortunately, WPA2 is still commonly used, your coffee shop and home router might not support WPA3. What protocol uses WPA2?",
      options: [
        {
          id: "20w",
          label: "AES with CCMP",
          correct: true,
        },
        {
          id: "20c",
          label: "GCM with SAE",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "Yes, WPA2 uses Counter Mode with Cipher Block Chaining Message Authentication protocols",
      learningObjectiveIncorrect:
        "No, Galois Counter Mode with SAE is used in WPA3",
    },
    {
      id: 21,
      title: "Quest 21: CSPRN",
      description:
        "Your company wants to use a key for a symmetric encryption algorithm?",
      options: [
        {
          id: "21w",
          label: "Use 123456 as a key since AES will work well",
          correct: false,
        },
        {
          id: "21c",
          label: "Use a vetted library or the average speed of your keyboard",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "A good Cryptographically Secure Pseudo-Random number generator will make the encryption secure",
      learningObjectiveIncorrect:
        "Generating a non-random number can result in vulnerable encryption",
    },
    {
      id: 22,
      title: "Quest 22: Bitwarden",
      description:
        "In Bitwarden password manager, if you chosen PBKDF2 as you KDF , what elements is used to derive your master Key (256-bits) ?",
      options: [
        {
          id: "22c",
          label:
            "your email address a salt value , and master password as Payload",
          correct: true,
        },
        {
          id: "22w",
          label: "your ip address as a salt value, and mac address as Payload",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "Yes, Salting prevents precomputed (rainbow) table attacks and using an iterated KDF (e.g., PBKDF2) increases the work factor for an attacker by 10",
      learningObjectiveIncorrect:
        "No, what if you wanted to login from a different IP?",
    },
    {
      id: 23,
      title: "Quest 23: Master Key",
      description:
        "In Bitwarden password manager, how is the Master Key stretched to 512 bits?",
      options: [
        {
          id: "23c",
          label: "HKDF",
          correct: true,
        },
        {
          id: "23w",
          label: "PBKDF2",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "Yes, HKDF expand the key into stronger cryptographic keys",
      learningObjectiveIncorrect:
        "No, PBKDF2 turns a weak key into a suitable key",
    },
    {
      id: 24,
      title: "Quest 24: Bitwarden Authentication",
      description:
        "A Master Key and Master Password are used to derive the Master Password Hash. How does the Bitwarder Server Authenticate the user?",
      options: [
        {
          id: "24w",
          label: "You username and password",
          correct: false,
        },
        {
          id: "24c",
          label: "Master Passwod Hash",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "Right, using a hash for authentication allows the server to not store sensite information",
      learningObjectiveIncorrect:
        "No, using a hash for authentication allows the server to not store sensite information",
    },
    {
      id: 25,
      title: "Quest 25: Credential Storage",
      description:
        "How does Bitwarden Cloud receive your Master Password Hash and Protected Symmetric Key?",
      options: [
        {
          id: "25c",
          label: "AES-256 Symmetric encryption",
          correct: true,
        },
        {
          id: "25w",
          label: "RSA Key pair Asymmetric encryption",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "Yes, asymmetric encryption securely exchanges symmetric keys over an insecure channel",
      learningObjectiveIncorrect:
        "No, it uses a public/private key pair to protect the symmetric session key",
    },
    {
      id: 26,
      title: "Quest 26: Brute-force",
      description:
        "How can I test if my password is safe from brute-force attack?",
      options: [
        {
          id: "26w",
          label:
            "Use a password tester, at least 9 characters of Numbers Upper&Lowercase",
          correct: false,
        },
        {
          id: "26c",
          label: "Use Current NIST password guidelines",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "Right, its best to always follow latest NIST guidelines",
      learningObjectiveIncorrect:
        "While not necessarily wrong, NIST guidelines can change, and it is best to always adhere to their standards",
    },
    {
      id: 27,
      title: "Quest 27: Alternatives",
      description: "With these problems of PBKDF2, what are our alternatives?",
      options: [
        {
          id: "27c",
          label: "Scrypt, Bcrypt, Argon2",
          correct: true,
        },
        {
          id: "27w",
          label: "Script, PBKDF3, Argon2",
          correct: false,
        },
      ],
      learningObjectiveCorrect: "Yes, these 3 are our alternatives!",
      learningObjectiveIncorrect:
        "No, PBKDF3 does not exist (yet), and Script is spelled as Scrypt",
    },
    {
      id: 28,
      title: "Quest 28: Bcrypt",
      description: "Let's look at our options! What can you say about Bcrypt?",
      options: [
        {
          id: "28s",
          label: "Introduced in 2009, has an issue of time-memory tradeoff",
          correct: false,
        },
        {
          id: "28c",
          label: "Introduced in 1999, has fixed memory usage",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "Yes, that is Bcrypt. Its fixed-memory usage is a big problem. It is also used in PHP and OpenBSD",
      learningObjectiveIncorrect:
        "No, this is actually a description of Scrypt. The described issue makes it vulnerable to GPU-based attacks",
    },
    {
      id: 29,
      title: "Quest 29: Argon2",
      description:
        "Both Bcrypt and Scrypt have issues. What can you say about Argon2?",
      options: [
        {
          id: "29c",
          label: "Secure against GPU-based attacks, standardized in 2021",
          correct: true,
        },
        {
          id: "29w",
          label: "Uses hardcoded time and memory costs, not a current standard",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "Yes, by allowing to separately set time and memory costs, Argon2 is secure against GPU-based attacks. ",
      learningObjectiveIncorrect:
        "On the contrary, time and memory costs can be set up manually and separately, and it is a current standard RFC 9106",
    },
    {
      id: 30,
      title: "Quest 30: Argon2id",
      description:
        "Is Argon2id better then PBKDF2 , and what happen if I increased the number of iterations?",
      options: [
        {
          id: "30c",
          label:
            "Yes, It's safer but as you increase iterations it becomes slower to use",
          correct: true,
        },
        {
          id: "30w",
          label:
            "No, it's less safe but as you increase number of iterations it becomes faster to use",
          correct: false,
        },
      ],
      learningObjectiveCorrect:
        "Yes, 600,000 iterations are recommended for PBKDF2 and at least 4 KDF iterations for Argon2id",
      learningObjectiveIncorrect:
        "No, 600,000 iterations are recommended for PBKDF2 and at least 4 KDF iterations for Argon2id",
    },
    {
      id: 31,
      title: "Quest 31: Conclusion",
      description:
        "That's right, we need to use Argon2 (and preferably Argon2id)! What about PBKDF2?",
      options: [
        {
          id: "31w",
          label: "It is no longer a standard, we can forget about it",
          correct: false,
        },
        {
          id: "31c",
          label: "We need to know its strengths and weaknesses",
          correct: true,
        },
      ],
      learningObjectiveCorrect:
        "Yes! Despite not being a standard anymore, it is still actively used worldwide, and there are scenarious where its usage is justified",
      learningObjectiveIncorrect:
        "Even though it is no longer a recommended standard, many systems still use it, and we need to understand PBKDF2 to secure these systems effectively",
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

  const playSound = async (src: string) => {
    try {
      const audioInstance = new Audio(src);
      audioInstance.volume = src === "/background.wav" ? 0.3 : 0.5;
      audioInstance.preload = "auto";
      await audioInstance.play();
    } catch (err) {
      console.warn("Audio play blocked:", err);
      setTimeout(() => playSound(src), 100);
    }
  };

  function startMission() {
    setStep(0);
    if (!isAudioPlaying) {
      playSound("/background.wav").then(() => setIsAudioPlaying(true));
    }
  }

  function restart() {
    setStep(0);
    setLastCorrect(null);
    setRocketTrigger(0);
    setShowPlayground(false);
    if (!isAudioPlaying) {
      playSound("/background.wav").then(() => setIsAudioPlaying(true));
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

  useEffect(() => {
    const preloadAudio = (src: string) => {
      const audioInstance = new Audio(src);
      audioInstance.preload = "auto";
      audioInstance.load();
    };

    preloadAudio("/background.wav");
    preloadAudio("/confirm.wav");
    preloadAudio("/reject.wav");
  }, []);

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
