// Define variables
let isDrawing = false;
let lastPixel = null;
let gridStates = []; // Array to store grid states
let currentStateIndex = -1; // Index of the current state in the gridStates array

// Create the grid
const gridContainer = document.getElementById('grid');
const gridSizeX = 26; // Number of columns
const gridSizeY = 13; // Number of rows

// Prevent right-click menu
gridContainer.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

// Mouse move event for dragging
gridContainer.addEventListener('mousemove', function(event) {
  if (event.buttons === 2 && lastPixel !== event.target) {
    // Right mouse button pressed, cancel pixel
    const pixel = event.target;
    if (pixel.classList.contains('selected')) {
      pixel.classList.remove('selected');
    }
    lastPixel = pixel;
  }
});

for (let y = 0; y < gridSizeY; y++) {
  for (let x = 0; x < gridSizeX; x++) {
    const pixel = document.createElement('div');
    pixel.classList.add('pixel');
    pixel.addEventListener('mousedown', (event) => {
      if (event.button === 0) {
        isDrawing = true;
        event.target.classList.add('selected'); // Add 'selected' class immediately
        lastPixel = event.target;
      } else if (event.button === 2) {
        event.preventDefault(); // Prevent right-click menu
        event.target.classList.remove('selected'); // Remove 'selected' class immediately
        lastPixel = event.target;
      }
    });
    pixel.addEventListener('mouseenter', (event) => {
      if (isDrawing && event.buttons === 1 && lastPixel !== event.target) {
        event.target.classList.add('selected');
        lastPixel = event.target;
      } else if (event.buttons === 2 && lastPixel !== event.target) {
        event.target.classList.remove('selected');
        lastPixel = event.target;
      }
    });
    pixel.addEventListener('mouseup', () => {
      isDrawing = false;
      // Save the current state after drawing
      saveState();
    });
    gridContainer.appendChild(pixel);
  }
}

// Function to generate ASCII art
function generateAsciiArt() {
  const pixels = document.querySelectorAll('.pixel');
  let asciiArt = '';
  let row = '';
  for (let i = 0; i < pixels.length; i++) {
    row += pixels[i].classList.contains('selected') ? '█' : '░'; // '█' for selected, '░' for unselected
    if ((i + 1) % gridSizeX === 0) {
      asciiArt += row + '\n';
      row = '';
    }
  }
  document.getElementById('output').textContent = asciiArt;
}

// Function to copy ASCII art to clipboard
function copyToClipboard() {
  const outputText = document.getElementById('output').textContent;
  navigator.clipboard.writeText(outputText)
    .then(() => {
      document.getElementById('copiedAlert').style.display = 'block'; // Show copied alert
      setTimeout(() => {
        document.getElementById('copiedAlert').style.display = 'none'; // Hide copied alert after 2 seconds
      }, 2000);
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
}

// Function to reset the grid
function resetGrid() {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach(pixel => {
      pixel.classList.remove('selected');
    });
    document.getElementById('output').textContent = '';
    // Display reset alert
    const resetAlert = document.getElementById('resetAlert');
    resetAlert.style.display = 'block';
    resetAlert.style.backgroundColor = '#dc3545'; // Light red color
    setTimeout(function() {
      resetAlert.style.display = 'none';
    }, 2000);
}
  

// Function to save the current state of the grid
function saveState() {
  // Clone the current grid state and add it to the history
  const pixels = document.querySelectorAll('.pixel');
  const currentState = [];
  pixels.forEach(pixel => {
    currentState.push(pixel.classList.contains('selected'));
  });
  gridStates.splice(currentStateIndex + 1);
  gridStates.push(currentState);
  currentStateIndex++;
}

// Function to go back one step in the grid
function goBack() {
    if (currentStateIndex > 0) {
      currentStateIndex--;
      restoreState();
      // Display go back alert
      const backAlert = document.getElementById('backAlert');
      backAlert.style.display = 'block';
      backAlert.style.backgroundColor = '#36a37f'; // Light green color
      setTimeout(function() {
        backAlert.style.display = 'none';
      }, 2000);
    }
  }
  
  // Function to go forward one step in the grid
  function goForward() {
    if (currentStateIndex < gridStates.length - 1) {
      currentStateIndex++;
      restoreState();
      // Display go forward alert
      const forwardAlert = document.getElementById('forwardAlert');
      forwardAlert.style.display = 'block';
      forwardAlert.style.backgroundColor = '#36a37f'; // Yellow color
      setTimeout(function() {
        forwardAlert.style.display = 'none';
      }, 2000);
    }
  }

// Function to restore the grid to a previous state
function restoreState() {
  const pixels = document.querySelectorAll('.pixel');
  const state = gridStates[currentStateIndex];
  pixels.forEach((pixel, index) => {
    if (state[index]) {
      pixel.classList.add('selected');
    } else {
      pixel.classList.remove('selected');
    }
  });
}

// Function to add color to pixel with stunning animation
function colorPixel(pixel) {
    pixel.classList.add('selected', 'coloring');
    setTimeout(() => {
        pixel.classList.remove('coloring');
    }, 500); // Remove 'coloring' class after 0.5 seconds
}
