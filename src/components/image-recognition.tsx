import ml5 from "ml5";
import React, { useEffect, useRef, useState } from "react";

interface Result {
  label: string;
  confidence: number;
}

export default function ImageRecognition() {
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isModelReady, setIsModelReady] = useState(false);
  const [result, setResult] = useState<Result>();
  const classifier: any = useRef();
  const onGotResults = (err: any, results: any) => {
    if (err) {
      console.log(err);
      return;
    }
    setResult(
      results.reduce((prev: any, current: any) =>
        prev.confidence > current.confidence ? prev : current
      )
    );
  };
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };
  const onDragExit = () => setDragging(false);
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  const onModelReady = () => setIsModelReady(true);
  useEffect(() => {
    classifier.current = ml5.imageClassifier("MobileNet", onModelReady);
  }, []);
  const onWhatIsIt = () => {
    if (classifier.current) {
      const image = document.querySelector("img");
      console.log(image);
      classifier.current.predict(image, onGotResults);
    }
  };

  return (
    <div>
      {isModelReady ? (
        previewUrl ? (
          <>
            <img width={800} src={previewUrl} alt="shush" />
            <button onClick={onWhatIsIt}>What is it?</button>
          </>
        ) : (
          <div onDrop={onDrop} onDragLeave={onDragExit} onDragOver={onDragOver}>
            {dragging ? (
              <h4>Drop here :) </h4>
            ) : (
              <h4>Drag n' Drop a photo here :)</h4>
            )}
          </div>
        )
      ) : null}
      {result ? (
        <span>
          {result?.label} / {Math.round(result?.confidence * 100)}%
        </span>
      ) : null}
    </div>
  );
}
