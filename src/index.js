export const PLAYER = 0;
export const PLAYER_MOVING = 1;
export const PLAYER_WIN = 4;
export const AI = 2;
export const AI_MOVING = 3;
export const AI_WIN = 5;
export const TIE = 6;

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

export function init(firstTurn = true) {
  houses = [];
  for (let i = 0; i < MAX_HOUSE; i += 1) {
    houses.push(isPoint(i) ? 0 : SEED_PER_HOUSE);
  }
  turn = firstTurn ? PLAYER : AI;
}

export const getState = () => houses.slice();

const playerCanPlay = state => state.slice(0, 7).some(i => !!i);

const aiCanPlay = state => state.slice(8, 15).some(i => !!i);

const switchTurn = () => {
  turn = turn === PLAYER || turn === PLAYER_MOVING ? AI : PLAYER;
  if (!playerCanPlay(houses)) turn = AI;
  if (!aiCanPlay(houses)) turn = PLAYER;
};

export function checkWinner(currentState) {
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
  const conditionalSwapState = s => (playerOne ? s.slice() : swapState(s));
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

  let playAgain = false;
  if (currentPos === PLAYER_POINT_INDEX) {
    playAgain = true;
  }

  if (realMove) {
    houses = conditionalSwapState(currentState);
    switchTurn();
    if (playAgain) switchTurn();
    checkWinner(conditionalSwapState(currentState));
  }

  return { state: conditionalSwapState(currentState), seed: grabSeed, playAgain };
}

export function moveUntilEnd(state, grabHouse, playerOne) {
  const stateStream = move(state, grabHouse, playerOne);

  let result;
  for (let tmp = stateStream.next().value; tmp !== undefined; tmp = stateStream.next().value) {
    result = tmp;
  }

  return result;
}

function MIN(state, depth, a, b) {
  let holeIndex;
  let playerPoint = -INF;
  let enemyPoint = INF;
  let diff = INF;

  for (let i = PLAYER_POINT_INDEX + 1; i < ENEMY_POINT_INDEX; i += 1) {
    if (state[i] === 0) continue;
    if (holeIndex === undefined) holeIndex = i;
    if (depth === 0 || !playerCanPlay(state)) {
      const tmp = moveUntilEnd(state.slice(), i, false);
      const newState = tmp.state;
      if (newState[PLAYER_POINT_INDEX] - newState[ENEMY_POINT_INDEX] < diff) {
        holeIndex = i;
        playerPoint = newState[PLAYER_POINT_INDEX];
        enemyPoint = newState[ENEMY_POINT_INDEX];
      }
    } else {
      const nextAiMove = moveUntilEnd(state.slice(), i, false);
      const nextState = nextAiMove.state;
      const { playAgain } = nextAiMove;
      const temp = playAgain ? MIN(nextState, depth - 1, a, b) : MAX(nextState, depth - 1, a, b);
      if (temp.playerPoint - temp.enemyPoint < diff) {
        holeIndex = i;
        playerPoint = temp.playerPoint;
        enemyPoint = temp.enemyPoint;
      }
    }
    diff = playerPoint - enemyPoint;
    if (diff <= a) return { holeIndex, playerPoint, enemyPoint };
    b = Math.min(b, diff);
  }

  return { holeIndex, playerPoint, enemyPoint };
}

function MAX(state, depth, a, b) {
  let holeIndex;
  let playerPoint = -INF;
  let enemyPoint = INF;
  let diff = -INF;

  for (let i = PLAYER_POINT_INDEX + 1; i < ENEMY_POINT_INDEX; i += 1) {
    if (state[i] === 0) continue;
    if (holeIndex === undefined) holeIndex = i;
    if (depth === 0 || !aiCanPlay(state)) {
      const tmp = moveUntilEnd(state.slice(), i, true);
      const newState = tmp.state;
      if (newState[PLAYER_POINT_INDEX] - newState[ENEMY_POINT_INDEX] > diff) {
        holeIndex = i;
        playerPoint = newState[PLAYER_POINT_INDEX];
        enemyPoint = newState[ENEMY_POINT_INDEX];
      }
    } else {
      const nextPlayerMove = moveUntilEnd(state.slice(), i, true);
      const nextState = nextPlayerMove.state;
      const { playAgain } = nextPlayerMove;
      const temp = playAgain ? MAX(nextState, depth - 1, a, b) : MIN(nextState, depth - 1, a, b);
      if (temp.playerPoint - temp.enemyPoint > diff) {
        holeIndex = i;
        playerPoint = temp.playerPoint;
        enemyPoint = temp.enemyPoint;
      }
    }
    diff = playerPoint - enemyPoint;
    if (diff >= b) return { holeIndex, playerPoint, enemyPoint };
    a = Math.max(a, diff);
  }

  return { holeIndex, playerPoint, enemyPoint };
}

export function aiPlay() {
  turn = AI_MOVING;

  const index = MIN(houses.slice(), 3, -INF, INF).holeIndex;
  return move(houses.slice(), index, false, true, true);
}

export function play(index) {
  if (!isValidIndex(index)) {
    throw new Error('Invalid move');
  }

  if (turn !== PLAYER) {
    throw new Error("You can't move at this moment");
  }

  turn = PLAYER_MOVING;

  return move(houses.slice(), index, true, true, false);
}

export const getTurn = () => turn;
