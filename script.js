// --- 1. Clock Logic ---
function updatetime() {
    document.querySelector('#timeElement').innerHTML = new Date().toLocaleString();
}
setInterval(updatetime, 1000);

// --- 2. Window Z-Index Management ---
var biggestIndex = 100;

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
}

function addWindowTapHandling(element) {
  element.addEventListener("mousedown", function() {
    handleWindowTap(element);
  });
}

function closeWindow(element) {
  element.style.display = "none";
}

function openWindow(element) {
  element.style.display = "block";
  handleWindowTap(element); 
}

// --- 3. Master Initialization Function ---
function initializeWindow(windowId) {
  var windowElement = document.querySelector("#" + windowId);
  var lowerCaseId = windowId.toLowerCase(); 
  var headerElement = document.querySelector("#" + lowerCaseId + "header");
  var closeButton = document.querySelector("#" + lowerCaseId + "close");

  addWindowTapHandling(windowElement);
  dragElement(windowElement, headerElement);

  if (closeButton) {
    closeButton.addEventListener("click", function() {
      closeWindow(windowElement);
    });
  }
}

// --- 4. Desktop Icon Logic ---
var selectedIcon = undefined;

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element;
} 

function deselectIcon(element) {
  element.classList.remove("selected");
  selectedIcon = undefined; 
} 

function handleIconTap(element) {
  if (element.classList.contains("selected")) {
    deselectIcon(element);
  } else {
    selectIcon(element);
  }
}

// --- 5. Open Window Event Listeners ---
var welcomeScreen = document.querySelector("#welcome");
var welcomeScreenOpen = document.querySelector("#welcomeopen");
var colemanotesScreen = document.querySelector("#Colemanotes");
var weatherAppScreen = document.querySelector("#weatherApp");
var colemanotesIcon = document.querySelector("#colemanotesIcon");
var weatherIcon = document.querySelector("#weatherIcon");

welcomeScreenOpen.addEventListener("click", function() {
  openWindow(welcomeScreen);
});

colemanotesIcon.addEventListener("click", function() {
  openWindow(colemanotesScreen);
});

// Click listener for the weather icon opens the window AND triggers the API fetch
weatherIcon.addEventListener("click", function() {
  openWindow(weatherAppScreen);
  fetchBuffaloWeather();
});


// --- 6. Draggable Logic ---
function dragElement(windowElement, headerElement) {
  if (!windowElement) return; 

  var initialX = 0, initialY = 0, currentX = 0, currentY = 0;

  if (headerElement) {
    headerElement.onmousedown = startDragging;
  } else {
    windowElement.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = moveElement; 
  }

  function moveElement(e) { 
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    windowElement.style.top = (windowElement.offsetTop - currentY) + "px";
    windowElement.style.left = (windowElement.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Initialize all three windows
initializeWindow("welcome");
initializeWindow("Colemanotes");
initializeWindow("weatherApp");

// --- 7. Colemanotes Database & Logic ---
var myNotes = [
  {
    title: "Draft Day Excitement",
    date: "04/25/2024",
    content: "<h2>Welcome to Buffalo!</h2><p>Keon Coleman was selected by the Bills in the second round. His size and athleticism are exactly what the offense needed.</p>"
  },
  {
    title: "Macy's Coat Legend",
    date: "04/27/2024",
    content: "<h2>The Yellow Jacket</h2><p>Already a legend for showing up to his introductory press conference talking about buying his winter coat on sale at Macy's. A true Buffalo fit.</p>"
  },
  {
    title: "It’s OK to be optimistic about Keon Coleman in 2026",
    date: "06/24/2026",
    content: "<h2>Why Keon Coleman is a Player to Look Out For</h2><p>I get it, this is all very hypothetical and Coleman will need to step up off the field as well. But at the time of year when we sit and wait for training camp to get started, I am going to choose to be optimistic about Keon Coleman. For the sake of all Bills fans, lets hope that I am right.</p>"
  }
];

var sidebar = document.querySelector("#sidebar");
var noteDisplay = document.querySelector("#note-display");

function setNotesContent(index) {
  var selectedNote = myNotes[index]; 
  noteDisplay.innerHTML = selectedNote.content;
}

function addToSideBar(index) {
  var note = myNotes[index];
  var newDiv = document.createElement("div");
  newDiv.style.padding = "10px";
  newDiv.style.borderBottom = "1px solid #ccc";
  newDiv.style.cursor = "pointer";
  
  newDiv.innerHTML = `
    <p style="margin: 0px; font-weight: bold;">${note.title}</p>
    <p style="margin: 0px; font-size: 12px; color: gray;">${note.date}</p>
  `;
  
  newDiv.addEventListener("click", function() {
    setNotesContent(index);
  });
  
  sidebar.appendChild(newDiv);
}

for (let i = 0; i < myNotes.length; i++) {
  addToSideBar(i);
}

// --- 8. API Logic: Buffalo Live Weather ---
var buffaloTempDisplay = document.querySelector("#buffalo-temp");
var refreshButton = document.querySelector("#refresh-weather");

function fetchBuffaloWeather() {
    // Show a loading state while we wait for the internet
    buffaloTempDisplay.innerHTML = "Loading...";
    
    // The exact API endpoint for Buffalo, requested in Fahrenheit
    var url = "https://api.open-meteo.com/v1/forecast?latitude=42.89&longitude=-78.88&current_weather=true&temperature_unit=fahrenheit";
    
    // Asynchronous Fetch Request
    fetch(url)
        .then(function(response) {
            return response.json(); // Parse the data
        })
        .then(function(data) {
            // Drill down into the JSON object to extract the exact temperature value
            var currentTemp = data.current_weather.temperature;
            buffaloTempDisplay.innerHTML = currentTemp + "°F";
        });
}

// Allow the user to manually refresh the weather
refreshButton.addEventListener("click", fetchBuffaloWeather);