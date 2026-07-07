// Canvas and Context
const canvas = document.getElementById("gardenCanvas");
const ctx = canvas.getContext("2d");

// State Variables
let isDrawing = false;
let drawingAllowed = false;
let boundaryDefined = false;
let startX = 0, startY = 0;
const canvasSizeInFeet = 100; // Canvas represents 100' by 100'

// Draw a Grid (1' resolution)
function drawGrid() {
    const gridSize = canvas.width / canvasSizeInFeet; // Size of 1' square in pixels
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 0.5;

    // Draw vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Convert pixel values to feet
function pixelsToFeet(pixels) {
    return (pixels / canvas.width) * canvasSizeInFeet;
}

// Start Drawing (Mouse Down)
canvas.addEventListener("mousedown", (e) => {
    if (!drawingAllowed) return;
    isDrawing = true;

    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
});

// Draw Preview (Mouse Move)
canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing || !drawingAllowed) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const widthInFeet = Math.abs(pixelsToFeet(currentX - startX));
    const heightInFeet = Math.abs(pixelsToFeet(currentY - startY));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(); // Redraw grid

    // Draw preview rectangle
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);

    // Display dimensions
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";

    // X-axis dimension
    ctx.fillText(`${widthInFeet.toFixed(1)}'`, (startX + currentX) / 2, startY - 5);

    // Y-axis dimension
    ctx.save();
    ctx.translate(startX - 20, (startY + currentY) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${heightInFeet.toFixed(1)}'`, 0, 0);
    ctx.restore();
});

// Finalize Drawing (Mouse Up)
canvas.addEventListener("mouseup", (e) => {
    if (!isDrawing || !drawingAllowed) return;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const widthInFeet = Math.abs(pixelsToFeet(endX - startX));
    const heightInFeet = Math.abs(pixelsToFeet(endY - startY));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(); // Redraw grid

    // Draw finalized rectangle
    ctx.setLineDash([]);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);

    // Display finalized dimensions
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";

    // X-axis dimension
    ctx.fillText(`${widthInFeet.toFixed(1)}'`, (startX + endX) / 2, startY - 5);

    // Y-axis dimension
    ctx.save();
    ctx.translate(startX - 20, (startY + endY) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${heightInFeet.toFixed(1)}'`, 0, 0);
    ctx.restore();

    isDrawing = false;
    boundaryDefined = true;
    drawingAllowed = false;

    toggleButtons();
    updateInstructionBox(false);
});

// Define Garden Boundary Button
defineBoundaryBtn.addEventListener("click", () => {
    drawingAllowed = true;
    boundaryDefined = false;
    toggleButtons();
    updateInstructionBox(true);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(); // Reset grid
});

// Redraw Garden Boundary Button
redrawBoundaryBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(); // Reset grid
    isDrawing = false;
    drawingAllowed = true;
    boundaryDefined = false;
    toggleButtons();
    updateInstructionBox(true);
});

// Clear Garden Boundary Button
clearBoundaryBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(); // Reset grid
    isDrawing = false;
    drawingAllowed = false;
    boundaryDefined = false;
    toggleButtons();
    updateInstructionBox(false);
});

// Toggle Button Visibility and Highlight
function toggleButtons() {
    if (boundaryDefined) {
        defineBoundaryBtn.style.display = "none";
        redrawBoundaryBtn.style.display = "block";
        clearBoundaryBtn.style.display = "block";
    } else {
        defineBoundaryBtn.style.display = "block";
        redrawBoundaryBtn.style.display = "none";
        clearBoundaryBtn.style.display = "none";
    }

    defineBoundaryBtn.style.backgroundColor = drawingAllowed ? "darkgreen" : "";
    defineBoundaryBtn.style.color = drawingAllowed ? "white" : "";
}

// Show/Hide Instruction Box
function updateInstructionBox(show) {
    instructionBox.style.display = show ? "block" : "none";
}

// Initial Grid
drawGrid();
