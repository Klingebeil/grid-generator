document.getElementById("gridForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Get user inputs
    const width = parseInt(document.getElementById("width").value, 10);
    const height = parseInt(document.getElementById("height").value, 10);
    const cellSizeInput = document.getElementById("cellSize").value;
    let cellSize = parseInt(cellSizeInput, 10);

    // Minimum margin
    const margin = 5;

    // Calculate optimal cell size if not provided
    if (!cellSizeInput) {
        const smallerDimension = Math.min(width, height) - 2 * margin;
        cellSize = Math.max(10, Math.floor(smallerDimension / 10)); // Default to dividing into ~10 rows/columns
    }

    // Validate inputs
    if (width <= 0 || height <= 0 || cellSize <= 0) {
        alert("Please enter positive values for width and height.");
        return;
    }

    // Generate SVG grid
    const svgContent = generateSvgGrid(width, height, cellSize, margin);

    // Display the SVG
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = ""; // Clear previous output
    outputDiv.appendChild(svgContent);

    // Create a downloadable version of the SVG
    createDownloadButton(svgContent);
});

function generateSvgGrid(width, height, cellSize, margin) {
    // Create the SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    // Calculate usable area for the grid
    const usableWidth = width - 2 * margin;
    const usableHeight = height - 2 * margin;

    // Determine number of cells and adjusted grid size
    const cols = Math.floor(usableWidth / cellSize);
    const rows = Math.floor(usableHeight / cellSize);
    const gridWidth = cols * cellSize;
    const gridHeight = rows * cellSize;

    // Calculate grid starting point to center it
    const startX = margin + (usableWidth - gridWidth) / 2;
    const startY = margin + (usableHeight - gridHeight) / 2;

    // Add a surrounding rectangle with rounded corners
    const borderRadius = cellSize / 2;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", startX);
    rect.setAttribute("y", startY);
    rect.setAttribute("width", gridWidth);
    rect.setAttribute("height", gridHeight);
    rect.setAttribute("rx", borderRadius);
    rect.setAttribute("ry", borderRadius);
    rect.setAttribute("stroke", "#019EA3");
    rect.setAttribute("stroke-width", "2");
    rect.setAttribute("fill", "none");
    svg.appendChild(rect);

    // Create a group for the grid lines
    const linesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    linesGroup.setAttribute("id", "lines");

    // Add grid lines
    const lineColor = "rgba(1, 158, 163, 0.5)"; // 50% transparency

    // Vertical lines
    for (let col = 1; col < cols; col++) {
        const x = startX + col * cellSize;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x);
        line.setAttribute("y1", startY);
        line.setAttribute("x2", x);
        line.setAttribute("y2", startY + gridHeight);
        line.setAttribute("stroke", lineColor);
        line.setAttribute("stroke-width", "1");
        linesGroup.appendChild(line);
    }

    // Horizontal lines
    for (let row = 1; row < rows; row++) {
        const y = startY + row * cellSize;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", startX);
        line.setAttribute("y1", y);
        line.setAttribute("x2", startX + gridWidth);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", lineColor);
        line.setAttribute("stroke-width", "1");
        linesGroup.appendChild(line);
    }

    // Append the group of lines to the SVG
    svg.appendChild(linesGroup);

    return svg;
}

function createDownloadButton(svgElement) {
    // Convert SVG to a data URL
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create a download button
    const downloadButton = document.createElement("a");
    downloadButton.href = svgUrl;
    downloadButton.download = "grid.svg";
    downloadButton.textContent = "Download";
    downloadButton.className = "download-button btn btn-secondary mt-2";

    // Append the button to the output
    const outputDiv = document.getElementById("output");
    outputDiv.appendChild(document.createElement("br")); // Add a line break
    outputDiv.appendChild(downloadButton);
}
