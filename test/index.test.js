import * as congklak from '../src/index';

describe('init the game', () => {
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

describe('start game without first turn', () => {
  beforeAll(() => {
    congklak.init(false);
  });

  test('should not get first turn', () => {
    expect(congklak.getTurn()).toEqual(congklak.AI);
  });
});
