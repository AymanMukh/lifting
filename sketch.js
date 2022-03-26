// ml5.js: Pose Classification
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.2-pose-classification.html
// https://youtu.be/FYgYyq-xqAw

// All code: https://editor.p5js.org/codingtrain/sketches/JoZl-QRPK




//import DeviceDetector from "https://cdn.skypack.dev/device-detector-js@2.2.10";

// Usage: testSupport({client?: string, os?: string}[])
// Client and os are regular expressions.
// See: https://cdn.jsdelivr.net/npm/device-detector-js@2.2.10/README.md for
// legal values for client and os

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');



let brain;
let poseLabel="";

function setup() {
  let options = {
    inputs: 66,
    outputs: 3,
    task: 'classification',
    debug: true,
    layers: [
        {
          type: 'dense',
          units: 66,

        },
        {
          type: "batchNormalization",
        },
        {
          type: 'dense',
          units: 50,

        },
        {
          type: "batchNormalization",
        },
        {
          type: 'dense',
          activation: 'softmax',
        },
      ],

  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
  console.log('pose classification ready!');
  //classifyPose();
}

function onResults(results) {
  if (!results.poseLandmarks) {

    return;
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = 'source-in';
  canvasCtx.fillStyle = '#00FF00';
  canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite missing pixels.
  canvasCtx.globalCompositeOperation = 'destination-atop';
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.globalCompositeOperation = 'source-over';
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
      {color: '#00FF00', lineWidth: 4});
  drawLandmarks(canvasCtx, results.poseLandmarks,
      {color: '#FF0000', lineWidth: 2});

  let inputs = [];
  for (let i = 0; i < results.poseLandmarks.length; i++) {
    let x = results.poseLandmarks[i].x-results.poseLandmarks[30].x;
    let y = results.poseLandmarks[i].y-results.poseLandmarks[30].y;
    inputs.push(x);
    inputs.push(y);
  }
  brain.classify(inputs, gotResult);
  canvasCtx.font = "50px Arial";
 
  if (poseLabel=="correct") canvasCtx.fillStyle = '#00FF00';
  else if (poseLabel=="bad") canvasCtx.fillStyle = '#FF0000';
  else if (poseLabel=="else") canvasCtx.fillStyle = '#0000FF';
  canvasCtx.fillText(poseLabel, 30, 50);
  canvasCtx.restore();


}

function gotResult(error, results) {
  if (results[0].confidence > 0.75) {
    if (results[0].label ==2) poseLabel = "bad";
    else if (results[0].label ==1) poseLabel = "correct";
    else if (results[0].label ==3)poseLabel = "else";
  }
 // classifyPose();
}


const pose = new Pose({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }});
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {

    await pose.send({image: videoElement});
  },
  width: 640,
  height: 480
});
camera.start();
