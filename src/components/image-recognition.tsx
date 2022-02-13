import ml5 from "ml5";
import React, { useEffect, useRef, useState } from "react";

export interface Result {
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
    <div className="pb-40">
      {isModelReady ? (
        previewUrl ? (
          <div className="flex flex-col items-center gap-y-5">
            <img
              width={800}
              src={previewUrl}
              alt="shush"
              className="h-[50vh] object-center object-cover rounded-lg"
            />

            {result ? (
              <div>
                I'm{" "}
                <span className="underline-offset-2 underline decoration-pink-500 decoration-dotted decoration-2 font-medium">
                  {Math.round(result?.confidence * 100)}%
                </span>{" "}
                sure that this is a{" "}
                <span className="underline-offset-2 underline decoration-pink-500 decoration-dotted decoration-2 font-medium">
                  {result?.label}
                </span>
              </div>
            ) : (
              <button
                className="border-white  transition-colors border rounded-md text-white px-8 font-medium py-2"
                onClick={onWhatIsIt}
              >
                What is it?
              </button>
            )}
          </div>
        ) : (
          <div
            className="border-white border-dashed text-lg rounded-lg border-2 min-h-[50vh] flex items-center justify-center w-full"
            onDrop={onDrop}
            onDragLeave={onDragExit}
            onDragOver={onDragOver}
          >
            {dragging ? <span>Drop it!</span> : <span>Drag a photo here</span>}
          </div>
        )
      ) : null}
    </div>
  );
}
