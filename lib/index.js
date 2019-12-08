"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.checkWinner = checkWinner;
exports.moveUntilEnd = moveUntilEnd;
exports.aiPlay = aiPlay;
exports.play = play;
const PLAYER = exports.PLAYER = 0;
const PLAYER_MOVING = exports.PLAYER_MOVING = 1;
const PLAYER_WIN = exports.PLAYER_WIN = 4;
const AI = exports.AI = 2;
const AI_MOVING = exports.AI_MOVING = 3;
const AI_WIN = exports.AI_WIN = 5;
const TIE = exports.TIE = 6;

const MAX_HOUSE = 16;
const PLAYER_POINT_INDEX = 7;
const ENEMY_POINT_INDEX = 15;
const INF = 7 * 14;
const SEED_PER_HOUSE = 7;

let houses = [];
let turn = PLAYER;

const isPoint = index => index === PLAYER_POINT_INDEX || index === ENEMY_POINT_INDEX;

const isValidIndex = index => index >= 0 && index < PLAYER_POINT_INDEX && houses[index] > 0;

function swapState(state) {
  return [...state.slice(8, 16), ...state.slice(0, 8)];
}

function init(firstTurn = true) {
  houses = [];
  for (let i = 0; i < MAX_HOUSE; i += 1) {
    houses.push(isPoint(i) ? 0 : SEED_PER_HOUSE);
  }
  turn = firstTurn ? PLAYER : AI;
}

const getState = exports.getState = () => houses.slice();

const switchTurn = () => {
  turn = turn === PLAYER || turn === PLAYER_MOVING ? AI : PLAYER;
};

function checkWinner(currentState) {
  const allSeeds = (MAX_HOUSE - 2) * SEED_PER_HOUSE;
  const allSeedsExceptPoint = allSeeds - currentState[PLAYER_POINT_INDEX] - currentState[ENEMY_POINT_INDEX];
  if (Math.abs(currentState[PLAYER_POINT_INDEX] - currentState[ENEMY_POINT_INDEX]) > allSeedsExceptPoint) {
    if (currentState[PLAYER_POINT_INDEX] > currentState[ENEMY_POINT_INDEX]) {
      turn = PLAYER_WIN;
    } else {
      turn = AI_WIN;
    }
  }
  if (allSeedsExceptPoint === 0 && currentState[PLAYER_POINT_INDEX] === currentState[ENEMY_POINT_INDEX]) {
    turn = TIE;
  }
}

function* move(state, grabHouse, playerOne, realMove = false) {
  const conditionalSwapState = s => playerOne ? s.slice() : swapState(s);
  const conditionalGrabHouse = playerOne ? grabHouse : grabHouse - 8;
  const currentState = conditionalSwapState(state);
  let oneRound = false;

  let currentPos = conditionalGrabHouse + 1;
  let grabSeed = currentState[conditionalGrabHouse];
  currentState[conditionalGrabHouse] = 0;

  yield { state: conditionalSwapState(currentState), seed: grabSeed };

  while (grabSeed > 0) {
    if (currentPos === ENEMY_POINT_INDEX) {
      oneRound = true;
      currentPos = 0;
      continue;
    }

    if (currentPos !== PLAYER_POINT_INDEX && grabSeed === 1 && currentState[currentPos] !== 0) {
      grabSeed += currentState[currentPos];
      currentState[currentPos] = 0;
    } else {
      currentState[currentPos] += 1;
      grabSeed -= 1;
    }

    currentPos = (currentPos + 1) % MAX_HOUSE;
    yield { state: conditionalSwapState(currentState), seed: grabSeed };
  }

  currentPos -= 1;
  if (oneRound && currentPos < PLAYER_POINT_INDEX && currentState[currentPos] === 1) {
    currentState[PLAYER_POINT_INDEX] += currentState[14 - currentPos] + 1;
    currentState[14 - currentPos] = 0;
    currentState[currentPos] = 0;
  }

  if (realMove) {
    switchTurn();
    checkWinner(conditionalSwapState(currentState));
    houses = conditionalSwapState(currentState);
  }

  return { state: conditionalSwapState(currentState), seed: grabSeed };
}

function moveUntilEnd(state, grabHouse, playerOne) {
  const stateStream = move(state, grabHouse, playerOne);

  let result;
  for (let tmp = stateStream.next().value; tmp !== undefined; tmp = stateStream.next().value) {
    result = tmp;
  }

  return result.state;
}

function MIN(state, depth, { a, b }) {
  let holeIndex;
  let playerPoint = -INF;
  let enemyPoint = INF;
  let diff = INF;

  for (let i = PLAYER_POINT_INDEX + 1; i < ENEMY_POINT_INDEX; i += 1) {
    if (depth === 0) {
      const newState = moveUntilEnd(state, i, false);
      if (newState[PLAYER_POINT_INDEX] - newState[ENEMY_POINT_INDEX] < diff) {
        holeIndex = i;
        playerPoint = newState[PLAYER_POINT_INDEX];
        enemyPoint = newState[ENEMY_POINT_INDEX];
      }
    } else {
      const nextState = moveUntilEnd(state, i, false);
      const temp = MAX(nextState, depth - 1, diff, a, b);
      if (temp.playerPoint - temp.enemyPoint < diff) {
        holeIndex = i;
        playerPoint = temp.playerPoint;
        enemyPoint = temp.enemyPoint;
      }
    }
    diff = playerPoint - enemyPoint;
    if (diff <= a) return diff;
    b = Math.min(b, diff);
  }

  return { holeIndex, playerPoint, enemyPoint };
}

function MAX(state, depth, { a, b }) {
  let holeIndex;
  let playerPoint = -INF;
  let enemyPoint = INF;
  let diff = -INF;

  for (let i = PLAYER_POINT_INDEX + 1; i < ENEMY_POINT_INDEX; i += 1) {
    if (depth === 0) {
      const newState = moveUntilEnd(state, i, true);
      if (newState[PLAYER_POINT_INDEX] - newState[ENEMY_POINT_INDEX] > diff) {
        holeIndex = i;
        playerPoint = newState[PLAYER_POINT_INDEX];
        enemyPoint = newState[ENEMY_POINT_INDEX];
      }
    } else {
      const nextState = moveUntilEnd(state, i, true);
      const temp = MIN(nextState, depth - 1, diff, a, b);
      if (temp.playerPoint - temp.enemyPoint > diff) {
        holeIndex = i;
        playerPoint = temp.playerPoint;
        enemyPoint = temp.enemyPoint;
      }
    }
    diff = playerPoint - enemyPoint;
    if (diff >= b) return diff;
    a = Math.max(a, diff);
  }

  return { holeIndex, playerPoint, enemyPoint };
}

function aiPlay() {
  turn = AI_MOVING;

  const index = MIN(houses, 3, { a: -INF, b: INF }).holeIndex;
  return move(houses, index, false, true, true);
}

function play(index) {
  if (!isValidIndex(index)) {
    throw new Error('Invalid move');
  }

  if (turn !== PLAYER) {
    throw new Error("You can't move at this moment");
  }

  turn = PLAYER_MOVING;

  return move(houses, index, true, true, false);
}

const getTurn = exports.getTurn = () => turn;