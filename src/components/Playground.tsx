import React, { useState } from "react";

const Playground: React.FC = () => {
  const [password, setPassword] = useState("mySecretPassword");
  const [salt, setSalt] = useState("randomSalt123");
  const [iterations, setIterations] = useState(10000);
  const [keyLength, setKeyLength] = useState(256);
  const [derivedKey, setDerivedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const derivePBKDF2 = async () => {
    try {
      const enc = new TextEncoder();
      const pwKey = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
      );
      const params = {
        name: "PBKDF2",
        salt: enc.encode(salt),
        iterations,
        hash: "SHA-256",
      };
      const bits = await window.crypto.subtle.deriveBits(
        params,
        pwKey,
        keyLength
      );
      const keyArray = Array.from(new Uint8Array(bits));
      const hexKey = keyArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setDerivedKey(hexKey);
      setError(null);
    } catch (err) {
      setError("Error deriving key: " + (err as Error).message);
      setDerivedKey(null);
    }
  };

  return (
    <div className="mt-12 p-6 bg-black-500 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold mb-4">PBKDF2 Playground</h3>
      <p className="mb-4 text-gray-300">
        Experiment: Input values and derive a key. Watch how changes affect
        security!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col">
          <span>Password</span>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 bg-gray-800 rounded text-white"
          />
        </label>
        <label className="flex flex-col">
          <span>Salt</span>
          <input
            type="text"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            className="p-2 bg-gray-800 rounded text-white"
          />
        </label>
        <label className="flex flex-col">
          <span>Iterations (e.g., 10000+ for security)</span>
          <input
            type="number"
            value={iterations}
            onChange={(e) => setIterations(Number(e.target.value))}
            className="p-2 bg-gray-800 rounded text-white"
          />
        </label>
        <label className="flex flex-col">
          <span>Key Length (bits, e.g., 256)</span>
          <input
            type="number"
            value={keyLength}
            onChange={(e) => setKeyLength(Number(e.target.value))}
            className="p-2 bg-gray-800 rounded text-white"
          />
        </label>
      </div>

      <button
        onClick={derivePBKDF2}
        className="px-4 py-2 bg-green-400 rounded shadow hover:bg-green-700 cursor-pointer"
      >
        Derive Key
      </button>

      {derivedKey && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <strong>Derived Key (Hex):</strong>{" "}
          <code className="break-all">{derivedKey}</code>
        </div>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default Playground;
