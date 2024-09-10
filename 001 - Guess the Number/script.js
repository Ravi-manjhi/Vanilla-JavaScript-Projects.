'use strict';
let score = 10;
let highScore = 0;
let secreteNumber;

const message = document.querySelector('.message');
const scoreTag = document.querySelector('.score');
const highScoreTag = document.querySelector('.highScore');
const numberTag = document.querySelector('.number');
const body = document.getElementsByTagName('body')[0];

const randomNumber = () => {
  return Math.floor(Math.random() * 100) + 1;
};

document.querySelector('.check').addEventListener('click', () => {
  const guessNumber = document.querySelector('.guess').value * 1;

  console.log(secreteNumber);
  if (score < 1) {
    message.textContent = '💥 You Lose the Game...';
    body.style.backgroundColor = '#CF0A0A';
  } else {
    if (!guessNumber) {
      message.textContent = '⛔ No Number...';
    } else if (guessNumber === secreteNumber) {
      message.textContent = 'Correct Number...';
      body.style.backgroundColor = '#60b347';
      numberTag.style.width = '30rem';
      scoreTag.textContent = score;
      numberTag.textContent = secreteNumber;

      if (score > highScore) {
        highScore = score;
      }
      highScoreTag.textContent = highScore;
    } else {
      message.textContent =
        guessNumber < secreteNumber ? ' 👇 Too Low...' : '⚡ Too High...';
      score--;
      scoreTag.textContent = score;
    }
  }
});

document.querySelector('.again').addEventListener('click', () => {
  score = 10;
  secreteNumber = randomNumber();
  numberTag.textContent = '?';
  scoreTag.textContent = score;
  numberTag.style.width = '15rem';
  body.style.backgroundColor = '#222';
  message.textContent = 'Start guessing...';
  document.querySelector('.guess').value = ' ';
});

secreteNumber = randomNumber();
