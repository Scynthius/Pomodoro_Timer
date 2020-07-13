
let Clock = {
  taskInterval: [0,10],
  breakInterval: [0,10],
  taskTimeLeft: [0,0], // [minutes,seconds]
  breakTimeLeft: [0,0],
  updateTaskTimeLeft: function(newVal){this.taskTimeLeft = newVal},
  updateBreakTimeLeft: function(newVal){this.breakTimeLeft = newVal},
  logTimeLeft: function(){console.log(this.timeLeft)},
  state: "sleep",
  updateState: function(newState) {
    console.log("current state: " + this.state);
    console.log("new state: "+newState);
    this.state = newState;
    const that = this;
    //assign buttons to variables
    const startBtn = document.getElementById('start');
    const pauseResumeBtn = document.getElementById('pause');
    const stopBtn = document.getElementById('stop');
    const removeListeners = function(){
      pauseResumeBtn.removeEventListener("click", startBreak );
      pauseResumeBtn.removeEventListener("click", startTask );
      startBtn.removeEventListener("click", startTask );
    };
    //event handlers
    const startBreak = function() {
      removeListeners();
      if (that.state === "task" ){
        that.playSound('http://soundbible.com/grab.php?id=914&type=mp3');
      };
      that.startClock(that.breakTimeLeft, "break", startTask );
    };
    const startTask = function() {
      removeListeners();
      if (that.state === "break"){
        that.playSound('http://soundbible.com/grab.php?id=914&type=mp3');
      };
      that.startClock(that.taskTimeLeft, "task", startBreak );
    };
    //set event listeners based on current state
    //READY#######################
    if (newState === "ready") {
      that.taskTimeLeft = that.taskInterval;
      that.breakTimeLeft = that.breakInterval;
      startBtn.addEventListener("click", startTask );
    }
    //TASK########################
    else if (newState === "task"){
      startBtn.removeEventListener("click", startTask );
      //pause button set inside startCountdown
    }
    else if (newState === "break"){
      startBtn.removeEventListener("click", startBreak );
      //pause button set inside startCountdown
    }
    //PAUSETASK########################
    else if (newState === "pauseTask") {
      pauseResumeBtn.addEventListener("click", startTask );
      pauseResumeBtn.removeEventListener("click", startBreak );
    }
    //PAUSEBREAK########################
    else if (newState === "pauseBreak") {
      pauseResumeBtn.removeEventListener("click", startTask );
      pauseResumeBtn.addEventListener("click", startBreak );
    }

  },

  start: function(){
    this.updateState("ready");
  },
  playSound:function(filename){
        if(this.soundOn === true) {
          let audio = new Audio(filename);
          audio.play();
        };
  },
  soundOn:false,
  //function: startCountdown(time, state)
  //params: time = array [minutes,seconds] where the countdown should start
    //state = break or task, new state of the clock
    //callback: function executes after clock reaches zero
  startClock: function(time, newState, callback){
    //remove event listener from startBtn
    this.updateState(newState);
    let minutes = time[0];
    let seconds = time[1];
    const that = this;
    let paused = false;
    const pauseResumeBtn = document.getElementById('pause');
    const pause = function() {
      //paused = true;
      pauseResumeBtn.removeEventListener("click", pause);
      clearInterval(startCountdown);

      console.log("within pause:" + minutes + ", " + seconds);
      if (that.state === "task"){
        console.log(that.taskTimeLeft);
        that.updateState("pauseTask");
        //that.updateTaskTimeLeft([minutes, seconds]);
      }
      else if (that.state === "break"){
        console.log(that.breakTimeLeft);
        that.updateState("pauseBreak");
        //that.updateBreakTimeLeft([minutes, seconds]);
      };
    };

    const startCountdown = setInterval( function(){
      //update remaining break and task times
      if (that.state === "task") {
        that.updateTaskTimeLeft([minutes, seconds]);

        //may not be necessary
        that.updateBreakTimeLeft(that.breakInterval);
      }
      else if (that.state === "break") {
        that.updateBreakTimeLeft([minutes, seconds]);
        that.updateTaskTimeLeft(that.taskInterval);
      }
      //add event listener to pause button
      pauseResumeBtn.addEventListener("click", pause );

      //generate string for display
      const timerDisplay = document.getElementById("timerDisplay")
      let timeString = String(minutes) + ":";
      if (seconds < 10){
        timeString += "0";
      }
      timeString += String(seconds);

      console.log(timeString + ", " + that.state);
      console.log(that.taskTimeLeft + "], ["  + that.breakTimeLeft );
      timerDisplay.textContent = timeString;

      // check to see if timer has run out
      // if yes, the end function
      if (minutes === 0 && seconds === 0){
        clearInterval(startCountdown);
        console.log("zero");
        //restore time left on task and break
        that.taskTimeLeft = that.taskInterval;
        that.breakTimeLeft = that.breakInterval;
        callback();
      }
      //if no, subtract one second
      else {
        seconds -= 1;
        if(seconds === -1) {
          seconds = 59;
          minutes -= 1;
        };
      }

    }, 1000);
  },

}

Clock.start();
