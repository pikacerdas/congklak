export const PLAYER = 0;
export const AI = 1;

const MAX_HOUSE = 16;
const SEED_PER_HOUSE = 7;
const PLAYER_POINT_INDEX = 7;
const AI_POINT_INDEX = 15;

let houses = [];
let turn = PLAYER;

let stateGrab = 0;

const isPoint = index => index === PLAYER_POINT_INDEX || index === AI_POINT_INDEX;
const isValidIndex = index => index >= 0 && index <= MAX_HOUSE;

export const init = (firstTurn = true) => {
  houses = [];

  for (let i = 0; i < MAX_HOUSE; i += 1) {
    houses.push(isPoint(i) ? 0 : SEED_PER_HOUSE);
  }

  turn = firstTurn ? PLAYER : AI;
};

export const play = index => {
  if (!isValidIndex(index)) {
    throw new Error('Invalid house');
  }
};

export const getState = () => houses.slice();

export const getTurn = () => turn;

export const nextStep = () => {

  houses[count+1]+=1;
	stateGrab -= 1;
  count +=1;
  
}

export const test_loop = () => {

  while (stateGrab !== 0){
	
    console.log(stateGrab)
    
    if (stateGrab === 1 && houses[(count+houses[count])%16] === 0){
      
      break;
    }
    
    else if (stateGrab === 1 && houses[(count+houses[count])%16] !== 0){
      
      stateGrab+=houses[(count+houses[count])%16];
      console.log(stateGrab)
    }
    
    else{
      
      nextStep();
      console.log(houses);
    }
  }

}