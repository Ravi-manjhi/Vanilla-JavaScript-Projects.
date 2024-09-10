"use strict";

// BANK LIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2023-01-01T21:31:17.178Z",
    "2023-01-05T07:42:02.383Z",
    "2023-01-10T09:15:04.904Z",
    "2023-01-16T10:17:24.185Z",
    "2023-01-18T14:11:59.604Z",
    "2023-01-19T17:01:17.194Z",
    "2023-01-20T23:36:17.929Z",
    "2023-01-22T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Ravi Manjhi",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2023-01-01T21:31:17.178Z",
    "2023-01-05T07:42:02.383Z",
    "2023-01-10T09:15:04.904Z",
    "2023-01-16T10:17:24.185Z",
    "2023-01-18T14:11:59.604Z",
    "2023-01-19T17:01:17.194Z",
    "2023-01-20T23:36:17.929Z",
    "2023-01-22T10:51:36.790Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
let currentUser,
  sorted = false,
  globalTime = 5 * 60,
  timer;

const loginClock = () => {
  const clock = () => {
    const date = new Date();
    labelDate.textContent = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  clock();
  setInterval(clock, 1000);
};

const startLogOutTimer = () => {
  let time = globalTime;
  const tick = () => {
    const min = `${Math.floor(time / 60)}`.padStart(2, 0);
    const sec = `${Math.floor(time % 60)}`.padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(logoutTimer);
      containerApp.classList.remove("hidden");
      labelWelcome.textContent = "Log in to get started";
    }

    time--;
  };
  tick();
  const logoutTimer = setInterval(tick, 1000);
  return logoutTimer;
};

const calcDaysPassed = (date1, date2, currentUser) => {
  const date = Math.floor(Math.abs((date1 - date2) / (1000 * 60 * 60 * 25)));
  if (date === 0) return "Today";
  else if (date === 1) return "Yesterday";
  else if (date <= 7) return `${date} Days ago`;
  else
    return date2.toLocaleString(currentUser.locale, {
      dateStyle: "short",
    });
};

const formatMov = (amount, currentUser) => {
  const option = {
    style: "currency",
    currency: currentUser.currency,
  };

  return new Intl.NumberFormat(currentUser.locale, option).format(amount);
};
const createUserName = (account) => {
  account.forEach((el) => {
    el.username = el.owner
      .toLowerCase()
      .split(" ")
      .map((el) => el[0])
      .join("");
  });
};

const movementLabel = (currentUser, sort) => {
  const { movements, movementsDates, locale, currency, owner } = currentUser;
  loginClock();
  containerMovements.innerHTML = "";
  containerApp.classList.add("hidden");
  labelWelcome.textContent = `Welcome Back, ${owner}`;

  const moves = sort ? movements.slice().sort((a, b) => a - b) : movements;

  moves.forEach((el, i) => {
    const type = el > 0 ? "deposit" : "withdrawal";

    const transDate = calcDaysPassed(
      Date.now(),
      new Date(movementsDates[i]),
      currentUser
    );

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type} </div>
        <div class="movements__date">${transDate}</div>
        <div class="movements__value">${formatMov(el, currentUser)}</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplaySummary = (currentUser) => {
  const incoming = currentUser.movements
    .filter((el) => el > 0)
    .reduce((a, b) => a + b, 0);
  let out = currentUser.movements
    .filter((el) => el < 0)
    .reduce((a, b) => a + b, 0);
  const totalAmount = currentUser.movements.reduce((acc, mov) => acc + mov, 0);

  const interest = currentUser.movements
    .filter((el) => el > 0)
    .map((el) => (el * currentUser.interestRate) / 100)
    .filter((el) => el >= 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${formatMov(totalAmount, currentUser)} ${
    currentUser.currency
  }`;

  labelSumIn.textContent = formatMov(incoming, currentUser);
  labelSumOut.textContent = formatMov(out, currentUser);
  labelSumInterest.textContent = formatMov(interest, currentUser);
};

const resetInputLabels = () => {
  inputLoginPin.value = "";
  inputLoginUsername.value = "";
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  inputLoanAmount.value = "";
  inputCloseUsername.value = "";
  inputClosePin.value = "";

  inputLoginPin.blur();
};

const UpdateUi = (currentUser) => {
  movementLabel(currentUser);
  calcDisplaySummary(currentUser);
};

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  createUserName(accounts);

  if (timer) clearInterval(timer);
  timer = startLogOutTimer();

  const userName = inputLoginUsername.value;
  const loginPin = +inputLoginPin.value;

  currentUser = accounts.find(
    (el) => el.username === userName && el.pin === loginPin
  );

  if (!currentUser) return alert("Username or Pin Not Correct");

  UpdateUi(currentUser);
  resetInputLabels();
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const transferTo = inputTransferTo.value;
  const transferAmount = +inputTransferAmount.value;

  const transferAcc = accounts.find((el) => el.username === transferTo);
  const totalAmount = currentUser.movements.reduce((a, b) => a + b, 0);

  if (
    transferAmount >= totalAmount ||
    totalAmount <= 0 ||
    !transferAcc ||
    currentUser?.username === transferTo
  ) {
    return alert("Transfer Failed!\nCheck Input Data");
  }

  currentUser.movements.push(-transferAmount);
  transferAcc.movements.push(transferAmount);
  currentUser.movementsDates.push(Date.now());
  transferAcc.movementsDates.push(Date.now());

  clearInterval(timer);
  timer = startLogOutTimer();

  UpdateUi(currentUser);
  resetInputLabels();
  console.log(currentUser.movementsDates);
  console.log(transferAcc.movementsDates);
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);

  if (
    loanAmount <= 0 ||
    !currentUser.movements.some((el) => el >= loanAmount * 0.1)
  ) {
    return alert("You are Not Eligible");
  }
  setTimeout(() => {
    clearInterval(timer);
    timer = startLogOutTimer();

    currentUser.movements.push(loanAmount);
    currentUser.movementsDates.push(Date.now());
    UpdateUi(currentUser);
  }, 2000);

  resetInputLabels();
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const pin = +inputClosePin.value;

  if (user !== currentUser.username || pin !== currentUser.pin) {
    return alert("Wrong Username Or Pin!");
  }

  const index = accounts.findIndex((el) => el.username === user);
  accounts.splice(index, 1);
  clearInterval(timer);
  containerApp.classList.remove("hidden");
});

btnSort.addEventListener("click", () => {
  sorted = !sorted;

  clearInterval(timer);
  timer = startLogOutTimer();

  movementLabel(currentUser, sorted);
});
