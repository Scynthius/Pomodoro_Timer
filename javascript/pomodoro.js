

function Queue() {
  this.elements = [];
}

Queue.prototype.enqueueTask = function( task ) {
  this.elements.push( task );
};

Queue.prototype.dequeueTask = function() {
  return this.elements.shift();
};

Queue.prototype.isEmpty = function() {
  return this.elements.length == 0;
};

Queue.prototype.peek = function() {
  return this.isEmpty ? this.elements[0] : undefined;
};

Queue.prototype.length = function() {
  return this.elements.length;
};

let TaskList = new Queue();

function addToQueue(){
  //Get data from dropdown.selected and add row to table
}


function addNewTask() {
  //Save new task to database and update dropdown menu.
  let name = document.getElementsByName("newTaskName")[0].value;
  let pomodoros = document.getElementsByName("newTaskPomodoros")[0].value;
  let category = document.getElementsByName("newTaskCategory")[0].value;
  let taskTime = document.getElementsByName("newTaskTime")[0].value;
  let breakTime = document.getElementsByName("newBreakTime")[0].value;
  document.getElementById("newTaskForm").reset();

  
  if (newTaskName && newTaskPomodoros && newTaskCategory && newTaskTime && newBreakTime) {
    let newTask = {name: name, pomodoros: pomodoros, category: category, taskTime: taskTime, breakTime: breakTime};
    // -- \/ ADD TASK TO SQL DATABASE \/ --
    //queryString = "INSERT INTO `tasks`(`name`, `task_time`, `break_time`, `userid` `categoryid`) VALUES ((?), (?), (?), (?), (?))";

    //These two lines need to move
    TaskList.enqueueTask(newTask);
    addTaskToTable(newTask);
  }
}

function addTaskToTable(newTask) {
  var taskTable = document.getElementById("taskList");
  var newRow = taskTable.insertRow(TaskList.length());
  var nameCell = newRow.insertCell(0);
  var categoryCell = newRow.insertCell(1);
  var pomodorosCell = newRow.insertCell(2);
  var taskTimeCell = newRow.insertCell(3);
  var breakTimeCell = newRow.insertCell(4);
  nameCell.innerHTML = newTask.name;
  categoryCell.innerHTML = newTask.category;
  pomodorosCell.innerHTML = newTask.pomodoros;
  taskTimeCell.innerHTML = newTask.taskTime;
  breakTimeCell.innerHTML = newTask.breakTime;
  var test = taskTable.rows[1].cells[0].textContent;
  console.log(test);
  
}

function removeTaskFromTable() {
  document.getElementById("taskList").deleteRow(1);
}

function decreaseTaskPomodoros() {
  if (!TaskList.isEmpty()) {
    TaskList.peek().pomodoros--;
    if (TaskList.peek().pomodoros == 0) {
      removeTaskFromTable();
    } else {
      document.getElementById("taskList").rows[1].cells[2].innerHTML = TaskList.peek().pomodoros;
    }
  }
}



//sound file link : 'http://soundbible.com/grab.php?id=914&type=mp3'

let Clock = {
  //timer values, [minutes,seconds]

  taskInterval: [25,0],
  breakInterval: [5,0],
  incrementTaskInterval:function(){
    this.taskInterval[0] = this.taskInterval[0] + 1;
    this.taskTimeString.innerHTML = this.taskInterval[0] + ":00";
  },
  decrementTaskInterval:function(minutes){
    if(this.taskInterval[0] > 1){
    this.taskInterval[0] = this.taskInterval[0] - 1;
    this.taskTimeString.innerHTML = this.taskInterval[0] + ":00";
    }
  },
  updateTaskInterval:function(minutes) {
    this.taskInterval[0] = minutes;
    this.taskTimeString.innerHTML = minutes + ":00";
  },
  incrementBreakInterval: function(){
    this.breakInterval[0] = this.breakInterval[0] + 1;
    this.breakTimeString.innerHTML = this.breakInterval[0] + ":00";
  },
  decrementBreakInterval: function(){
    if(this.breakInterval[0] > 1){
    this.breakInterval[0] = this.breakInterval[0] - 1;
    this.breakTimeString.innerHTML = this.breakInterval[0] + ":00";
    }
  },
  updateBreakInterval:function(minutes){
    this.breakInterval[0] = minutes;
    this.breakTimeString.innerHTML = minutes + ":00";
  },
  taskTimeLeft: [0,0],
  breakTimeLeft: [0,0],
  skipBreak: false,
  //each button respondes differently according to the current state
  state: "sleep",
  //event handlers
  handleStartClick:function() {
    if(this.state === "ready"){
      this.state = "task";
      let taskTimeString = document.getElementById("taskTimerDisplay");
      let breakTimeString = document.getElementById("breakTimerDisplay");
      let taskParts = taskTimeString.textContent.split(":");
      let breakParts = breakTimeString.textContent.split(":");
      this.taskTimeLeft = [parseInt(taskParts[0], 10), 0];
      this.breakTimeLeft = [parseInt(breakParts[0], 10), 0];
      //Grab task table element
      var taskTable = document.getElementById("taskList");
      //If a task is in the task list, set proper timer value:
      if (taskTable.rows[1].cells[3].textContent != "" && taskTable.rows[1].cells[4].textContent != "") {
        console.log("Grabbing from table...");
        //Get value of task time
        this.updateTaskInterval(taskTable.rows[1].cells[3].textContent);
        this.taskTimeLeft = [taskTable.rows[1].cells[3].textContent, 0];
        //Get value of break time
        this.updateBreakInterval(taskTable.rows[1].cells[4].textContent);
        this.breakTimeLeft = [taskTable.rows[1].cells[4].textContent];
        document.getElementById("currentTaskName").innerHTML = taskTable.rows[1].cells[0].textContent;
      }
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

  },
  toggleSkipBreak: function(){
    if (this.skipBreak === true){
      this.skipBreakBtn.innerHTML = "Skip Break Off";
      this.skipBreak = false;
    }
    else{
      this.skipBreakBtn.innerHTML = "Skip Break On";
      this.skipBreak = true;
    }
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
    var taskTable = document.getElementById("taskList");
    if (taskTable.rows[1].cells[3].textContent != "" && taskTable.rows[1].cells[4].textContent != "") {
      console.log("Grabbing from table...");
      //Get value of task time
      this.updateTaskInterval(taskTable.rows[1].cells[3].textContent);
      this.taskTimeLeft = [taskTable.rows[1].cells[3].textContent, 0];
      //Get value of break time
      this.updateBreakInterval(taskTable.rows[1].cells[4].textContent);
      this.breakTimeLeft = [taskTable.rows[1].cells[4].textContent];
      document.getElementById("currentTaskName").innerHTML = taskTable.rows[1].cells[0].textContent;
    } else {
      document.getElementById("currentTaskName").innerHTML = "No Task";
    }
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
  // Buttons:
  startBtn: document.getElementById('start'),
  pauseResumeBtn: document.getElementById('pause'),
  stopBtn: document.getElementById('stop'),
  skipBreakBtn: document.getElementById('skip-break'),
  //timerDisplay: document.getElementById("timerDisplay"),
  taskTimeString: document.getElementById("taskTimerDisplay"),
  breakTimeString: document.getElementById("breakTimerDisplay"),
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

      console.log(this.taskTimeLeft + ", " + this.breakTimeLeft);

    };
    const countdown = setInterval(subtractOneSecond.bind(this), 500);
  },
  decrementTask: function(){
    //if timer reaches zero, restore the timers and toggle the state
    if (this.taskTimeLeft[0] === 0 && this.taskTimeLeft[1] === 0) {
      decreaseTaskPomodoros();
      this.restoreTimers();
      this.state = "break";
      console.log("new state : "+ this.state)
      let minutes = this.taskInterval[0];
      let seconds = this.taskInterval[1];
      this.taskTimeString.innerHTML = this.makeTimerString(minutes, seconds);
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
      this.taskTimeString.innerHTML = this.makeTimerString(minutes, seconds);
    }

  },
  decrementBreak:function(){
    //if timer reaches zero, restore the timers and toggle the state
    if (this.skipBreak === true){
      this.breakTimeLeft[0]=0;
      this.breakTimeLeft[1]=0;
    }
    if (this.breakTimeLeft[0] === 0 && this.breakTimeLeft[1] === 0) {
      this.restoreTimers();
      this.state = "task";
      console.log("new state :task");
      let minutes = this.breakInterval[0];
      let seconds = this.breakInterval[1];
      this.breakTimeString.innerHTML = this.makeTimerString(minutes, seconds);
      if(this.skipBreak === false){
        this.playSound('http://soundbible.com/grab.php?id=914&type=mp3');
      }


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
      this.breakTimeString.innerHTML = this.makeTimerString(minutes, seconds);
   }

  },

  //starts the clock
  //updates state to "ready"
  //adds event listeners to DOM elements
  start: function(){
    this.state = "ready";
    let task_minutes = this.taskInterval[0];
    let task_seconds = this.taskInterval[1];
    let break_minutes = this.breakInterval[0];
    let break_seconds = this.breakInterval[1];

    this.taskTimeString.innerHTML = this.makeTimerString(task_minutes, task_seconds);
    this.breakTimeString.innerHTML = this.makeTimerString(break_minutes, break_seconds);
    this.pauseResumeBtn.addEventListener("click", this.handlePauseResumeClick.bind(this));
    this.startBtn.addEventListener("click", this.handleStartClick.bind(this));
    this.stopBtn.addEventListener("click", this.handleStopClick.bind(this));
    console.log("new state: "+ this.state);
  }
}


Clock.start();
