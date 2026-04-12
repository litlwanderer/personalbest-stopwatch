const timer = document.getElementById("timer");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const saveButton = document.getElementById("save");
const darkModeToggle = document.getElementById("darkModeToggle");
const sessionToggleButton = document.getElementById("sessionToggle");
const settingsOpenButton = document.getElementById("settingsOpen");
const settingsCloseButton = document.getElementById("settingsClose");
const sessionList = document.getElementById("sessionList");
const settingsModal = document.getElementById("settingsModal");
//cat variables
const sleepCatPicture = document.getElementById("sleepCatPicture");
const runCatPicture = document.getElementById("runCatPicture");
const catIDs = ["0","1","2","3","4"];
let currentCat = catIDs[Math.floor(Math.random() * catIDs.length)];
let sleepFrame = 0;
//settingsModal contents:
const bestModeToggleButton = document.getElementById("bestModeToggle");
const timeFormatToggleButton = document.getElementById("timeFormatToggle");
const timerLabelInput = document.getElementById("timerLabelInput");
const timerLabel = document.getElementById("timerLabel");
const hardResetButton = document.getElementById("hardReset");

let startTime = 0;
let elapsedTime = 0;
let sessions = [];
let isBestModeLonger = true;
let isSimpleFormat = true;

function startTimer(){
    //condition allows timer to resume if paused, not restart
    if (elapsedTime==0){
        startTime = Date.now();
    } else
    {
        //this accounts for time elapsed during the pause...
        //although if my math isn't mathing today and you ask me, I can't explain 100% WHY it works
        //which is embarrassing and not good - I know, okayyy?? moving on  ヽ(Д´)ノ`
        startTime = Date.now() - elapsedTime;
    }
    startButton.disabled = true;
    stopButton.disabled = false;
    resetButton.disabled = false;
    //basically starts a loop that runs this function every 10ms
    //returns an id for the running loop that I catch in timerInterval for stopping it later
    timerInterval = setInterval(updateTimer,10);
    saveButton.classList.remove("visible");
}

function updateTimer(){
    elapsedTime = Date.now()-startTime;
    if (isSimpleFormat){
        timer.textContent = formatTimerCompact(elapsedTime);
    } else
    {
        timer.textContent = formatTimer(elapsedTime);
    }

    //cat sleepiness progression checks. Yes, dirty and repetitive. Whatever.
    //30, 60 and 90 minutes respectively
    if (elapsedTime > 30 * 60 * 1000 && sleepFrame === 0) {
        sleepFrame = 1;
        sleepCatPicture.src = `sleepcat/sleepcat_${currentCat}_${sleepFrame}.png`;
    }
    if (elapsedTime > 60 * 60 * 1000 && sleepFrame === 1) {
        sleepFrame = 2;
        sleepCatPicture.src = `sleepcat/sleepcat_${currentCat}_${sleepFrame}.png`;
    }
    if (elapsedTime > 90 * 60 * 1000 && sleepFrame === 2) {
        sleepFrame = 3;
        sleepCatPicture.src = `sleepcat/sleepcat_${currentCat}_${sleepFrame}.png`;
    }
}

function stopTimer(){
    startButton.disabled = false;
    stopButton.disabled=true;
    resetButton.disabled=false;
    clearInterval(timerInterval);
    saveButton.classList.add("visible"); 
    saveButton.disabled=false;
}

//converts milliseconds into human readable time.
//credit to https://github.com/capwan/Stopwatch_timer/blob/main/script.js where I copy/pasted it from
function formatTimer(elapsedTime){
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    const mseconds = Math.floor((elapsedTime % 1000) / 10);
    return (
        (hours ? (hours > 9 ? hours : "0" + hours) : "00")
        + ":" +
        (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00")
        + ":" +
        (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00")
        + "." +
        (mseconds > 9 ? mseconds : "0" + mseconds));
}

//credit to claude 
function formatTimerSimplified(elapsedTime){
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    let result="";
    
    if (hours > 0) {
        result += hours + (hours === 1 ? " hour" : " hours");
        if (minutes > 0) {
            result += " " + minutes + (minutes === 1 ? " minute" : " minutes");
        }
    } else if (minutes>0)
    {
        result += minutes + (minutes === 1 ? " minute" : " minutes");
        if (seconds > 0) {
            result += " " + seconds + (seconds === 1 ? " second" : " seconds");
        }
    } else {
        const decimal = (elapsedTime / 1000).toFixed(1);
        result += decimal + (decimal === "1.0" ? " second" : " seconds");
    }    

    return result;
}

//yes, very much credit to claude hahaha
function formatTimerCompact(elapsedTime) {
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    
    let result = "";
    if (hours > 0) {
        result += hours + "h " + minutes + "m";
    } else if (minutes > 0) {
        result += minutes + "m " + seconds + "s";
    } else {
        result += seconds + "s";
    }
    return result;
}

function resetTimer(){
    clearInterval(timerInterval);
    timer.classList.add("resetting");
    setTimeout(() => {
        timer.classList.remove("resetting");
    }, 300);
    elapsedTime = 0;
    if (isSimpleFormat){
        timer.textContent = formatTimerCompact(elapsedTime);
    } else
    {
        timer.textContent = formatTimer(elapsedTime);
    }
    startButton.disabled = false;
    stopButton.disabled=true;
    resetButton.disabled = true;
    saveButton.classList.remove("visible");
    if (isBestModeLonger)
    {
        sleepFrame = 0;
        sleepCatPicture.src = `sleepcat/sleepcat_${currentCat}_${sleepFrame}.png`;
    }
}

function saveSession(){
    let session = {
        time: elapsedTime,
        date: new Date().toLocaleDateString(),
    };
    sessions.push(session);
    displaySessions();
    saveButton.disabled=true;
    startButton.disabled=true;
    localStorage.setItem("sessions", JSON.stringify(sessions));
}

//refresh session list
function displaySessions(){
    sessionList.innerHTML = ""
    // Add best time display at the top
    let bestSession = findBestTime();
    if(bestSession){
        let bestDiv = document.createElement("div");
        bestDiv.id = "best"
        bestDiv.textContent = "Best: " + (isSimpleFormat ? formatTimerSimplified(bestSession.time) : formatTimer(bestSession.time));
        sessionList.appendChild(bestDiv);
    }

    sessions.slice().reverse().forEach(        //index numbers can be kept track of in here because of JS' foreach bells and whistles
        function(session, index){
            let div = document.createElement("div");
            div.className = "session-item";
            if (index === sessions.length - 1) {
                div.classList.add("new");
            }
            div.textContent = (isSimpleFormat ? formatTimerSimplified(session.time) : formatTimer(session.time)) + " - " + session.date;
            let deleteButton = document.createElement("button");
            deleteButton.innerHTML = "<span class=material-symbols-outlined> delete </span>";
            deleteButton.onclick = function() {
                deleteSession(index);
            };
            div.appendChild(deleteButton);
            sessionList.appendChild(div); 
        }
    );
    //shows the session list and sets dropdown button image
    sessionList.removeAttribute("hidden")
    sessionToggleButton.innerHTML = "▲"
    // Show/hide toggle button based on whether there are sessions
    if(sessions.length > 0){
        sessionToggleButton.removeAttribute("hidden");
    } else {
        sessionToggleButton.setAttribute("hidden", "hidden");
    }
}

function loadPrevSessions(){
    //load user setting preferences
    let savedBestMode = localStorage.getItem("isBestModeLonger");
    if (savedBestMode !== null)
        { //convert to bool
            isBestModeLonger = (savedBestMode === "true");
        }

    if (isBestModeLonger)
    {
        bestModeToggleButton.innerHTML = "Best: Longer";
    } else
    {
        bestModeToggleButton.innerHTML = "Best: Faster";
    };

    let savedTimeFormat = localStorage.getItem("isSimpleFormat");
    if (savedTimeFormat !== null)
        { //convert to bool
            isSimpleFormat = (savedTimeFormat === "true");
        }
    if (isSimpleFormat)
    {
        timeFormatToggleButton.innerHTML = "Time Format: Simple";
        timer.textContent = formatTimerCompact(elapsedTime);
    } else
    {
        timeFormatToggleButton.innerHTML = "Time Format: Extended";
        timer.textContent = formatTimer(elapsedTime);
    };

    let savedTimerLabel = localStorage.getItem("timerLabel");
    if (savedTimerLabel){
        timerLabel.textContent = savedTimerLabel
    }

    let savedDarkMode = localStorage.getItem("isDarkMode");
    if (savedDarkMode === "true") {
        document.body.classList.add("dark-mode");
        darkModeToggle.innerHTML = '<span class="material-symbols-outlined">dark_mode</span>';
    }

    //load sessions
    let savedSessions = localStorage.getItem("sessions");
    if (savedSessions) {
        sessions = JSON.parse(savedSessions);
        displaySessions();
    }

    //show cat - tied to best mode
    updateCatMode()
}

function deleteSession(index){
    if (sessions.length === 1) {
        // last session! animate something first
        sessionList.classList.add("disappearing");
        setTimeout(() => {
            sessions.splice(index,1);
            localStorage.setItem("sessions", JSON.stringify(sessions));
            displaySessions();
            sessionList.classList.remove("disappearing");
        }, 300);
    } else {
        sessions.splice(index,1);
        localStorage.setItem("sessions", JSON.stringify(sessions));
        displaySessions();
    }
}

function toggleSessions(){
    if(sessionList.classList.contains('collapsed')){
        sessionList.classList.remove('collapsed');
        sessionToggleButton.innerHTML = "▲"
    } else {
        sessionList.classList.add('collapsed');
        sessionToggleButton.innerHTML = "▼"
    }
}

//best time can either be fastest or longest time depending on settings
function findBestTime(){
    if(sessions.length == 0){
        return null;
    };
    
    let best = sessions[0];  // start with first session
    
    sessions.forEach((session) => { 
        if (isBestModeLonger){
            if (session.time > best.time){
                best = session
            }
        } else
        {
            if (session.time < best.time){
                best = session
            }
        }
    })
    return best;
}

function toggleDarkMode(){
    document.body.classList.toggle("dark-mode");
    let isDark = document.body.classList.contains("dark-mode");
    darkModeToggle.innerHTML = isDark 
        ? '<span class="material-symbols-outlined">dark_mode</span>'
        : '<span class="material-symbols-outlined">light_mode</span>';
    localStorage.setItem("isDarkMode", isDark);
}

function updateCatMode() {
    if (isBestModeLonger) {
        // hide run cat, show sleepcat
        sleepCatPicture.removeAttribute("hidden");
        runCatPicture.setAttribute("hidden", "hidden");
        sleepCatPicture.src = `sleepcat/sleepcat_${currentCat}_0.png`;
        //end any runcat function scheduled to run
        clearTimeout(runCatTimeOut);
    } else {
        // hide sleepcat, hide runcat
        sleepCatPicture.setAttribute("hidden", "hidden");
        runCatPicture.setAttribute("hidden", "hidden");
        runCatPicture.src = `runcat/runcat_${currentCat}_0.png`;
        //start the run cat animation handler function after a random delay
        setTimeout(runCat, randomMilliseconds(10000,20000))
    }
}

//running cat animation handler.
//todo: There's a bunch of hardcoded numbers in here and randommilliseconds is still too small, it's debug
function runCat() {
    //initialise and actually show the frame
    let currentRunFrameNumber = 0;
    runCatPicture.removeAttribute("hidden");

    const screenwidth = window.innerWidth //in px
    //note below: the multiplier is to make sure that the cat actually goes off screen when needed.
    //a bit messy and stupid but whatever
    const catwidth = runCatPicture.offsetWidth*2; //in px
    const speed = 400; //in px per second
    //as we know, distance/speed = time, so this is the time, in seconds,
    //of "how long it takes for cat to move all the way from left to right"
    const animationDuration = (screenwidth+catwidth*2)/speed;
    
    let frameCycleRate = 150; //in milliseconds
    //pick random direction
    const isGoingRight = Math.random() > 0.5;

    //set starting pos and flip image if going left
    if (isGoingRight){
        runCatPicture.style.left = -catwidth+"px"
        runCatPicture.style.transform = "scaleX(1)"
    } else{
        runCatPicture.style.left = screenwidth + "px"
        runCatPicture.style.transform = "scaleX(-1)"
    }

    //init done,there are 3 things we now need to do: 
    //1. cycle frames
    //2. move the pic from left of screen to right of screen
    //3. hide when done

    //1. start the frame cycle
    let frameCycleInterval = setInterval(() => {
        currentRunFrameNumber = (currentRunFrameNumber+1) %4
        //Note on above: 4 is the total number of frames so it wraps.
        //bit of a magic number; change this if the total number of frames per loop changes
        runCatPicture.src = `runcat/runcat_${currentCat}_${currentRunFrameNumber}.png`;
    }, frameCycleRate)

    //2. start the css transition (easing animation, but not eased, it's linear)
    runCatPicture.style.transition = `left ${animationDuration}s linear`;
    //and in 50 ms, actually move the cat's x position to either the left or the right edge
    //of the screen, as appropriate.
    //why 50ms? because if u do it immediately after setting the transition,
    //js may just teleport the cat
    setTimeout(()=>{
        if (isGoingRight){
            runCatPicture.style.left = screenwidth + catwidth + "px"
        } else {
            runCatPicture.style.left = -catwidth + "px"
        }
    },50);

    //3. hide the cat once it's finished moving all the way
    runCatPicture.addEventListener("transitionend", (event) => {
        if (event.propertyName !== "left") return;
        //stop the frame cycle
        clearInterval(frameCycleInterval);
        //hide the cat
        runCatPicture.setAttribute("hidden", "hidden")
        //stop the left/right transition animation
        runCatPicture.style.transition = "none"

        //schedule the next run, by calling this whole function again
        //in 50-80 seconds
        //note: a bit hardcoded, need to fix these magic numbers later
        if (!isBestModeLonger){
            runCatTimeOut=setTimeout(runCat, randomMilliseconds(50000,80000))
        }
    }, {once: true}); //ie: the event listener autoremoves itself after firing once
}

//returns random milliseconds from min to max
//not sure if it's inclusive or exclusive. Whatevs
function randomMilliseconds(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

document.addEventListener('DOMContentLoaded', loadPrevSessions);
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
saveButton.addEventListener("click", saveSession);
darkModeToggle.addEventListener("click",toggleDarkMode);
sessionToggleButton.addEventListener("click", toggleSessions);
settingsOpenButton.addEventListener("click", () =>{
    settingsModal.removeAttribute("hidden");
    settingsModal.classList.add("animating");
    setTimeout(() => {
        settingsModal.classList.remove("animating");
    }, 250);
});
settingsCloseButton.addEventListener("click", () =>{
    settingsModal.classList.add("closing");
    setTimeout(() => {
        settingsModal.setAttribute("hidden", "hidden");
        settingsModal.classList.remove("closing");
    }, 250);
})
//settings panel event handlers:
bestModeToggleButton.addEventListener("click", () => {
    isBestModeLonger = !isBestModeLonger;
    if (isBestModeLonger)
    {
        bestModeToggleButton.innerHTML = "Best: Longer"
    } else
    {
        bestModeToggleButton.innerHTML = "Best: Faster"
    };
    localStorage.setItem("isBestModeLonger", isBestModeLonger);
    updateCatMode()
    //call displaysessions again to refresh
    displaySessions();
});
timeFormatToggleButton.addEventListener("click", ()=>{
    isSimpleFormat = !isSimpleFormat;
    if (isSimpleFormat)
    {
        timeFormatToggleButton.innerHTML = "Time Format: Simple"
    } else
    {
        timeFormatToggleButton.innerHTML = "Time Format: Extended"
    };
    localStorage.setItem("isSimpleFormat", isSimpleFormat);
    //call displaysessions and stopped timer display to refresh
    timer.textContent = isSimpleFormat ? formatTimerCompact(elapsedTime) : formatTimer(elapsedTime);
    displaySessions();
});
timerLabelInput.addEventListener('input', () => {
    let newLabel = timerLabelInput.value.trim();
    if (newLabel == "") {
        timerLabel.textContent = "Stopwatch";  // default
    } else {
        timerLabel.textContent = newLabel;
    }
    localStorage.setItem("timerLabel", newLabel);
});
//hard reset button
hardResetButton.addEventListener("click", ()=>{
    confirmModal.removeAttribute("hidden");
})
confirmYes.addEventListener('click', () => {
    localStorage.clear();
    window.location.reload()
    confirmModal.setAttribute("hidden", "hidden");
});
confirmNo.addEventListener('click', () => {
    confirmModal.setAttribute("hidden", "hidden");
});
//end hard reset button