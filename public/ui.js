/*
 * Simple test p5js sketch sending UI and mouse parameters over websockets
 * sliders are syncronized between connections
 */


let socket;
let treadleSin1_slider;
let treadleSin2_slider;
let treadleNoise1_slider;

function setup() {
  createCanvas(400, 400);
  background(0);

  ////socket on localhost
  // socket = io.connect('http://localhost:3000');
  // use 'io()' instead and it will automatically find connection
  socket = io();

  //test ui
  treadleSin1_slider = createSlider(0.0, 10.0, 3.3, 0.1);
  treadleSin2_slider = createSlider(0.0, 100.0, 0.0, 0.1);
  treadleNoise1_slider = createSlider(0.0, 100.0, 13.3, 0.1);

  //UI on change ie when slider is interacted with, send it as parameter
  //
  // slider1
  treadleSin1_slider.input(function() {
  let treadleSin1_val = treadleSin1_slider.value();
  sendParam("/treadleSin1", treadleSin1_val); 
  });
  
  //slider2
  treadleSin2_slider.input(function() {
  let treadleSin2_val = treadleSin2_slider.value();
  sendParam("/treadleSin2", treadleSin2_val); 
  });

  // slider3
  treadleNoise1_slider.input(function() {
  let treadleNoise1_val = treadleNoise1_slider.value();
  sendParam("/treadleNoise1", treadleNoise1_val); 
  });

  //set slider on input to synchronize
  socket.on('param',
    // When we receive data
    function(data) {
      let val = data.val

      if(data.address === "/treadleSin1") {
        console.log(val);
        treadleSin1_slider.value(val);
      }
      if(data.address === "/treadleSin2") {
        console.log(val);
        treadleSin2_slider.value(val);
      }
      if(data.address === "/treadleNoise1") {
        console.log(val);
        treadleNoise1_slider.value(val);
      }
    }
  );
}

function draw() {
}

function mouseDragged() {
  // if mouse is within drawing box
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    fill(255);
    noStroke();
    ellipse(mouseX,mouseY,20,20);

    //sending mouse coords 
    sendParam("/mouseX", mouseX); 
    sendParam("/mouseY", mouseY); 
  }
}


//SEND FUNCTION takes and osc adress and single value
function sendParam(adr, val) {
  let data = {
    address: adr,
    val: val
  };
  socket.emit('param', data)
}
