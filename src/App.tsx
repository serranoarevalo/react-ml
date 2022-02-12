import { useState } from "react";
import ImageRecognition from "./components/image-recognition";
import TransferLearning from "./components/transfer-learning";

export default function App() {
  const [mode, setMode] = useState<"imageRecognition" | "transferLearning">(
    "imageRecognition"
  );
  const setRecognition = () => setMode("imageRecognition");
  const setTransfer = () => setMode("transferLearning");
  return (
    <div className="flex flex-col text-white items-center bg-black min-h-screen">
      <header className="mt-20">
        <div className="flex gap-5">
          <button
            className={`border-2 rounded-md border-blue-500  px-10 text-lg py-4 ${
              mode === "imageRecognition"
                ? "bg-blue-500 shadow-lg text-white shadow-blue-500/50"
                : "border-2 border-blue-500 text-blue-500"
            }`}
            onClick={setRecognition}
          >
            Image Recognition
          </button>
          <button
            className={`border-2 rounded-md border-blue-500  px-10 text-lg py-4 ${
              mode === "transferLearning"
                ? "bg-blue-500 shadow-lg text-white shadow-blue-500/50"
                : " border-blue-500 text-blue-500"
            }`}
            onClick={setTransfer}
          >
            Transfer Learning
          </button>
        </div>
      </header>
      <div className="mt-20 w-full max-w-2xl mx-auto">
        {mode === "imageRecognition" && <ImageRecognition />}
        {mode === "transferLearning" && <TransferLearning />}
      </div>
    </div>
  );
}
