import ml5 from "ml5";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Result } from "./image-recognition";

interface TransferLearningForm {
  firstLabel: string;
  secondLabel: string;
}

export default function TransferLearning() {
  const { register, handleSubmit, watch } = useForm<TransferLearningForm>();
  const stream = useRef<MediaStream>();
  const video = useRef<HTMLVideoElement>(null);
  const featureExtractor = useRef<any>(null);
  const classifier = useRef<any>(null);
  const addingId = useRef<any>(null);
  const [adding, setAdding] = useState<"firstLabel" | "secondLabel" | "">("");
  const [isModelReady, setIsModelReady] = useState(false);
  const [trained, setTrained] = useState(false);
  const [training, setTraining] = useState(false);
  const [result, setResult] = useState<Result>();
  const onValid = () => {};
  const startMedia = async () => {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      if (video.current) {
        video.current.srcObject = stream.current;
        classifier.current = await featureExtractor.current.classification(
          video.current
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (isModelReady) {
      startMedia();
    }
  }, [isModelReady]);
  const getVideoImage = () => {
    const canvas = document.createElement("canvas");
    if (!canvas || !video.current) return;
    canvas.width = video.current.videoWidth;
    canvas.height = video.current.videoHeight;
    canvas
      .getContext("2d")
      ?.drawImage(video.current, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL();
    const image = document.createElement("img");
    image.src = url;
    return image;
  };
  const addImage = () => {
    if (adding === "") return;
    classifier.current.addImage(getVideoImage(), watch(adding));
    console.log("Adding image", watch(adding));
  };
  const onFirstClick = () => {
    setAdding("firstLabel");
  };
  const onSecondClick = () => setAdding("secondLabel");
  const onModelReady = () => setIsModelReady(true);
  useEffect(() => {
    featureExtractor.current = ml5.featureExtractor("MobileNet", onModelReady);
  }, []);
  useEffect(() => {
    if (adding !== "") {
      addingId.current = setInterval(addImage, 5);
      setTimeout(() => {
        clearInterval(addingId.current);
        setAdding("");
      }, 8000);
    }
  }, [adding]);
  const train = () => {
    setTraining(true);
    classifier.current.train((loss: any) => {
      if (loss === null) {
        setTraining(false);
        setTrained(true);
      }
    });
  };
  useEffect(() => {
    if (!trained) return;
    setInterval(() => {
      classifier.current.classify(getVideoImage(), (err: any, result: any) => {
        setResult(
          result.reduce((prev: any, current: any) =>
            prev.confidence > current.confidence ? prev : current
          )
        );
      });
    }, 1);
  }, [trained]);
  return (
    <div className=" w-full h-[50vh]">
      <Helmet>
        <title>Feature Extractor | React.Ml</title>
      </Helmet>
      {isModelReady ? (
        <div className="flex gap-5">
          <div className="w-1/2 flex flex-col space-y-3">
            <video autoPlay className="w-full rounded-md" ref={video} />
            {trained ? (
              <div className=" text-center text-xl">
                That is a{" "}
                <span className="underline-offset-2 underline decoration-pink-500 decoration-dotted decoration-2 font-medium">
                  {result?.label}
                </span>
              </div>
            ) : (
              <button
                onClick={train}
                className="border-white  transition-colors border rounded-md text-white px-8 font-medium py-2"
              >
                {training ? "Loading..." : "Extract Features"}
              </button>
            )}
          </div>
          <div className="w-full space-y-5 flex max-w-sm flex-col">
            <form
              onSubmit={handleSubmit(onValid)}
              autoComplete="off"
              className="flex flex-col  items-center w-full"
            >
              <span className="text-white text-xl mb-5">Labels</span>
              <div className="w-full flex space-x-2.5  mb-2">
                <input
                  className="w-full bg-black autofill:bg-black focus:outline-none border-white border-2 rounded py-1 px-2"
                  type="text"
                  {...register("firstLabel")}
                />
                <button
                  onClick={onFirstClick}
                  className="border-white border-2 rounded py-1 px-2"
                >
                  Train
                </button>
              </div>
              <div className="w-full flex space-x-2.5">
                <input
                  className="w-full bg-black focus:outline-none border-white border-2 rounded py-1 px-2"
                  type="text"
                  {...register("secondLabel")}
                />
                <button
                  onClick={onSecondClick}
                  className="border-white border-2 rounded py-1 px-2"
                >
                  Train
                </button>
              </div>
            </form>
            {adding ? (
              <span className="text-center font-medium  text-pink-400">
                Training: {watch(adding)}
              </span>
            ) : null}
          </div>
        </div>
      ) : (
        <span className="block w-full text-center">Loading model...</span>
      )}
    </div>
  );
}
