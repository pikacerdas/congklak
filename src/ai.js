const MAX_HOUSE = 16;
const PLAYER_POINT_INDEX = 7;

export const aiMove = (state, grabHouse) => {
  if (state[grabHouse] == 0) {
    return state;
  }

  let grabSeed = state[grabHouse];
  let currentPos = grabHouse + 1;

  while (grabSeed > 0) {
    if (currentPos == PLAYER_POINT_INDEX) {
      currentPos += 1;
      continue;
    }

    if (grabSeed == 1 && state[currentPos] != 0) {
      grabSeed += state[currentPos];
      state[currentPos] = 0;
    } else {
      state[currentPos] += 1;
      grabSeed -= 1;
    }
    currentPos = (currentPos + 1) % MAX_HOUSE;
  }

  return state;
};

export const getMove = () => 11;
