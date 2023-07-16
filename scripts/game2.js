const bets = [200, 600, 800, 1000, 1200, 1500];

let chosenBet = 200;
let attemptsLeft = 4;
let active = true;
let currentPath = 0;

const pathOrder = [...shuffle([0, 1, 2]), ...shuffle([3, 4])];
console.log(pathOrder);

setBlocks();
setLeftAttempts();

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

$(".hit-btn.left").click(async function () {
  upStick("left");

  if (!active) {
    return;
  }

  active = false;

  const path = paths[pathOrder[currentPath]];
  const moves = path.moves;

  let moveCount = 0;
  for (let move of moves) {
    $(".ball").css({
      transform: `translate(${move[0]}px, ${move[1]}px)`
    });

    await wait(300);

    if (moveCount == path.deleteTime) {
      path.blocks.forEach((blockIndex) =>
        $(".game_block").eq(blockIndex).addClass("empty")
      );
    }

    if (moveCount == moves.length - 1) {
      setNewBall();
    }

    moveCount++;
  }

  currentPath++;
});

$(".hit-btn.right").click(function () {
  upStick("right");
});

$(".layout_start").click(function () {
  $(".layout").addClass("hidden");
});

$(".modal").click(function () {
  window.location.href = "main.html";
});

function setBlocks() {
  const blockAmount = 24;
  const emptyBlockIndexes = [0, 3];

  for (let i = 0; i < blockAmount; i++) {
    const block = $(`<div class="game_block"></>`);

    if (emptyBlockIndexes.includes(i)) {
      block.addClass("empty");
    }

    $(".game_blocks").append(block);
  }
}

function setLeftAttempts() {
  $(".attempts").html("");

  for (let i = 0; i < attemptsLeft; i++) {
    $(".attempts").append(`<img src="../png/pinball.png" />`);
  }
}

function setNewBall() {
  $(".ball").remove();

  attemptsLeft--;
  setLeftAttempts();

  if (attemptsLeft === 0) {
    gameOver();
    return;
  }

  active = true;

  $(".game").append(`<img src="../png/pinball.png" class="ball"/>`);
}

function shuffle(arr) {
  let array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function changeBalance(amount) {
  localStorage.balance_g201 = +localStorage.balance_g201 + amount;
  $(".balance").html(localStorage.balance_g201);
}

function gameOver() {
  const cf = randInt(2, 4);
  const win = chosenBet * cf;

  $(".modal_result").html(win);
  changeBalance(win);

  $(".modal").removeClass("hidden");
}

async function upStick(stickSide) {
  const angle = stickSide == "left" ? "-30" : "30";

  $(".stick." + stickSide).css({
    transform: `rotate(${angle}deg)`
  });

  await wait(320);

  $(".stick." + stickSide).css({
    transform: `rotate(0deg)`
  });
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
