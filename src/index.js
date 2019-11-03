import aiMove from './ai';

export const PLAYER = 0;
export const PLAYER_MOVING = 1;
export const AI = 2;
export const AI_MOVING = 3;

const MAX_HOUSE = 16;
const SEED_PER_HOUSE = 7;
const PLAYER_POINT_INDEX = 7;
const AI_POINT_INDEX = 15;

let houses = [];
let turn = PLAYER;
let currentPos = 0;
let grabSeed = 0;

const isPoint = index => index === PLAYER_POINT_INDEX || index === AI_POINT_INDEX;
const isValidIndex = index => index >= 0 && index < PLAYER_POINT_INDEX;

export const init = (firstTurn = true) => {
  houses = [];

  for (let i = 0; i < MAX_HOUSE; i += 1) {
    houses.push(isPoint(i) ? 0 : SEED_PER_HOUSE);
  }

  turn = firstTurn ? PLAYER : AI;
};

export const getState = () => houses.slice();

const switchTurn = () => {
  turn = turn === PLAYER || turn === PLAYER_MOVING ? AI : PLAYER;
};

const grab = index => {
  currentPos = index;
  grabSeed = houses[currentPos];
  houses[currentPos] = 0;
};

const aiPlay = () => {
  turn = AI_MOVING;
  return 12;
};

export const nextState = () => {
  if (turn === PLAYER) {
    return null;
  }

  if (turn === AI) {
    aiPlay();
    return null;
  }

  houses[(currentPos + 1) % MAX_HOUSE] += 1;
  currentPos += 1;
  grabSeed -= 1;

  if (grabSeed === 0) {
    switchTurn();
  }

  return getState();
};

export const play = index => {
  if (!isValidIndex(index)) {
    throw new Error('Invalid move');
  }

  if (turn !== PLAYER) {
    throw new Error("You can't move at this moment");
  }

  turn = PLAYER_MOVING;

  grab(index);
};

export const getTurn = () => turn;
