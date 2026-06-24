function updatetime() {
    document.querySelector('#timeElement').innerHTML = new Date().toLocaleString();
}
setInterval(updatetime, 1000);

var welcomeScreen = document.querySelector("#welcome");
var welcomeScreenOpen = document.querySelector("#welcomeopen");

var colemanotesScreen = document.querySelector("#Colemanotes");
var desktopAppIcon = document.querySelector("#desktopApp");

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

welcomeScreenOpen.addEventListener("click", function() {
  openWindow(welcomeScreen);
});

desktopAppIcon.addEventListener("click", function() {
  openWindow(colemanotesScreen);
});

function dragElement(windowElement, headerElement) {
  if (!windowElement) return; 

  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

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

initializeWindow("welcome");
initializeWindow("Colemanotes");

// --- 8. Colemanotes App Logic ---

// The Database
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
    title: "Rookie Season Thoughts",
    date: "06/24/2026",
    content: "<h2>Looking Forward</h2><p>It will be great to see how his route running translates to the pro level after a few seasons in the system.</p>"
  }
];

// Grab the HTML elements we built earlier
var sidebar = document.querySelector("#sidebar");
var noteDisplay = document.querySelector("#note-display");

// The Engine: Injecting content to the right screen
function setNotesContent(index) {
  // Find the exact note in the array using its index number (0, 1, or 2)
  var selectedNote = myNotes[index]; 
  
  // Overwrite the right column's HTML with the note's content
  noteDisplay.innerHTML = selectedNote.content;
}

// The Factory: Building the sidebar buttons programmatically
function addToSideBar(index) {
  var note = myNotes[index];
  
  // 1. Create a brand new, empty HTML div
  var newDiv = document.createElement("div");
  
  // 2. Add some styling so it looks like a clickable button
  newDiv.style.padding = "10px";
  newDiv.style.borderBottom = "1px solid #ccc";
  newDiv.style.cursor = "pointer";
  
  // 3. Fill the div using backticks (`) which allow injecting variables via ${}
  newDiv.innerHTML = `
    <p style="margin: 0px; font-weight: bold;">${note.title}</p>
    <p style="margin: 0px; font-size: 12px; color: gray;">${note.date}</p>
  `;
  
  // 4. Attach the click listener so it knows to run the display function
  newDiv.addEventListener("click", function() {
    setNotesContent(index);
  });
  
  // 5. Append (attach) this finished div into the actual sidebar on the page
  sidebar.appendChild(newDiv);
}

// The Loop: Run the factory once for every item in the myNotes database
for (let i = 0; i < myNotes.length; i++) {
  addToSideBar(i);
}