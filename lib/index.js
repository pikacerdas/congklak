'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const PLAYER = exports.PLAYER = 0;
const AI = exports.AI = 1;

const MAX_HOUSE = 16;
const SEED_PER_HOUSE = 7;
const PLAYER_POINT_INDEX = 7;
const AI_POINT_INDEX = 15;

let houses = [];
let turn = PLAYER;
let currentPos = 0;
let grabSeed = 0;

const isPoint = index => index === PLAYER_POINT_INDEX || index === AI_POINT_INDEX;
const isValidIndex = index => index >= 0 && index <= MAX_HOUSE;

const init = exports.init = (firstTurn = true) => {
  houses = [];

  for (let i = 0; i < MAX_HOUSE; i += 1) {
    houses.push(isPoint(i) ? 0 : SEED_PER_HOUSE);
  }

  turn = firstTurn ? PLAYER : AI;
};

const nextState = exports.nextState = () => {
  if (grabSeed === 0) {
    return null;
  }

  houses[(currentPos + 1) % MAX_HOUSE] += 1;
  currentPos += 1;
  grabSeed -= 1;

  return getState();
};

const play = exports.play = index => {
  if (!isValidIndex(index)) {
    throw new Error('Invalid house');
  }

  currentPos = index;
  grabSeed = houses[currentPos];
  houses[currentPos] = 0;
};

const getState = exports.getState = () => houses.slice();

const getTurn = exports.getTurn = () => turn;