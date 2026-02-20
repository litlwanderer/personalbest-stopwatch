const timer = document.getElementById("timer");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const saveButton = document.getElementById("save");
const sessionToggleButton = document.getElementById("sessionToggle")
const settingsToggleButton = document.getElementById("settingsToggle")
const sessionList = document.getElementById("sessionList");
const settingsPanel = document.getElementById("settingsPanel")

let startTime = 0
let elapsedTime = 0
let sessions = []

function startTimer(){
    //condition allows timer to resume if paused, not restart
    if (elapsedTime==0){
        startTime = Date.now();
    } else
    {
        //this accounts for time elapsed during the pause...
        //although if my math isn't mathing today and you ask me, I can't explain 100% WHY it works
        //which is embarrassing and not good - I know, okayyy?? moving on  ヽ(Д´)ノ`
        startTime = Date.now() - elapsedTime
    }
    startButton.disabled = true;
    stopButton.disabled = false;
    //basically starts a loop that runs this function every 10ms
    //returns an id for the running loop that I catch in timerInterval for stopping it later
    timerInterval = setInterval(updateTimer,10);
    saveButton.setAttribute("hidden", "hidden");
}

function updateTimer(){
    elapsedTime = Date.now()-startTime;
    timer.textContent = formatTimer(elapsedTime);
}

function stopTimer(){
    startButton.disabled = false;
    stopButton.disabled=true;
    clearInterval(timerInterval);
    saveButton.removeAttribute("hidden");
    saveButton.disabled=false;
}

//converts milliseconds into human readable time.
//credit to https://github.com/capwan/Stopwatch_timer/blob/main/script.js where I copy/pasted it from
function formatTimer(elapsedTime){
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60))
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

function resetTimer(){
    clearInterval(timerInterval);
    elapsedTime = 0;
    timer.textContent = formatTimer(elapsedTime);
    startButton.disabled = false;
    stopButton.disabled=true;
    saveButton.setAttribute("hidden", "hidden");
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
    localStorage.setItem("sessions", JSON.stringify(sessions))
}

//refresh session list
function displaySessions(){
    sessionList.innerHTML = ""
    // Add best time display at the top
    let bestSession = findBestTime();
    if(bestSession){
        let bestDiv = document.createElement("div");
        bestDiv.textContent = "Best: " + formatTimer(bestSession.time);
        sessionList.appendChild(bestDiv);
    }

    sessions.forEach(
        //index numbers can be kept track of in here because of JS' foreach bells and whistles
        function(session, index){
            let div = document.createElement("div");
            div.textContent = formatTimer(session.time) + " - " + session.date;
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
    let saved = localStorage.getItem("sessions");
    if (saved) {
        sessions = JSON.parse(saved);
        displaySessions();
    }
}

function deleteSession(index){
    //remove 1 element from the sessions array
    sessions.splice(index,1);
    localStorage.setItem("sessions", JSON.stringify(sessions));
    displaySessions()
}

function toggleSessions(){
    if(sessionList.hasAttribute('hidden')){
        sessionList.removeAttribute("hidden");
        sessionToggleButton.innerHTML = "▲"
    } else
    {
        sessionList.setAttribute("hidden", "hidden");
        sessionToggleButton.innerHTML = "▼"
    }
}

function toggleSettings(){
    if(settingsPanel.hasAttribute('hidden')){
        settingsPanel.removeAttribute("hidden");
    } else
    {
        settingsPanel.setAttribute("hidden", "hidden");
    }
}

function findBestTime(){
    if(sessions.length == 0){
        return null;
    };
    
    let best = sessions[0];  // start with first session
    
    sessions.forEach((session) => { 
        if (session.time > best.time){
            best = session
        }
    })
    return best;
}

document.addEventListener('DOMContentLoaded', loadPrevSessions);
startButton.addEventListener('click', startTimer)
stopButton.addEventListener('click', stopTimer)
resetButton.addEventListener('click', resetTimer)
saveButton.addEventListener("click", saveSession)
sessionToggleButton.addEventListener("click", toggleSessions)
settingsToggleButton.addEventListener("click", toggleSettings)


/*To-do list:
Toggle best mode (longest vs shortest) - goes in settings
Custom timer label ("What are you timing?") - goes in settings
Simplified time format toggle (00:08:34 vs "8 minutes 34 seconds") - goes in settings
CSS styling with your color palette
Cat doodles (stretch goal)*/