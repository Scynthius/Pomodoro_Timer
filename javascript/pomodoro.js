
  /*
    for now we just have a single hardcoded mp3 that plays. can add more functionality (selecting, swapping) in the future
    I added this function to the clock object as a method -- DS
  */
  function playSound(filename){
        let audio = new Audio(filename);
        audio.play();
  }


let Clock = {
  taskTimeLeft: [1,0], // [minutes,secons]
  breakTimeLeft: [5,0],
  state: "sleep",
  updateState: function(state) {
    console.log(state+" started");
    this.state = state;
  },
  updateTaskTime: function(newVal){this.taskTimeLeft = newVal},
  updateBreakTime: function(newVal){this.breakTimeLeft = newVal},
  //logs remaining time to console as an array [minutes, seconds]
  logTimeLeft: function(){console.log(this.timeLeft)},
  //startCountdown(time, state)
  //2params: time = array [minutes,seconds] where the countdown should start
  //state = break or task, new state of the clock
  ready: function(){
    const that = this
    const startBtn = document.getElementById('start');
    const pauseBtn = document.getElementById('start');
    const startBreak = function() {
      that.startClock(that.breakTimeLeft, "task", startTask );
    };
    const startTask = function() {
      that.startClock(that.taskTimeLeft, "task", startBreak );
    };
    startBtn.addEventListener("click", () => startTask() );

  },
  startClock: function(time, newState, callback){
    //remove event listener from startBtn
    this.updateState(newState);
    let minutes = time[0];
    let seconds = time[1];
    const that = this;
    const startCountdown = setInterval( function(){
      //add pause event listener
      const pauseBtn = document.getElementById('pause');
      const pause = function() {
        clearInterval(startCountdown);
      };
      pauseBtn.addEventListener("click", () => pause() );
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
      console.log(timeString);
    }, 500);

    //update timeLeft and state
    this.updateTaskTime([minutes, seconds]);
    this.playSound();
  },
  //I just moved this from outside the of the clock object to here.
  playSound:function(filename){
    let audio = new Audio(filename);
    audio.play();
  }



}


Clock.ready();

//pause
//stop
//go to break to break at end of time
