import * as congklak from './src/index';

congklak.init();
let point = [];

while (congklak.getTurn() === congklak.PLAYER || congklak.getTurn() === congklak.AI) {
  let stream;

  if (congklak.getTurn() === congklak.PLAYER) {
    let move = 0;
    const state = congklak.getState();
    for (let i = 0; i < 7; i += 1) {
      if (state[i] > state[move]) move = i;
    }
    stream = congklak.play(move);
  } else {
    stream = congklak.aiPlay();
  }

  let tmp = stream.next().value;
  while (tmp) {
    console.log(tmp.state);
    tmp = stream.next().value;
    if (tmp) point = [tmp.state[7], tmp.state[15]];
  }
}

console.log('PLAYER POINT: ' + point[0]);
console.log('AI POINT: ' + point[1]);
