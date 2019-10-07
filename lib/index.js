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

const isPoint = index => index === PLAYER_POINT_INDEX || index === AI_POINT_INDEX;
const isValidIndex = index => index >= 0 && index <= MAX_HOUSE;

const init = exports.init = (firstTurn = true) => {
  houses = [];

  for (let i = 0; i < MAX_HOUSE; i += 1) {
    houses.push(isPoint(i) ? 0 : SEED_PER_HOUSE);
  }

  turn = firstTurn ? PLAYER : AI;
};

const play = exports.play = index => {
  if (!isValidIndex(index)) {
    throw new Error('Invalid house');
  }
};

const getState = exports.getState = () => houses.slice();

const getTurn = exports.getTurn = () => turn;