const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const rotateButton = document.getElementById('rotate');
const grayscaleButton = document.getElementById('grayscale');
const resetButton = document.getElementById('reset');
const saveButton = document.getElementById('save');
const removeButton = document.getElementById('remove');
const brightnessSlider = document.getElementById('brightness');
const saturationSlider = document.getElementById('saturation');
const contrastSlider = document.getElementById('contrast');
const textInput = document.getElementById('text');
const addTextButton = document.getElementById('addText');
const cropButton = document.getElementById('crop');
const drawButton = document.getElementById('draw');
const moveTextButton = document.getElementById('moveText');

let img = new Image();
let angle = 0;
let isDrawing = false;
let startX, startY;
let text = '';
let textX = 50, textY = 50;
let isMovingText = false;
let isDraggingText = false;

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

rotateButton.addEventListener('click', () => {
    angle = (angle + 90) % 360;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
});

grayscaleButton.addEventListener('click', () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
});

resetButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
});

saveButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
});

removeButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    img.src = '';  // This also clears the current image source
});

brightnessSlider.addEventListener('input', () => {
    const brightness = brightnessSlider.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `brightness(${brightness}%)`;
    ctx.drawImage(img, 0, 0);
    ctx.filter = 'none';
});

saturationSlider.addEventListener('input', () => {
    const saturation = saturationSlider.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `saturate(${saturation}%)`;
    ctx.drawImage(img, 0, 0);
    ctx.filter = 'none';
});

contrastSlider.addEventListener('input', () => {
    const contrast = contrastSlider.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `contrast(${contrast}%)`;
    ctx.drawImage(img, 0, 0);
    ctx.filter = 'none';
});

addTextButton.addEventListener('click', () => {
    text = textInput.value;
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(text, textX, textY);
});

canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    if (isMovingText && ctx.isPointInPath(textPath, mouseX, mouseY)) {
        isDraggingText = true;
        startX = mouseX - textX;
        startY = mouseY - textY;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDraggingText) {
        textX = e.offsetX - startX;
        textY = e.offsetY - startY;
        redrawCanvas();
    }
});

canvas.addEventListener('mouseup', () => {
    isDraggingText = false;
});

moveTextButton.addEventListener('click', () => {
    isMovingText = !isMovingText;
    moveTextButton.textContent = isMovingText ? 'Stop Moving Text' : 'Move Text';
});

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    ctx.fillText(text, textX, textY);
    // Create a path around the text for detecting mouse interactions
    textPath = new Path2D();
    textPath.rect(textX, textY - 30, ctx.measureText(text).width, 30);
}
