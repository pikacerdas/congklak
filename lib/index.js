"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.moveUntilEnd = moveUntilEnd;
exports.aiPlay = aiPlay;
exports.play = play;
const PLAYER = exports.PLAYER = 0;
const PLAYER_MOVING = exports.PLAYER_MOVING = 1;
const AI = exports.AI = 2;
const AI_MOVING = exports.AI_MOVING = 3;

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
function* move(state, grabHouse, realMove = false, swap = false) {
  const currentState = state.slice();
  let oneRound = false;

  let currentPos = grabHouse + 1;
  let grabSeed = currentState[grabHouse];
  currentState[grabHouse] = 0;

  yield currentState;

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
    yield currentState;
  }

  currentPos -= 1;
  if (oneRound && currentPos < PLAYER_POINT_INDEX && currentState[currentPos] === 1) {
    currentState[PLAYER_POINT_INDEX] += currentState[14 - currentPos] + 1;
    currentState[14 - currentPos] = 0;
    currentState[currentPos] = 0;
  }

  if (realMove) {
    switchTurn();
    houses = swap ? swapState(currentState) : currentState;
  }

  return currentState;
}

function moveUntilEnd(state, grabHouse) {
  const stateStream = move(state, grabHouse);

  let result;
  for (let tmp = stateStream.next().value; tmp !== undefined; tmp = stateStream.next().value) {
    result = tmp;
  }

  return result;
}

function bestMove(state, depth) {
  let holeIndex;
  let playerPoint = -INF;
  let enemyPoint = INF;
  let diff = -INF;

  for (let i = 0; i < PLAYER_POINT_INDEX; i += 1) {
    if (depth === 0) {
      const newState = moveUntilEnd(state, i);
      if (newState[PLAYER_POINT_INDEX] - newState[ENEMY_POINT_INDEX] > diff) {
        holeIndex = i;
        playerPoint = newState[PLAYER_POINT_INDEX];
        enemyPoint = newState[ENEMY_POINT_INDEX];
      }
    } else {
      const nextState = swapState(moveUntilEnd(state, i));
      const temp = bestMove(nextState, depth - 1);
      if (temp.enemyPoint - temp.playerPoint > diff) {
        holeIndex = i;
        playerPoint = temp.enemyPoint;
        enemyPoint = temp.playerPoint;
      }
    }
    diff = playerPoint - enemyPoint;
  }

  return { holeIndex, playerPoint, enemyPoint };
}

function* aiPlay() {
  turn = AI_MOVING;

  const swappedState = swapState(houses);
  const index = bestMove(swappedState, 3).holeIndex;
  const stateStream = move(swappedState, index, true, true);
  for (let tmp = stateStream.next().value; tmp !== undefined; tmp = stateStream.next().value) {
    yield swapState(tmp);
  }
}

function play(index) {
  if (!isValidIndex(index)) {
    throw new Error('Invalid move');
  }

  if (turn !== PLAYER) {
    throw new Error("You can't move at this moment");
  }

  turn = PLAYER_MOVING;

  return move(houses, index, true, false);
}

const getTurn = exports.getTurn = () => turn;