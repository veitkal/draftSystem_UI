/*
 * Simple test p5js sketch sending UI and mouse parameters over websockets
 * sliders are syncronized between connections
 */


let socket;
let treadleSin1_slider;
let treadleSin2_slider;
let treadleNoise1_slider;
let threadingSin1_slider;
let threadingSin2_slider;
let threadingNoise1_slider;

let updateWarp_toggle = document.getElementById('update-warp_toggle');
let updateWeft_toggle = document.getElementById('update-weft_toggle');
// let updateWarp_toggle = select('#update-warp_toggle');
// let updateWarp_state = 1;

function setup() {
  createCanvas(400, 40);
  background(0);

  ////socket on localhost
  // socket = io.connect('http://localhost:3000');
  // use 'io()' instead and it will automatically find connection
  socket = io();

  //WAVE ui
  treadleSin1_slider = createSlider(0.0, 10.0, 3.3, 0.1);
  treadleSin2_slider = createSlider(0.0, 100.0, 0.0, 0.1);
  treadleNoise1_slider = createSlider(0.0, 100.0, 13.3, 0.1);
  threadingSin1_slider = createSlider(0.0, 10.0, 3.3, 0.1);
  threadingSin2_slider = createSlider(0.0, 10.0, 3.3, 0.1);
  threadingNoise1_slider = createSlider(0.0, 100.0, 13.3, 0.1);

  //UI on change ie when slider is interacted with, send it as parameter
  //
  //updateWarp
  updateWarp_toggle.addEventListener('change', () => {
    let updateWarp_state = updateWarp_toggle.checked; 
    sendParam("/updateWarp", updateWarp_state);
  });
  //updateWeft
  updateWeft_toggle.addEventListener('change', () => {
    let updateWeft_state = updateWeft_toggle.checked; 
    sendParam("/updateWeft", updateWeft_state);
  });

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

  threadingSin1_slider.input(function() {
  let threadingSin1_val = threadingSin1_slider.value();
  sendParam("/threadingSin1", threadingSin1_val); 
  });

  threadingSin2_slider.input(function() {
  let threadingSin2_val = threadingSin2_slider.value();
  sendParam("/threadingSin2", threadingSin2_val); 
  });

  threadingNoise1_slider.input(function() {
  let threadingNoise1_val = threadingNoise1_slider.value();
  sendParam("/threadingNoise1", threadingNoise1_val); 
  });

  //set slider on input to synchronize
  socket.on('param',
    // When we receive data
    function(data) {
      let val = data.val

      if(data.address === "/updateWarp") {
        console.log(val);
        updateWarp_toggle.checked = val;
      }
      if(data.address === "/updateWeft") {
        console.log(val);
        updateWeft_toggle.checked = val;
      }
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
      if(data.address === "/threadingSin1") {
        console.log(val);
        threadingSin1_slider.value(val);
      }
      if(data.address === "/threadingSin2") {
        console.log(val);
        threadingSin2_slider.value(val);
      }
      if(data.address === "/threadingNoise1") {
        console.log(val);
        threadingNoise1_slider.value(val);
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
