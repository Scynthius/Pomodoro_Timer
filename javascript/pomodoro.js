// Queue class
function Queue() {
  this.elements = [];
};

Queue.prototype.enqueueTask = function( task ) {
  this.elements.push( task );
  addTaskToTable(task);
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

let TaskQueue = new Queue();

//Queue and Task List functions
function addToQueue(){
  var dropdownselected = document.getElementById("taskSelector").value;
  let array = dropdownselected.split(',');
  let taskid = array[0];
  let categoryid = array[1];
  let taskTime = array[2];
  let breakTime = array[3];

  let taskSelector = document.getElementById("taskSelector");
  taskSelectorOpts = taskSelector.options;
  let selectedIndex = taskSelector.selectedIndex;
  let taskName = taskSelectorOpts[selectedIndex].text;
  console.log(taskName, taskid, categoryid, taskTime, breakTime);
  //*-->pomodoros is not present at the moment.
  //*-->category id needs to be turned into category name.
  let data = {
    "name"            : taskName,
    "pomodoros"       : 1,
    "category"        : categoryid,
    "taskTime"        : taskTime,
    "breakTime"       : breakTime
  }
  TaskQueue.enqueueTask(data);
}

function getNewTaskData() {
  //Save new task to database and update dropdown menu.
  
  var category;
  let name = document.getElementsByName("newTaskName")[0].value;
  var pomodoros = document.getElementById("newTaskPomodoros").value;
  console.log(pomodoros);
  let taskTime = document.getElementsByName("newTaskTime")[0].value;
  let breakTime = document.getElementsByName("newBreakTime")[0].value;
  let newCategoryDrop = document.getElementById("addNewCategory");
  if(newCategoryDrop.hidden == true){
    categoryDrop = document.getElementById("newTaskCategory");
    categoryName = categoryDrop.options[categoryDrop.selectedIndex].text;
    category = categoryDrop.options[categoryDrop.selectedIndex].value;
    console.log(category, categoryName);
    newCategory = false;
  } else {
    category = document.getElementById("newCategoryInput").text;
    console.log(category);
    newCategory = true;
  }
  var data = {
    "name"              : name,
    "pomodoros"         : pomodoros,
    "category"          : category,
    "taskTime"          : taskTime,
    "breakTime"         : breakTime,
    "newCategory"       : newCategory,
    "categoryName"      : categoryName
  };

  return data;
}

function addNewTask() {
  var data = getNewTaskData();
  var taskForm = document.getElementById("newTaskForm");
  var request = new XMLHttpRequest();
  request.open('PUT', '/', true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.addEventListener('load', function () {
      if (request.status >= 200 && request.status < 400) {
          taskForm.reset();
          let newTask = {name: data.name, pomodoros: data.pomodoros, category: data.categoryName, taskTime: data.taskTime, breakTime: data.breakTime};
          TaskQueue.enqueueTask(newTask);
      } else {
          console.log('Error');
      }
  });
  request.send(JSON.stringify(data));
}

function addTaskToTable(newTask) {
  //Insert task into HTML table
  var taskTable = document.getElementById("TaskQueue");
  console.log(TaskQueue.length());
  var newRow = taskTable.insertRow(TaskQueue.length());

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
}

function removeTaskFromTable() {
  document.getElementById("TaskQueue").deleteRow(1);
}

function saveCompletedTask() {
    let name = TaskQueue.peek().name;
    let category = TaskQueue.peek().category;
    let taskTime = TaskQueue.peek().taskTime;
    let breakTime = TaskQueue.peek().breakTime;
    var data = {
      "name"              : name,
      "category"          : category,
      "taskTime"          : taskTime,
      "breakTime"         : breakTime
    };
    var request = new XMLHttpRequest();
    request.open('PUT', '/completed', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            console.log("Stored user performance data.");
        } else {
            console.log('Error');
        }
    });
    request.send(JSON.stringify(data));
}

// Clock class
let Clock = {
  //  Class Vars
  //            [minutes,seconds]
  taskInterval: [25,0],
  breakInterval: [5,0],
  taskTimeLeft: [0,0],
  breakTimeLeft: [0,0],
  skipBreak: false,
  state: "sleep",
  soundOn:true,
  // DOM elements
  // Buttons:
  startBtn: document.getElementById('start'),
  pauseResumeBtn: document.getElementById('pause'),
  stopBtn: document.getElementById('stop'),
  skipBreakBtn: document.getElementById('skip-break'),
  taskTimeString: document.getElementById("taskTimerDisplay"),
  breakTimeString: document.getElementById("breakTimerDisplay"),
  addTaskBtn: document.getElementById("addNewTask"),
  addToQueueBtn: document.getElementById("addToQueueBtn"),

  //creates the clock
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
    this.addTaskBtn.addEventListener("click", function() { addNewTask() });
    if (this.addToQueueBtn != null) {
      this.addToQueueBtn.addEventListener("click", function() { addToQueue() });
    }
    console.log("new state: "+ this.state);
  },
  //starts the clock
  startClock: function(){
    if (this.state === "task" || this.state === "break"){
      this.clockCountdown();
    }
    else {
      console.log("Cannot start clock from state "+this.state);
    }
  },

  //Timer HTML Updating
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
  makeTimerString: function(minutes, seconds){
    let timerString = String(minutes) + ":";
    if (seconds < 10){
      timerString += "0"
    }
    timerString += String(seconds);
    return timerString;
  },

  //Timer Object Functionality
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
      if (!TaskQueue.isEmpty()) {
        saveCompletedTask();
      }
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
      var taskTable = document.getElementById("TaskQueue");
      if (taskTable.rows[1] != undefined) {
        removeTaskFromTable();
        TaskQueue.dequeueTask();
      }
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
  playSound:function(filename){
    if(this.soundOn === true) {
      let audio = new Audio(filename);
      audio.play();
    };
  },
  restoreTimers: function(){
    var taskTable = document.getElementById("TaskQueue");
    if (taskTable.rows[1] != undefined && taskTable.rows[1].cells[3].textContent != "" && taskTable.rows[1].cells[4].textContent != "") {
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
    this.taskTimeString.innerHTML = this.taskInterval[0] + ":00";
    //this.taskTimeLeft[1] = this.taskInterval[1];
    this.breakTimeLeft[0] = this.breakInterval[0];
    this.breakTimeLeft[1] = 0;
    this.breakTimeString.innerHTML = this.breakInterval + ":00";
    //this.breakTimeLeft[1] = this.breakInterval[1];
  },

  //Button Function
  //each button responds differently according to the current state
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
      var taskTable = document.getElementById("TaskQueue");
      //If a task is in the task list, set proper timer value:
      if (taskTable != null && taskTable.rows[1] != undefined) {
        console.log("taskTable recognized");
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
      }
      this.startClock();
    }
    else {
      console.log("Cannot start from state " + this.state);
    };
  },
  handlePauseResumeClick:function() {
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
    }
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
  }
}


Clock.start();
