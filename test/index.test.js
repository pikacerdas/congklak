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
  beforeAll(() => {
    congklak.init();
  });

  test('throw error when player pick enemy house or point', () => {
    for (let i = 7; i < 16; i += 1) {
      expect(() => congklak.play(i)).toThrow('Invalid move');
    }
  });

  test('turn should be PLAYER_MOVING', () => {
    congklak.play(1);

    expect(congklak.getTurn()).toEqual(congklak.PLAYER_MOVING);
  });

  test('seed should move (1)', () => {
    expect(congklak.nextState()).toEqual([7, 0, 8, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0]);
    expect(congklak.nextState()).toEqual([7, 0, 8, 8, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0]);
    expect(congklak.nextState()).toEqual([7, 0, 8, 8, 8, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0]);
    expect(congklak.nextState()).toEqual([7, 0, 8, 8, 8, 8, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0]);
  });

  test("player can't move when nextState is not null", () => {
    expect(() => congklak.play(0)).toThrow("You can't move at this moment");
  });

  test('seed should move (2)', () => {
    expect(congklak.nextState()).toEqual([7, 0, 8, 8, 8, 8, 8, 0, 7, 7, 7, 7, 7, 7, 7, 0]);
    expect(congklak.nextState()).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 7, 7, 7, 7, 7, 7, 7, 0]);
    expect(congklak.nextState()).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 8, 7, 7, 7, 7, 7, 7, 0]);
  });

  test('nextState should return null after player turn', () => {
    expect(congklak.nextState()).toEqual(null);
  });

  test('turn should be AI_MOVING', () => {
    expect(congklak.getTurn()).toEqual(congklak.AI_MOVING);
  });

  test('[TEMPORARY] AI pick index 11', () => {
    expect(congklak.nextState()).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 8, 7, 7, 0, 8, 7, 7, 0]);
    expect(congklak.nextState()).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 8, 7, 7, 0, 8, 8, 7, 0]);
    expect(congklak.nextState()).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 8, 7, 7, 0, 8, 8, 8, 0]);
    expect(congklak.nextState()).toEqual([7, 0, 8, 8, 8, 8, 8, 1, 8, 7, 7, 0, 8, 8, 8, 1]);
    expect(congklak.nextState()).toEqual([8, 0, 8, 8, 8, 8, 8, 1, 8, 7, 7, 0, 8, 8, 8, 1]);
    expect(congklak.nextState()).toEqual([8, 1, 8, 8, 8, 8, 8, 1, 8, 7, 7, 0, 8, 8, 8, 1]);
    expect(congklak.nextState()).toEqual([8, 1, 9, 8, 8, 8, 8, 1, 8, 7, 7, 0, 8, 8, 8, 1]);
    expect(congklak.nextState()).toEqual(null);
  });
});
