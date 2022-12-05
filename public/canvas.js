let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidth = document.querySelector(".penWidth");
let earserWidth = document.querySelector(".erasWidth");

let penColor = "black";
let eraserColor = "white";
let penWidth = pencilWidth.value;
let erasWidth = earserWidth.value;

let download = document.querySelector(".fa-download");
let undobtn = document.querySelector(".fa-rotate-left");
let redobtn = document.querySelector(".fa-rotate-right");

let undoRedoTracker = []; // Array of actions
let track = 0; // Default index of action

// API
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// mousedown -> new start path  , mousemove -> fill graphics
let mouseDown = false;

canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;

  let data = {
    x: e.clientX,
    y: e.clientY,
  };

  // Send data to server
  socket.emit("beginPath", data);
});

canvas.addEventListener("mouseup", (e) => {
  mouseDown = false;

  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length - 1;
});

canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    let data = {
      x: e.clientX,
      y: e.clientY,
      color: eraserFlag ? eraserColor : penColor,
      width: eraserFlag ? erasWidth : penWidth,
    };

    // Send data to server
    socket.emit("drawStroke", data);
  }
});

undobtn.addEventListener("click", (e) => {
  if (track > 0) track--;

  // Track action
  let data = {
    trackValue: track,
    undoRedoTracker,
  };

  socket.emit("redoUndo", data);
});

redobtn.addEventListener("click", (e) => {
  if (track < undoRedoTracker.length - 1) track++;

  // Track action
  let data = {
    trackValue: track,
    undoRedoTracker,
  };

  socket.emit("redoUndo", data);
});

// Action to show
function undoRedoCanvas(trackObj) {
  track = trackObj.trackValue;
  undoRedoTracker = trackObj.undoRedoTracker;

  let url = undoRedoTracker[track];
  let img = new Image(); // New image reference
  img.src = url;
  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}

pencilColor.forEach((colorEle) => {
  colorEle.addEventListener("click", (e) => {
    let color = colorEle.classList[0];
    penColor = color;
    tool.strokeStyle = penColor;
  });
});

pencilWidth.addEventListener("change", (e) => {
  penWidth = pencilWidth.value;
  tool.lineWidth = penWidth;
});

earserWidth.addEventListener("change", (e) => {
  erasWidth = earserWidth.value;
  tool.lineWidth = erasWidth;
});

eraser.addEventListener("click", (e) => {
  if (eraserFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = erasWidth;
  } else {
    tool.strokeStyle = penColor;
    tool.lineWidth = penWidth;
  }
});

download.addEventListener("click", (e) => {
  let url = canvas.toDataURL();

  let a = document.createElement("a");
  a.href = url;
  a.download = "board.jpeg";
  a.click();
});

socket.on("beginPath", (data) => {
  // Data recieved from server
  beginPath(data);
});

socket.on("drawStroke", (data) => {
  // Data recieved from server
  drawStroke(data);
});

socket.on("redoUndo", (data) => {
  // Data recieved from server
  undoRedoCanvas(data);
});
