// ml5.js: Pose Classification
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.2-pose-classification.html
// https://youtu.be/FYgYyq-xqAw

// All code: https://editor.p5js.org/codingtrain/sketches/JoZl-QRPK

// Separated into three sketches
// 1: Data Collection: https://editor.p5js.org/codingtrain/sketches/kTM0Gm-1q
// 2: Model Training: https://editor.p5js.org/codingtrain/sketches/-Ywq20rM9
// 3: Model Deployment: https://editor.p5js.org/codingtrain/sketches/c5sDNr8eM

let brain;

function setup() {
    createCanvas(640, 480);
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
        learningRate: 0.0005,
    }
    brain = ml5.neuralNetwork(options);
   // brain.loadData('2022-3-26_17-58-17.json', dataReady);
}

document.getElementById('inputfile')
    .addEventListener('change', function() {
      var fr=new FileReader();
      fr.onload=function(){
          brain.loadData(fr.result, dataReady);
      };
      fr.readAsText(this.files[0]);
    });


function dataReady() {
 // brain.normalizeData();
  brain.train({epochs: 700}, finished);
}

function finished() {
  console.log('model trained');
  brain.save();
}
