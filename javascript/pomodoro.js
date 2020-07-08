
let Clock = {
  timeLeft: [25,0], // [minutes,secons]
  state: "sleep",
  updateState: (state) => this.state = state,
  updateTimeLeft: function(newVal){this.timeLeft = newVal},
  //logs remaining time to console as an array [minutes, seconds]
  logTimeLeft: function(){console.log(this.timeLeft)},
  //startCountdown(time, state)
  //2params: time = array [minutes,seconds] where the countdown should start
  //state = break or task, new state of the clock
  ready: function(){
    const that = this
    const startBtn = document.getElementById('start');
    startBtn.addEventListener("click", function(){
      that.startCountdown(that.timeLeft, "task");
    })
  },
  startCountdown: function(time, state){
    this.updateState(state);
    let minutes = this.timeLeft[0];
    let seconds = this.timeLeft[1]
    const startCountdown = setInterval( function(){
      //for pause(), add event listener to button. If button is clicked,
      //use clearIntervals(startCountdown) to stop the timer.
      //log time to console as a string
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
      }
      console.log(timeString);
    }, 1000);
    this.updateTimeLeft([minutes, seconds]);
    this.updateState("wait");
  }


}


Clock.ready();
