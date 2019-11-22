"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const MAX_HOUSE = 16;
const PLAYER_POINT_INDEX = 7;
const ENEMY_POINT_INDEX = 15;
const ENEMY_OPPOSITE = [-1, -1, -1, -1, -1, -1, -1, -1, 6, 5, 4, 3, 2, 1, 0, -1];
const INF = 7 * 14;

const move = exports.move = (state, grabHouse) => {
  const currentState = state;
  let oneRound = false;

  if (currentState[grabHouse] === 0 || grabHouse === PLAYER_POINT_INDEX || grabHouse === ENEMY_POINT_INDEX) {
    return currentState;
  }


  let currentPos = grabHouse + 1;
  let grabSeed = currentState[grabHouse];
  currentState[grabHouse] = 0;

  while (grabSeed > 0) {

    if (currentPos === PLAYER_POINT_INDEX) {
      currentPos += 1;
      continue;
    }

    if (currentPos !== ENEMY_POINT_INDEX && grabSeed === 1 && currentState[currentPos] !== 0) {
      grabSeed += currentState[currentPos];
      currentState[currentPos] = 0;
    } else {
      currentState[currentPos] += 1;
      grabSeed -= 1;
    }
    currentPos = (currentPos + 1) % MAX_HOUSE;
    if (currentPos === grabHouse) {
      oneRound = true;
    }
  }

  if (oneRound && ENEMY_OPPOSITE[currentPos] !== -1) {
    if (currentState[ENEMY_OPPOSITE[currentPos]] !== 0) {
      currentState[ENEMY_POINT_INDEX] += currentState[ENEMY_OPPOSITE[currentPos]];
      currentState[ENEMY_OPPOSITE[currentPos]] = 0;
    }
  }

  if (ENEMY_OPPOSITE[currentPos] !== -1 && currentPos == PLAYER_POINT_INDEX){
    return currentState;
  }

  return currentState;
};

const bestMove = exports.bestMove = (state, depth) => {
  let holeIndex;
  let playerPoint = -INF;
  let enemyPoint = INF;
  for (let i = 0; i < PLAYER_POINT_INDEX; i += 1) {

    if (depth === 0) {
      const newState = move(state, i);
      if (newState[PLAYER_POINT_INDEX] > playerPoint) {
        holeIndex = i;
        playerPoint = newState[PLAYER_POINT_INDEX];
        enemyPoint = newState[ENEMY_POINT_INDEX];
      }
    } else {
      const nextState = move(state, i); // 8 index pertama taro di akhir
      const temp = bestMove(nextState, depth - 1); // swap EnemyPoint dan PlayerPoint
      if (temp.playerPoint > playerPoint) {
        holeIndex = i;
        playerPoint = temp.playerPoint;
        enemyPoint = temp.enemyPoint;
      }
    }
  }
  return { holeIndex, playerPoint, enemyPoint };
};
