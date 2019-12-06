import * as congklak from '../src/index';

describe('start the game', () => {
  const initialState = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];

  beforeAll(() => {
    congklak.init();
  });

  test('user should get first turn as default', () => {
    expect(congklak.getTurn()).toEqual(congklak.PLAYER);
  });

  test('houses should reset', () => {
    expect(congklak.getState()).toEqual(initialState);
  });

  test('houses data is not editable', () => {
    const state = congklak.getState();
    state[0] = 10;

    expect(congklak.getState()).toEqual(initialState);
  });
});

describe('start game on second turn', () => {
  beforeAll(() => {
    congklak.init(false);
  });

  test('user should not get first turn', () => {
    expect(congklak.getTurn()).toEqual(congklak.AI);
  });
});

describe('play the game', () => {
  let stream;

  beforeAll(() => {
    congklak.init();
  });

  test('throw error when player pick enemy house or point', () => {
    for (let i = 7; i < 16; i += 1) {
      expect(() => congklak.play(i)).toThrow('Invalid move');
    }
  });

  test('turn should be PLAYER_MOVING', () => {
    stream = congklak.play(1);

    expect(congklak.getTurn()).toEqual(congklak.PLAYER_MOVING);
  });

  test('seed should move (1)', () => {
    expect(stream.next().value.state).toEqual([7, 0, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0]);
    expect(stream.next().value.state).toEqual([7, 0, 8, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0]);
    expect(stream.next().value.state).toEqual([7, 0, 8, 8, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0]);
    expect(stream.next().value.state).toEqual([7, 0, 8, 8, 8, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0]);
    expect(stream.next().value.state).toEqual([7, 0, 8, 8, 8, 8, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0]);
  });

  test("player can't move when stateStream value is not undefined", () => {
    expect(() => congklak.play(0)).toThrow("You can't move at this moment");
  });

  test('seed should move (2)', () => {
    expect(stream.next().value.state).toEqual([7, 0, 8, 8, 8, 8, 8, 0, 7, 7, 7, 7, 7, 7, 7, 0]);
    expect(stream.next().value.state).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 7, 7, 7, 7, 7, 7, 7, 0]);
    expect(stream.next().value.state).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 0, 7, 7, 7, 7, 7, 7, 0]);
    expect(stream.next().value.state).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 0, 8, 7, 7, 7, 7, 7, 0]);
    expect(stream.next().value.state).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 0, 8, 8, 7, 7, 7, 7, 0]);
    expect(stream.next().value.state).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 0, 8, 8, 8, 7, 7, 7, 0]);
    expect(stream.next().value.state).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 0, 8, 8, 8, 8, 7, 7, 0]);
    expect(stream.next().value.state).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 0, 8, 8, 8, 8, 8, 7, 0]);
    expect(stream.next().value.state).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 0, 8, 8, 8, 8, 8, 8, 0]);
    expect(stream.next().value.state).toEqual([8, 0, 8, 8, 8, 8, 8, 1, 0, 8, 8, 8, 8, 8, 8, 0]);
    expect(stream.next().value.state).toEqual([8, 1, 8, 8, 8, 8, 8, 1, 0, 8, 8, 8, 8, 8, 8, 0]);
    expect(stream.next().value.state).toEqual([8, 0, 8, 8, 8, 8, 8, 10, 0, 8, 8, 8, 8, 0, 8, 0]);
  });

  test('stateStream value should be undefined after player turn', () => {
    expect(stream.next().done).toEqual(true);
    expect(stream.next().value).toEqual(undefined);
  });

  test('turn should be AI', () => {
    expect(congklak.getTurn()).toEqual(congklak.AI);
  });

  test('AI should choose index 6', () => {
    stream = congklak.aiPlay();
    expect(stream.next().value.state).toEqual([8, 0, 8, 8, 8, 8, 8, 10, 0, 8, 0, 8, 8, 0, 8, 0]);
  });
});

describe('move the seeds from choosen index', () => {
  test('move from player point index', () => {
    const state = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    const expected = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];

    expect(congklak.moveUntilEnd(state, 7)).toEqual(expected);
  });

  test('move from enemy point index', () => {
    const state = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    const expected = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];

    expect(congklak.moveUntilEnd(state, 15)).toEqual(expected);
  });

  test('move ended in player point house', () => {
    const state = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    const expected = [0, 8, 8, 8, 8, 8, 8, 1, 7, 7, 7, 7, 7, 7, 7, 0];

    expect(congklak.moveUntilEnd(state, 0)).toEqual(expected);
  });

  test('move ended in player side but cannot take opposite house', () => {
    const state = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    const expected = [8, 8, 8, 0, 8, 8, 8, 10, 8, 8, 0, 0, 8, 8, 8, 0];

    expect(congklak.moveUntilEnd(state, 3)).toEqual(expected);
  });

  test('move ended in player side and take seeds from opposite house to point', () => {
    const state = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    const expected = [8, 8, 8, 8, 8, 0, 8, 10, 8, 0, 8, 8, 0, 8, 8, 0];

    expect(congklak.moveUntilEnd(state, 5)).toEqual(expected);
  });

  test('move ended in player point house', () => {
    const state = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    const expected = [8, 8, 8, 8, 8, 8, 0, 10, 0, 8, 8, 8, 8, 0, 8, 0];

    expect(congklak.moveUntilEnd(state, 6)).toEqual(expected);
  });
});

describe('check winner', () => {
  test('no winner', () => {
    const state = [8, 0, 8, 8, 8, 8, 8, 10, 0, 8, 8, 8, 8, 0, 8, 0];

    expect(congklak.checkWinner(state)).toEqual(-1);
  });

  test('player wins', () => {
    const state = [0, 0, 0, 0, 0, 0, 0, 55, 1, 7, 7, 7, 7, 7, 7, 0];

    expect(congklak.checkWinner(state)).toEqual(congklak.PLAYER_WIN);
  });

  test('AI wins', () => {
    const state = [1, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 55];

    expect(congklak.checkWinner(state)).toEqual(congklak.AI_WIN);
  });

  test('tie', () => {
    const state = [0, 0, 0, 0, 0, 0, 0, 49, 0, 0, 0, 0, 0, 0, 0, 49];

    expect(congklak.checkWinner(state)).toEqual(congklak.TIE);
  });
});
