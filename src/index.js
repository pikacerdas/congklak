export const PLAYER = 0;
export const AI = 1;

const MAX_HOUSE = 16;
const SEED_PER_HOUSE = 7;
const PLAYER_POINT_INDEX = 7;
const AI_POINT_INDEX = 15;

let houses = [];
let turn = PLAYER;

const isPoint = index => index === PLAYER_POINT_INDEX || index === AI_POINT_INDEX;
const isValidIndex = index => index >= 0 && index <= MAX_HOUSE;


let boardState = init(true);
let currentPos = 0; // position still hardcode for test
let grabSeed = boardState[currentPos%16];
boardState[currentPos%16] = 0;

export const init = (firstTurn = true) => {
  houses = [];

  for (let i = 0; i < MAX_HOUSE; i += 1) {
    houses.push(isPoint(i) ? 0 : SEED_PER_HOUSE);
  }

  turn = firstTurn ? PLAYER : AI;
};


export const nextState = () => {
  boardState[(currentPos+1)%16] += 1;
  currentPos+=1;
  grabSeed-=1;
}

export const play = index => {
  if (!isValidIndex(index)) {
    throw new Error('Invalid house');
  }

  while(grabSeed!==0){
    getNextState();
    if (grabSeed===0 && boardState[currentPos%16]!==1){
      grabSeed = boardState[currentPos%16];
      boardState[currentPos%16] = 0;
    }
  }

};

export const getState = () => houses.slice();

export const getTurn = () => turn;
