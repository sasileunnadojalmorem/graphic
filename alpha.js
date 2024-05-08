let faceapi;
let img;
let detections;

// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

function preload(){
    img = loadImage('assets/frida.jpg')
}

function setup() {
    createCanvas(200, 200);
    img.resize(width, height);

    faceapi = ml5.faceApi(detection_options, modelReady)
    textAlign(RIGHT);
}

function modelReady() {
    console.log('ready!')
    console.log(faceapi)
    faceapi.detectSingle(img, gotResults)

}

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detections = result;

    // background(220);
    background(255);
    image(img, 0,0, width, height)
    if (detections) {
        // console.log(detections)
        drawBox(detections)
        drawLandmarks(detections)
    }
}

function drawBox(detections){
    const alignedRect = detections.alignedRect;
    const {_x, _y, _width, _height} = alignedRect._box;
    noFill();
    stroke(161, 95, 251);
    strokeWeight(2)
    rect(_x, _y, _width, _height)
}

function drawLandmarks(detections){
    noFill();
    stroke(161, 95, 251);
    strokeWeight(2)
    
    push()
    // mouth
    beginShape();
    detections.parts.mouth.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape(CLOSE);

    // nose
    beginShape();
    detections.parts.nose.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape(CLOSE);

    // left eye
    beginShape();
    detections.parts.leftEye.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape(CLOSE);

    // right eye
    beginShape();
    detections.parts.rightEye.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape(CLOSE);

    // right eyebrow
    beginShape();
    detections.parts.rightEyeBrow.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape();

    // left eye
    beginShape();
    detections.parts.leftEyeBrow.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape();

    pop();

}
  function isMouthOpen(detections) {
    // Assuming that the mouth consists of several landmarks forming a closed shape
    // Calculate the centroid of the mouth landmarks
    let sumX = 0;
    let sumY = 0;
    detections.parts.mouth.forEach(landmark => {
        sumX += landmark._x;
        sumY += landmark._y;
    });
    let mouthCentroidX = sumX / detections.parts.mouth.length;
    let mouthCentroidY = sumY / detections.parts.mouth.length;

    // Check if the distance between the top and bottom landmarks of the mouth is larger than a threshold
    let topMouthLandmark = detections.parts.mouth[0];
    let bottomMouthLandmark = detections.parts.mouth[4];
    let mouthHeight = bottomMouthLandmark._y - topMouthLandmark._y;
    let mouthOpenThreshold = 10; // Adjust this threshold as needed

    return mouthHeight > mouthOpenThreshold;
}

function draw() {
    // Nothing here, since all drawing is done in gotResults() function
}

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    detections = result;

    background(255);
    image(img, 0,0, width, height)
    if (detections) {
        drawBox(detections)
        drawLandmarks(detections)
        let mouthOpen = isMouthOpen(detections);
        console.log("Mouth open:", mouthOpen);
    }
}
