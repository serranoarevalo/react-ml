import { useState } from "react";
import Helmet from "react-helmet";
import ImageRecognition from "./components/image-recognition";
import TransferLearning from "./components/transfer-learning";

export default function App() {
  const [mode, setMode] = useState<"imageRecognition" | "transferLearning">(
    "imageRecognition"
  );
  const setRecognition = () => setMode("imageRecognition");
  const setTransfer = () => setMode("transferLearning");
  return (
    <div>
      <Helmet>
        <title>Ml.Demo | ml5 + React</title>
      </Helmet>
      <header>
        <h1>Ml.Demo | ml5.js + React</h1>
        <p>
          <button onClick={setRecognition}>
            <b>Image Recognition</b>
          </button>
          <button onClick={setTransfer}>
            <b>Transfer Learning</b>
          </button>
        </p>
      </header>
      <div>
        {mode === "imageRecognition" && <ImageRecognition />}
        {mode === "transferLearning" && <TransferLearning />}
      </div>
    </div>
  );
}
