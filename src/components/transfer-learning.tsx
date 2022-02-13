import ml5 from "ml5";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

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
  const [previewImage, setPreviewImage] = useState("");
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
  const addImage = () => {
    const canvas = document.createElement("canvas");
    if (!canvas || !video.current || adding === "") return;
    canvas.width = video.current.videoWidth;
    canvas.height = video.current.videoHeight;
    canvas
      .getContext("2d")
      ?.drawImage(video.current, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL();
    const image = document.createElement("img");
    image.src = url;
    classifier.current.addImage(image, watch(adding));
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
      }, 5000);
    }
  }, [adding]);
  return (
    <div className=" w-full h-[50vh]">
      {isModelReady ? (
        <div className="flex gap-5">
          <video autoPlay className="w-1/2 rounded-md" ref={video} />
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
                adding: {watch(adding)}
              </span>
            ) : null}
            <img src={previewImage} width="500" />
          </div>
        </div>
      ) : (
        <span className="block w-full text-center">Loading model...</span>
      )}
    </div>
  );
}
