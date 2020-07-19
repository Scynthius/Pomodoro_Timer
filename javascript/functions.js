function toggleStartStopButtons() {
    //Toggle Start button div and Pause/Stop button divs
    //Check which button is toggled: task or break
    //Start the timer
    var startbtn = document.getElementById("start_button");
    var stopbtn = document.getElementById("stop_button");
    var timeAdjustBtns = document.getElementsByClassName("btn-circle");
    if (startbtn.hidden === true) {
        startbtn.hidden = false;
        stopbtn.hidden = true;
        for (let item of timeAdjustBtns) {
            item.hidden = false;
        }
        document.getElementById("taskTimerDisplay").textContent = "25:00";
        document.getElementById("breakTimerDisplay").textContent = "5:00";
    } else {
        startbtn.hidden = true;
        stopbtn.hidden = false;
        for (let item of timeAdjustBtns) {
            item.hidden = true;
        }
    }
}


function togglePause() {
    let pausebtn = document.getElementById("pause");
    let btnstate = pausebtn.textContent;
    if (btnstate === "PAUSE"){
        pausebtn.textContent = "RESUME";
        pausebtn.classList.remove("btn-outline-secondary");
        pausebtn.classList.add("btn-outline-success");
    } else {
        pausebtn.textContent = "PAUSE";
        pausebtn.classList.remove("btn-outline-success");
        pausebtn.classList.add("btn-outline-secondary");
    }

}

function adjustTime(timer, increase) {
    if (timer == 'task') {
        timeString = document.getElementById("taskTimerDisplay");
    } else {
        timeString = document.getElementById("breakTimerDisplay");
    }

    parts = timeString.textContent.split(":");
    minVal = parseInt(parts[0], 10);

    if (increase) {
        minVal++;
        timeString.textContent = minVal.toString().concat(":00");
    } else {
        minVal--;
        timeString.textContent = minVal.toString().concat(":00");
    }

    if (timer == 'task') {
        Clock.updateTaskInterval(minVal);
    } else {
        Clock.updateBreakInterval(minVal);
    }

}

function toggleTimerDisplay(taskTimer) {
    timeString = document.getElementById("timerDisplay");
    if(taskTimer) {
        timeString.textContent = "25:00";
    } else {
        timeString.textContent = "5:00";
    }
}