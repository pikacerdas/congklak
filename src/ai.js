const MAX_HOUSE = 16;
const PLAYER_POINT_INDEX = 7;
const AI_POINT_INDEX = 15;
const OPPOSITE = [-1, -1, -1, -1, -1, -1, -1, -1, 6, 5, 4, 3, 2, 1, 0, -1];

export const aiMove = (state, grabHouse) => {
  if (state[grabHouse] == 0 || grabHouse == PLAYER_POINT_INDEX || grabHouse == AI_POINT_INDEX) {
    return state;
  }

  let oneRound = false;
  let currentPos = grabHouse + 1;
  let grabSeed = state[grabHouse];
  state[grabHouse] = 0;

  while (grabSeed > 0) {
    if (currentPos == PLAYER_POINT_INDEX) {
      currentPos += 1;
      continue;
    }

    if (currentPos != AI_POINT_INDEX && grabSeed == 1 && state[currentPos] != 0) {
      grabSeed += state[currentPos];
      state[currentPos] = 0;
    } else {
      state[currentPos] += 1;
      grabSeed -= 1;
    }
    currentPos = (currentPos + 1) % MAX_HOUSE;
    if (currentPos == grabHouse) {
      oneRound = true;
    }
  }

  if (oneRound && OPPOSITE[currentPos] != -1) {
    if (state[OPPOSITE[currentPos]] != 0) {
      state[AI_POINT_INDEX] += state[OPPOSITE[currentPos]];
      state[OPPOSITE[currentPos]] = 0;
    }
  }

  return state;
};
