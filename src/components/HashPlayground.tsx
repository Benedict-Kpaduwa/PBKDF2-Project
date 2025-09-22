import { useState } from "react";

const HashPlayground: React.FC = () => {
  const [input, setInput] = useState<string>("password123");

  function fakeHash(str: string): string {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h.toString(16).padStart(8, "0");
  }

  return (
    <div className="mt-6 p-4 bg-white/90 border rounded-lg">
      <div className="font-semibold mb-2">Hash Playground (visual demo)</div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 rounded border mb-2"
      />
      <div className="text-sm text-gray-700">
        Mock hash: <code className="font-mono">{fakeHash(input)}</code>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        Tip: change iterations or salt to see different outputs in real PBKDF2
        playground you can extend.
      </div>
    </div>
  );
};

export default HashPlayground;
