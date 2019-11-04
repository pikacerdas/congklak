const MAX_HOUSE = 16;
const PLAYER_POINT_INDEX = 7;
const ENEMY_POINT_INDEX = 15;
const ENEMY_OPPOSITE = [-1, -1, -1, -1, -1, -1, -1, -1, 6, 5, 4, 3, 2, 1, 0, -1];
const INF = 7 * 14;

export const move = (state, grabHouse) => {
  const currentState = state;
  let oneRound = false;

  if (currentState[grabHouse] === 0 || grabHouse === PLAYER_POINT_INDEX || grabHouse === ENEMY_POINT_INDEX) {
    return currentState;
  }

  let currentPos = grabHouse + 1;
  let grabSeed = currentState[grabHouse];
  currentState[grabHouse] = 0;

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
  }

  currentPos -= 1;
  if (oneRound && currentPos < PLAYER_POINT_INDEX && currentState[currentPos] === 1) {
    currentState[PLAYER_POINT_INDEX] += currentState[14 - currentPos] + 1;
    currentState[14 - currentPos] = 0;
    currentState[currentPos] = 0;
  }

  return currentState;
};

export const bestMove = (state, depth) => {
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
    }
  }
  return { holeIndex, playerPoint, enemyPoint };
};
