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
        debug: true
    }
    brain = ml5.neuralNetwork(options);
    brain.loadData('2022-3-22_17-53-0.json', dataReady);
}

document.getElementById('inputfile')
    .addEventListener('change', function() {
      var fr=new FileReader();
      fr.onload=function(){
          brain.loadData(fr.result, dataReady);
      };
      fr.readAsText(this.files[0]);
    });



function train() {

}

function dataReady() {
 // brain.normalizeData();
  brain.train({epochs: 50}, finished);
}

function finished() {
  console.log('model trained');
  brain.save();
}