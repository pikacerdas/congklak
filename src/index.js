export const PLAYER = 0;
export const AI = 1;

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

export const init = (firstTurn = true) => {
  houses = [];

  for (let i = 0; i < MAX_HOUSE; i += 1) {
    houses.push(isPoint(i) ? 0 : SEED_PER_HOUSE);
  }

  turn = firstTurn ? PLAYER : AI;
};

export const getState = () => houses.slice();

export const nextState = () => {
  if (grabSeed === 0) {
    return null;
  }

  houses[(currentPos + 1) % MAX_HOUSE] += 1;
  currentPos += 1;
  grabSeed -= 1;

  return getState();
};

export const play = index => {
  if (!isValidIndex(index)) {
    throw new Error('Invalid house');
  }

  currentPos = index;
  grabSeed = houses[currentPos];
  houses[currentPos] = 0;
};

export const getTurn = () => turn;
