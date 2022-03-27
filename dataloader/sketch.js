// ml5.js: Pose Classification
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.2-pose-classification.html
// https://youtu.be/FYgYyq-xqAw

// All code: https://editor.p5js.org/codingtrain/sketches/JoZl-QRPK

// Separated into three sketches
// 1: Data Collection: https://editor.p5js.org/codingtrain/sketches/kTM0Gm-1q
// 2: Model Training: https://editor.p5js.org/codingtrain/sketches/-Ywq20rM9
// 3: Model Deployment: https://editor.p5js.org/codingtrain/sketches/c5sDNr8eM

let video;
let poseNet;
let pose;
let skeleton;

let brain;

let state = 'waiting';
let targeLabel;


var data,inputs;
const newArr = []; var newArr1 = [];

document.getElementById('inputfile')
            .addEventListener('change', function() {

            var fr=new FileReader();
            fr.onload=function(){
            data= fr.result.replace(/(\r)/gm, "").split('\n');

            document.getElementById('output')
                        .textContent=data.length;
            };
          fr.readAsText(this.files[0]);
        });

document.getElementById('inputfile2')
            .addEventListener('change', function() {
            var fr=new FileReader();
            fr.onload=function(){
            targeLabel= fr.result.split('\n');
               // console.log(targeLabel);
                document.getElementById('output')
                    .textContent=targeLabel.length;
            };
          fr.readAsText(this.files[0]);
        });

function keyPressed() {
 if (key == 's') {
gotPoses();
  }
}

function setup() {
  let options = {
    inputs: 66,
    outputs: 3,
    task: 'classification',
    debug: true
  };
  brain = ml5.neuralNetwork(options);
}

function gotPoses() {
    for (let i = 0; i < data.length; i++){
         let  input=[];
        inputs = data[i].split(',');
        for (let j = 0; j < 66; j=j+2) {
         //   inputs[j] = inputs[j] - inputs[30]; inputs = inputs[j+1] - inputs[30+1];
            let x =  inputs[j] - inputs[30*2];
            let y = inputs[j+1] - inputs[30*2+1];
        input.push(x);
         input.push(y);
        }
      if (inputs.length > 0) {
          let target = [targeLabel[i].replace(/(\r\n|\n|\r)/gm, "")];
          brain.addData(input, target);
      }
  }
  brain.saveData();
}


// function gotPoses(poses) {
//   // console.log(poses);
//
//    data[i].split(",");
//
//   if (data.length > 0) {
//     pose = b
//     if (state == 'collecting') {
//       let inputs = [];
//
//       for (let i = 0; i < pose.length/2; i+2) {
//         let x = pose[i];
//         let y = pose[i+1];
//         inputs.push(x);
//         inputs.push(y);
//       }
//       let target = [targetLabel];
//       brain.addData(data[i].split(","), target);
//       myReader.close();
//     }
//   }
//
//
// }



