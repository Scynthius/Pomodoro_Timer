

let Clock = {
  taskTimeLeft: [1,0], // [minutes,seconds]
  breakTimeLeft: [1,0],
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

    //event handlers
    const startBreak = function() {
      if (that.state === "task"){
        pauseResumeBtn.removeEventListener("click", startBreak );
        pauseResumeBtn.removeEventListener("click", startTask );
        that.playSound('http://soundbible.com/grab.php?id=914&type=mp3');
      };
      that.startClock(that.breakTimeLeft, "break", startTask );
    };
    const startTask = function() {
      pauseResumeBtn.removeEventListener("click", startTask );
      startBtn.removeEventListener("click", startTask );
      if (that.state === "break"){
        that.playSound('http://soundbible.com/grab.php?id=914&type=mp3');
      };
      that.startClock(that.taskTimeLeft, "task", startBreak );
    };
    //set event listeners based on current state
    //READY#######################
    if (newState === "ready") {
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
  updateTaskTime: function(newVal){this.taskTimeLeft = newVal},
  updateBreakTime: function(newVal){this.breakTimeLeft = newVal},
  logTimeLeft: function(){console.log(this.timeLeft)},
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
      pauseResumeBtn.removeEventListener("click", pause);
      clearInterval(startCountdown);
      that.updateTaskTime([minutes, seconds]);
      console.log(that.taskTimeLeft);
      if (that.state === "task"){
        that.updateState("pauseTask");
      }
      else if (that.state === "break"){
        that.updateState("pauseBreak");
      };
    };
    pauseResumeBtn.addEventListener("click", pause );
    const startCountdown = setInterval( function(){
      const timerDisplay = document.getElementById("timerDisplay")
      let timeString = String(minutes) + ":";
      if (seconds < 10){
        timeString += "0";
      }
      timeString += String(seconds);
      //update timeString
      seconds -= 1;
      if(seconds < 0) {
        seconds = 59;
        minutes -= 1;
      }
      if (minutes < 0){
        clearInterval(startCountdown);
        callback();
      }
      timerDisplay.textContent = timeString;
      console.log(timeString);
      if (that.state === "task") {
        that.updateTaskTime([minutes, seconds]);
      }
      else if (that.state === "break") {
        that.updateBreakTime([minutes, seconds]);
      }

    }, 500);
  },

}

Clock.start();
