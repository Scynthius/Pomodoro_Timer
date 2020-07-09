
  /*
    for now we just have a single hardcoded mp3 that plays. can add more functionality (selecting, swapping) in the future
    I added this function to the clock object as a method -- DS
  */
  function playSound(filename){
        let audio = new Audio(filename);
        audio.play();
  }


let Clock = {
  taskTimeLeft: [25,0], // [minutes,seconds]
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
    const pauseBtn = document.getElementById('pause');
    const stopBtn = document.getElementById('stop');
    const timerDisplay = document.getElementById('timerDisplay');
    const startBreak = function() {
      that.updateBreakTime([parseInt(document.getElementById('timeForm').elements[1].value),0]);
      that.startClock(that.breakTimeLeft, "break", startTask );
    };
    const startTask = function() {
      that.updateTaskTime([parseInt(document.getElementById('timeForm').elements[0].value),0]);
      console.log(that.taskTimeLeft);
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
    let paused = false;
    const pauseBtn = document.getElementById('pause');
      const pause = function() {
        console.log(paused);
        if (!paused){
          clearInterval(startCountdown);
          paused = true;
        } else {
          setInterval(startCountdown);
          paused = false;
        }
      };
    pauseBtn.addEventListener("click", () => pause() );
    const startCountdown = setInterval( function(){
      //add pause event listener
      
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
      that.updateTaskTime([minutes, seconds]);
    }, 1000);

    //update timeLeft and state
    
    this.playSound('http://soundbible.com/grab.php?id=914&type=mp3');
  },


}


Clock.ready();

//pause
//stop
//go to break to break at end of time
