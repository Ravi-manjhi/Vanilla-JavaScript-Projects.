'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalsBtnOpen = document.querySelectorAll('.show-modal');

const toggleModal = () => {
  modal.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
};

for (let i = 0; i < modalsBtnOpen.length; i++)
  modalsBtnOpen[i].addEventListener('click', toggleModal);

document.querySelector('.close-modal').addEventListener('click', toggleModal);
overlay.addEventListener('click', toggleModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!modal.classList.contains('hidden')) {
      toggleModal();
    }
  }
});
