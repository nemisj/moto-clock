const secondsNode = document.querySelector('.seconds');
const hoursNode = document.querySelector('.hours');
const minutesNode = document.querySelector('.minutes');
const container = document.querySelector('.container');
const mainText = document.querySelector('.main-text');
const secondaryText = document.querySelector('.secondary-text');

const finish = new Date(2019, 6, 12, 9, 00).getTime();
// const finish = new Date(2018, 6, 12, 9, 00).getTime();

const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;

const start = -90;
const end = 270;
const getDegree = (max, current) => {
  const domain = (end - start);
  return ((domain / max) * current) + start;
};

const setRotate = (node, degree, show) => {
  const value = node.style.transform;
  const m = value.match(/rotate\((-?\d*)deg\)/i);
  node.style.transform = `rotate(${degree}deg)`;
};

let enterMinutes = false;
let enterHours = false;
let belongsTo = 'seconds';

const createLines = () => {
  for(let i = 0; i < 60; i++) {
    const node = document.createElement('div');
    node.classList.add('line');
    const degree = getDegree(60, i);
    node.style.transform = `rotate(${degree}deg)`;
    container.appendChild(node);
    if (i % 5 === 0) {
      node.classList.add('houred');
    }
  }
};

const run = () => {
  requestAnimationFrame(() => {
    const now = new Date();
    const nowTime = now.getTime();
    let seconds, minutes, hours;

    if (nowTime > finish) {
      seconds = now.getSeconds();
      minutes = now.getMinutes();
      hours = now.getHours();
    } else {
      container.classList.add('reverse');
      const delta = finish - nowTime;
      const leftDays = Math.floor(delta / d);
      mainText.innerHTML = `${leftDays} days left`;
      const deltaHMS = delta - (leftDays * d);
      hours = Math.floor(deltaHMS / h);

      minutes = Math.floor((deltaHMS % h) / m);
      seconds = Math.floor((deltaHMS % m) / s)

      secondaryText.innerHTML = `${hours}:${minutes}:${seconds}`;
    }

    if (hours > 12) {
      hours = hours - 12;
    }

    const secondsDeg = getDegree(60, seconds);
    const minutesDeg = getDegree(60, minutes);
    const hoursDeg = getDegree(12, hours);

    if (secondsDeg === minutesDeg) {
      if (!enterMinutes) {
        enterMinutes = true;
      }
    } else {
      if (enterMinutes) {
        enterMinutes = false;
        console.log('crossing minutes');
        if (belongsTo === 'seconds') {
          belongsTo = 'minutes';
          minutesNode.classList.add('leader');
          secondsNode.classList.remove('leader');
        } else if (belongsTo === 'minutes') {
          belongsTo = 'seconds';
          minutesNode.classList.remove('leader');
          secondsNode.classList.add('leader');
        }
      }
    }

    if (secondsDeg === hoursDeg) {
      if (!enterHours) {
        enterHours = true;
      }
    } else {
      if (enterHours) {
        enterHours = false;
        console.log('crossing hours');
        if (belongsTo === 'seconds') {
          belongsTo = 'hours';
          hoursNode.classList.add('leader');
          secondsNode.classList.remove('leader');
        } else if (belongsTo === 'hours') {
          belongsTo = 'seconds';
          hoursNode.classList.remove('leader');
          secondsNode.classList.add('leader');
        }
      }
    }

    setRotate(secondsNode, secondsDeg, true);
    setRotate(minutesNode, minutesDeg);
    setRotate(hoursNode, hoursDeg);
    run();
  });
};

createLines();
run();
