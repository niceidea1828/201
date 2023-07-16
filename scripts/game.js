const paths = [
  {
    coords: [
      [0, 50],
      [-30, 120],
      [0, 180],
      [50, 250],
      [30, 320],
      [30, 350]
    ],
    cf: 1
  },

  {
    coords: [
      [0, 50],
      [40, 120],
      [70, 180],
      [10, 250],
      [-20, 310],
      [-20, 350]
    ],
    cf: 2
  },

  {
    coords: [
      [0, 40],
      [-25, 100],
      [-50, 170],
      [-20, 240],
      [-60, 300],
      [-70, 350]
    ],
    cf: 3
  },

  {
    coords: [
      [0, 40],
      [40, 120],
      [65, 190],
      [95, 260],
      [115, 310],
      [120, 350]
    ],
    cf: 4
  }
];

const bets = [200, 600, 800, 1000, 1200, 1500];

let active = false;
let level = 1;
let chosenBet = 200;

$(".balance").html(localStorage.balance_g201);

bets.forEach((bet, i) => {
  const betElem = $(`
  <div class="bet b-btn ${i === 0 ? "act" : ""}">
  <img src="../png/coin.png" alt="" />
  <div class="value">${bet}</div>
  </div>
  `);

  betElem.click(function () {
    $(".bet").removeClass("act");
    $(this).addClass("act");

    chosenBet = bet;
  });

  $(".bet_cont").append(betElem);
});

$(".modal_choice").click(function () {
  $(".modal_choice").removeClass("act");
  $(this).addClass("act");

  level = $(this).index(".modal_choice") + 1;
});

$(".complex").click(function () {
  $(".modal").removeClass("hidden");
});

$(".modal_ok").click(function () {
  $(".modal").addClass("hidden");

  active = true;
  $(".field").attr("src", `../png/f${level}.png`);
});

$(".play").click(function () {
  if (!active) {
    return;
  }

  active = false;
  changeBalance(-500);

  const pathInd = randInt(0, paths.length - 1);

  let step = 0;
  const stepAmount = paths[pathInd].coords.length;

  let gameInt = setInterval(() => {
    if (
      step >= stepAmount ||
      (level < 3 && step == 4) ||
      (level == 3 && step == 5)
    ) {
      clearInterval(gameInt);

      setTimeout(() => {
        gameOver(500 * paths[pathInd].cf);
      }, 1000);

      return;
    }

    const coord = paths[pathInd].coords[step];
    console.log(coord);

    $(".ball").css({
      transform: `translate(${coord[0]}px, ${coord[1]}px)`
    });

    step++;
  }, 400);
});

window.onload = () => {
  $(".wrapper").removeClass("hidden");
};

function changeBalance(amount) {
  localStorage.balance_g201 = +localStorage.balance_g201 + amount;
  $(".balance").html(localStorage.balance_g201);
}

function gameOver(win) {
  if (win) {
    changeBalance(win);
  }

  $(".ball").css({
    transform: `translate(0, 0)`
  });

  active = true;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
