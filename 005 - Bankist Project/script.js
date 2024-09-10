'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnOpenModals = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnOpenModals.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// smooth Effect
btnScroll.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// event propagation
navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Dom Traversing
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.btn');
  if (!clicked) return;

  tabContent.forEach(c => c.classList.remove('operations__content--active'));
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
  clicked.classList.add('operations__tab--active');
});

// Menu Fade Animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const img = link.closest('.nav').querySelector('img');

    sibling.forEach(el => {
      if (el !== link) el.style.opacity = this.opacity;
    });
    img.style.opacity = this.opacity;
  }
};

nav.addEventListener('mouseover', handleHover.bind({ opacity: 0.5 }));
nav.addEventListener('mouseout', handleHover.bind({ opacity: 1 }));

// Intersection Observer API
const height = nav.getBoundingClientRect().height;
const header = document.querySelector('.header');
const stickyNav = function (entries) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
  } else {
    nav.classList.add('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${height}px`,
});

headerObserver.observe(header);

// revealing Element on Scrolling
const allSection = document.querySelectorAll('.section');
const sectionCallback = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionCallback, {
  root: null,
  threshold: 0.15,
});

allSection.forEach(el => {
  sectionObserver.observe(el);
  el.classList.add('section--hidden');
});

// lazy Loading Image
const imgTarget = document.querySelectorAll('img[data-src]');
const imageCallback = function (entries, observer) {
  const [entry] = entries;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(imageCallback, {
  root: null,
  threshold: 0.1,
  rootMargin: '100px',
});

imgTarget.forEach(img => {
  imageObserver.observe(img);
});

// Building slider components
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDots = slide => {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const goToSlide = slide => {
  slides.forEach((el, i) => {
    el.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

const nextSlide = () => {
  if (currentSlide === slides.length - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDots(currentSlide);
};

const preSlide = () => {
  if (currentSlide === 0) {
    currentSlide = slides.length;
  }
  currentSlide--;
  goToSlide(currentSlide);
  activateDots(currentSlide);
};

let currentSlide = 0;
createDots();
goToSlide(0);
activateDots(currentSlide);
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', preSlide);
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowLeft' && preSlide();
});

dotContainer.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDots(slide);
  }
});
