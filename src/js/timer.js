const refs = {  
  hours: document.querySelector('#hours'),
  mins: document.querySelector('#minutes'),
  secs: document.querySelector('#seconds'),
  timer: document.querySelector('#timer')  
}

const refsSecond = {
  hours: document.querySelector('#hoursSecond'),
  mins: document.querySelector('#minutesSecond'),
  secs: document.querySelector('#secondsSecond'),
  timer: document.querySelector('#timerSecond')
}

class CountdownTimer {

  constructor({ selector, targetDate, refs }) {
    this.selector = selector;
    this.targetDate = targetDate;
    this.refs = refs;

    this.intervalId = null;
  }

  start() {
    const startTime = this.targetDate.getTime()

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = startTime - currentTime;
           
      if (deltaTime <= 0) {
        this.stop()
      }
      this.updateClock(deltaTime);
    }, 1000)
  }

  stop() {
    clearInterval(this.intervalId);
    this.setTextContent('', '', '', '');
  }

  updateClock(time) {       
    const hours = this.pad(Math.floor((time % (1000 * 60 * 60 * 24 * 24)) / (1000 * 60 * 60)));
    const mins = this.pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = this.pad(Math.floor((time % (1000 * 60)) / 1000));
    this.setTextContent( hours, mins, secs)
  }

  setTextContent(hours, mins, secs) {        
    this.refs.hours.textContent = hours;
    this.refs.mins.textContent = mins;
    this.refs.secs.textContent = secs;  
  } 

  pad(value) {
    return String(value).padStart(2, '0')
  }
}
  
const timer = new CountdownTimer({
  selector: refs.timer,
  targetDate: new Date('Oct 11, 2021'),
  refs: refs
});

const timerSecond = new CountdownTimer({
  selector: refsSecond.timer,
  targetDate: new Date('Oct 17, 2021'),
  refs: refsSecond
})

if (refs.hours) { timer.start(); timerSecond.start()};
