const refs = {  
  hours: document.querySelector('#hours'),
  mins: document.querySelector('#minutes'),
  secs: document.querySelector('#seconds'),
  timer: document.querySelector('#timer')  
}

class CountdownTimer {

  constructor({ selector, targetDate }) {
    this.selector = selector;
    this.targetDate = targetDate;

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
    refs.hours.textContent = hours;
    refs.mins.textContent = mins;
    refs.secs.textContent = secs;  
  } 

  pad(value) {
    return String(value).padStart(2, '0')
  }
}
  
const timer = new CountdownTimer({
    selector: '#timer',
    targetDate: new Date('Oct 11, 2021'),
});

timer.start();