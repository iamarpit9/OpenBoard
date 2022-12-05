let toolsCont = document.querySelector(".tools-cont");
let optionsCont = document.querySelector(".options-cont");
let optionsFlag = true;

let pencilTool = document.querySelector(".pencil-tool");
let eraserTool = document.querySelector(".eraser-tool");
let pencilFlag = false;
let eraserFlag = false;

let pencil = document.querySelector(".fa-pencil");
let eraser = document.querySelector(".fa-eraser");
let sticky = document.querySelector(".fa-note-sticky");
let upload = document.querySelector(".fa-upload");

// true -> show tools, false -> hide tools

optionsCont.addEventListener("click", () => {
  optionsFlag = !optionsFlag;

  if (optionsFlag) openTools();
  else closeTools();
});

function openTools() {
  let iconElem = optionsCont.children[0];
  iconElem.classList.remove("fa-bars");
  iconElem.classList.add("fa-times");
  toolsCont.style.display = "flex";
}

function closeTools() {
  let iconElem = optionsCont.children[0];
  iconElem.classList.remove("fa-times");
  iconElem.classList.add("fa-bars");
  toolsCont.style.display = "none";
  eraserTool.style.display = "none";
  pencilTool.style.display = "none";
}

pencil.addEventListener("click", () => {
  // true => show, false -> hide
  pencilFlag = !pencilFlag;

  if (pencilFlag) {
    pencilTool.style.display = "block";
    eraserTool.style.display = "none";
    eraserFlag = false;
  } else pencilTool.style.display = "none";
});

eraser.addEventListener("click", () => {
  // true => show, false -> hide
  eraserFlag = !eraserFlag;

  if (eraserFlag) {
    eraserTool.style.display = "flex";
    pencilTool.style.display = "none";
    pencilFlag = false;
  } else eraserTool.style.display = "none";
  pencilFlag = false;
});

upload.addEventListener("click", () => {
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", () => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let stickyTempelate = `
             <img src="${url}"/>
 `;
    createSticky(stickyTempelate);
  });
});

sticky.addEventListener("click", (e) => {
  let stickyTempelate = `
            <textarea spellcheck="false" ></textarea>
  `;
  createSticky(stickyTempelate);
});

function createSticky(stickyTempelate) {
  let stickyCont = document.createElement("div");
  stickyCont.setAttribute("class", "sticky-cont");
  stickyCont.innerHTML = `
     <div class="header-cont">
          <div class="mini"></div>
          <div class="remove"></div>
        </div>
        <div class="note-cont">
        ${stickyTempelate}
        </div>
    `;
  document.body.appendChild(stickyCont);

  let mini = stickyCont.querySelector(".mini");
  let remove = stickyCont.querySelector(".remove");
  noteActions(mini, remove, stickyCont);

  stickyCont.onmousedown = function (event) {
    dragAndDrop(stickyCont, event);
  };

  stickyCont.ondragstart = function () {
    return false;
  };
}

function noteActions(mini, remove, stickyCont) {
  remove.addEventListener("click", () => {
    stickyCont.remove();
  });

  mini.addEventListener("click", () => {
    let noteCont = stickyCont.querySelector(".note-cont");
    let display = getComputedStyle(noteCont).getPropertyValue("display");
    if (display === "none") noteCont.style.display = "block";
    else noteCont.style.display = "none";
  });
}

function dragAndDrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;
  document.body.append(element);

  moveAt(event.pageX, event.pageY);

  // moves the element at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the element on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the element, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}
