
//sound file link : 'http://soundbible.com/grab.php?id=914&type=mp3'
    
let Clock = {
  //timer values, [minutes,seconds]
  taskInterval: [0,10],
  breakInterval: [0,10],
  taskTimeLeft: [0,10], 
  breakTimeLeft: [0,10],
  //each button respondes differently according to the current state
  state: "sleep",
  //event handlers
  handleStartClick:function() {
    if(this.state === "ready"){
      this.state = "task";
      this.startClock();
    }
    else {
      console.log("Cannot start from state " + this.state);
    };
  },
  handlePauseResumeClick:function() {
    let newState;
    //update state
    if (this.state != "ready"){
      switch (this.state) {
        case "task":
          this.state = "pauseTask";
          break;
        case "break":
          this.state = "pauseBreak";
          break;
        case "pauseTask":
          this.state = "task";
          this.startClock();
          break;
        case "pauseBreak":
          this.state = "break";
          this.startClock();
          break;
      };
    };
    console.log("new state: "+ this.state);

  },
  handleStopClick: function() {
    if (this.state != "ready"){
      this.state = "ready";
      this.restoreTimers();
    };
    console.log("new state: " + this.state);
    //TO DO: This function needs bring back the start button that we had at the very start 
    
  },
  //internal functions
  playSound:function(filename){
    if(this.soundOn === true) {
      let audio = new Audio(filename);
      audio.play();
    };
  },
  soundOn:true,
  restoreTimers: function(){
    this.taskTimeLeft[0] = this.taskInterval[0];
    this.taskTimeLeft[1] = this.taskInterval[1];
    this.breakTimeLeft[0] = this.breakInterval[0];
    this.breakTimeLeft[1] = this.breakInterval[1];
  },
  makeTimerString: function(minutes, seconds){
    let timerString = String(minutes) + ":";
    if (seconds < 10){
      timerString += "0"
    }
    timerString += String(seconds);
    return timerString;
  },
  // DOM elements  
  startBtn: document.getElementById('start'),
  pauseResumeBtn: document.getElementById('pause'),
  stopBtn: document.getElementById('stop'),
  timerDisplay: document.getElementById("timerDisplay"),
  // timer methods
  startClock: function(){
      if (this.state === "task" || this.state === "break"){
        this.clockCountdown();
      }
      else {
        console.log("Cannot start clock from state "+this.state);
      }
        
  },
  clockCountdown: function() {
    //decrements the values of the clock that is counting down (break or task) 
    //based on current state
    const subtractOneSecond = function(){
      
      if(this.state === "break") {
        this.decrementBreak();
      }
      else if (this.state === "task"){
        this.decrementTask();
      } 
      else if (this.state === "pauseTask" || this.state === "pauseBreak" ||
      this.state === "ready") {
        clearInterval(countdown);
      };

    };
    const countdown = setInterval(subtractOneSecond.bind(this), 1000);
  },
  decrementTask: function(){
    //if timer reaches zero, restore the timers and toggle the state
    if (this.taskTimeLeft[0] === 0 && this.taskTimeLeft[1] === 0) {
      this.restoreTimers();
      this.state = "break";
      console.log("new state : "+ this.state)
      let minutes = this.taskInterval[0];
      let seconds = this.taskInterval[1];
      this.timerDisplay.innerHTML = this.makeTimerString(minutes, seconds);
      this.playSound('http://soundbible.com/grab.php?id=914&type=mp3');

    }
    else{//subtract on second, and update the display
      if(this.taskTimeLeft[1] === 0) {
        this.taskTimeLeft[1] = 59;
        this.taskTimeLeft[0] -= 1;
      }
      else {
        this.taskTimeLeft[1] -= 1;
      };
      let minutes = this.taskTimeLeft[0];
      let seconds = this.taskTimeLeft[1];
      this.timerDisplay.innerHTML = this.makeTimerString(minutes, seconds);
    }
 
  },
  decrementBreak:function(){
    //if timer reaches zero, restore the timers and toggle the state
    if (this.breakTimeLeft[0] === 0 && this.breakTimeLeft[1] === 0) {
      this.restoreTimers();
      this.state = "task";
      console.log("new state :task");
      let minutes = this.breakInterval[0];
      let seconds = this.breakInterval[1];
      this.timerDisplay.innerHTML = this.makeTimerString(minutes, seconds);
      this.playSound('http://soundbible.com/grab.php?id=914&type=mp3');

   }
   else{//subtract on second, and update the display
    if(this.breakTimeLeft[1] === 0) {
      this.breakTimeLeft[1] = 59;
      this.breakTimeLeft[0] -= 1;
    }
    else {
      this.breakTimeLeft[1] -= 1;
    };
    let minutes = this.breakTimeLeft[0];
      let seconds = this.breakTimeLeft[1];
      this.timerDisplay.innerHTML = this.makeTimerString(minutes, seconds);
   }
  
  },
  //starts the clock
  //updates state to "ready"
  //adds event listeners to DOM elements
  start: function(){
    this.state = "ready";
    let minutes = this.taskInterval[0];
    let seconds = this.taskInterval[1];
    this.timerDisplay.innerHTML = this.makeTimerString(minutes, seconds);
    this.pauseResumeBtn.addEventListener("click", this.handlePauseResumeClick.bind(this));
    this.startBtn.addEventListener("click", this.handleStartClick.bind(this));
    this.stopBtn.addEventListener("click", this.handleStopClick.bind(this));
    console.log("new state: "+ this.state);
  }
}


Clock.start();
