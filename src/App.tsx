import { useState } from "react";
import ImageRecognition from "./components/image-recognition";
import TransferLearning from "./components/feature-extractor";

export default function App() {
  const [mode, setMode] = useState<"imageRecognition" | "transferLearning">(
    "transferLearning"
  );
  const setRecognition = () => setMode("imageRecognition");
  const setTransfer = () => setMode("transferLearning");
  return (
    <div className="flex flex-col text-white items-center bg-black min-h-screen">
      <header className="mt-20">
        <div className="flex gap-5">
          <button
            className={`border-2 rounded-md border-blue-500  px-10 py-4 ${
              mode === "imageRecognition"
                ? "bg-blue-500 shadow-lg text-white shadow-blue-500/50"
                : "border-2 border-blue-400 text-blue-400"
            }`}
            onClick={setRecognition}
          >
            Image Recognition
          </button>
          <button
            className={`border-2 rounded-md border-blue-500  px-10 py-4 ${
              mode === "transferLearning"
                ? "bg-blue-500 shadow-lg text-white shadow-blue-500/50"
                : " border-blue-400 text-blue-400"
            }`}
            onClick={setTransfer}
          >
            Transfer Learning
          </button>
        </div>
      </header>
      <div className="mt-20 w-full max-w-5xl mx-auto">
        {mode === "imageRecognition" && <ImageRecognition />}
        {mode === "transferLearning" && <TransferLearning />}
      </div>
    </div>
  );
}
