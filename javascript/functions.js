function startClock() {
    //Toggle Start button div and Pause/Stop button divs
    //Check which button is toggled: task or break
    //Start the timer
    var startbtn = document.getElementById("start_button");
    var stopbtn = document.getElementById("stop_button");
    if (startbtn.hidden === true) {
        startbtn.hidden = false;
        stopbtn.hidden = true;
    } else {
        startbtn.hidden = true;
        stopbtn.hidden = false;
    }
}