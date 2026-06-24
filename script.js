document.addEventListener("DOMContentLoaded", function() {

    function updatetime() {
        var timeEl = document.querySelector('#timeElement');
        if (timeEl) {
            timeEl.innerHTML = new Date().toLocaleString();
        }
    }
    setInterval(updatetime, 1000);
    updatetime();

    // Window Z-Index Management 
    var biggestIndex = 100;

    function handleWindowTap(element) {
        if (!element) return;
        biggestIndex++;
        element.style.zIndex = biggestIndex;
    }

    function addWindowTapHandling(element) {
        if (!element) return;
        element.addEventListener("mousedown", function() {
            handleWindowTap(element);
        });
    }

    function closeWindow(element) {
        if (element) element.style.display = "none";
    }

    function openWindow(element) {
        if (!element) return;
        element.style.display = "block";
        handleWindowTap(element); 
    }

    function initializeWindow(windowId) {
        var windowElement = document.querySelector("#" + windowId);
        if (!windowElement) return;

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

    // Dragging
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

    initializeWindow("welcome");
    initializeWindow("Colemanotes");
    initializeWindow("weatherApp");
    initializeWindow("quoteApp");

    var welcomeScreen = document.querySelector("#welcome");
    var welcomeScreenOpen = document.querySelector("#welcomeopen");
    var colemanotesScreen = document.querySelector("#Colemanotes");
    var weatherAppScreen = document.querySelector("#weatherApp");
    var quoteAppScreen = document.querySelector("#quoteApp");

    var colemanotesIcon = document.querySelector("#colemanotesIcon");
    var weatherIcon = document.querySelector("#weatherIcon");
    var quoteIcon = document.querySelector("#quoteIcon");

    if (welcomeScreenOpen) {
        welcomeScreenOpen.addEventListener("click", function() {
            openWindow(welcomeScreen);
        });
    }

    if (colemanotesIcon) {
        colemanotesIcon.addEventListener("click", function() {
            openWindow(colemanotesScreen);
        });
    }

    if (weatherIcon) {
        weatherIcon.addEventListener("click", function() {
            openWindow(weatherAppScreen);
            fetchBuffaloWeather();
        });
    }

    if (quoteIcon) {
        quoteIcon.addEventListener("click", function() {
            openWindow(quoteAppScreen);
        });
    }

    // Colemanotes Notes
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
            content: "<h2>Why Keon Coleman is a Player to Look Out For</h2><p>I get it, this is all very hypothetical and Coleman will need to step up off the field as well. But at the time of year when we sit and wait for training camp to get started, I am going to choose to be optimistic about Keon Coleman. For the sake of all Bills fans, lets hope that I am right. <br> Source: https://www.buffalorumblings.com/authors/anthony-marino</p>"
        }
    ];

    var sidebar = document.querySelector("#sidebar");
    var noteDisplay = document.querySelector("#note-display");

    function setNotesContent(index) {
        if (noteDisplay) {
            var selectedNote = myNotes[index]; 
            noteDisplay.innerHTML = selectedNote.content;
        }
    }

    function addToSideBar(index) {
        if (!sidebar) return;
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

    if (sidebar) {
        for (let i = 0; i < myNotes.length; i++) {
            addToSideBar(i);
        }
    }

    // Weather
    var buffaloTempDisplay = document.querySelector("#buffalo-temp");
    var refreshButton = document.querySelector("#refresh-weather");

    function fetchBuffaloWeather() {
        if (!buffaloTempDisplay) return;
        buffaloTempDisplay.innerHTML = "Loading...";
        var url = "https://api.open-meteo.com/v1/forecast?latitude=42.89&longitude=-78.88&current_weather=true&temperature_unit=fahrenheit";
        
        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                var currentTemp = data.current_weather.temperature;
                buffaloTempDisplay.innerHTML = currentTemp + "°F";
            })
            .catch(function(err) {
                buffaloTempDisplay.innerHTML = "Error";
            });
    }

    if (refreshButton) {
        refreshButton.addEventListener("click", fetchBuffaloWeather);
    }

    // Keon Quotesman
    var keonQuotes = [
        "You know how much this jacket is? ... $80. Macy's. On sale.",
        "I'm Tiger... wish he could. I wish I could golf for real. But I could drive pretty good.",
        "I love cookies.",
        "Two hot and spicy sandwiches with cheese and extra mayo, a medium fry, Oreo McFlurry, and a 10-piece nugget.",
        "I don't need self-motivation, I know what I'm here to do, I know what I'm capable of doing.",
        "Words are one thing, actions are another. I'm still here, it's just a blessing to come out here and compete."
    ];

    var quoteDisplayArea = document.querySelector("#quote-text-area");
    var generateButton = document.querySelector("#generate-quote");

    function getNewQuote() {
        if (quoteDisplayArea) {
            var randomIndex = Math.floor(Math.random() * keonQuotes.length);
            quoteDisplayArea.innerHTML = '"' + keonQuotes[randomIndex] + '"';
        }
    }

    if (generateButton) {
        generateButton.addEventListener("click", getNewQuote);
    }

});