import { move } from '../src/ai';

describe('move the seeds from choosen index', () => {
  test('move from player point index', () => {
    const state = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    const expected = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    expect(move(state, 7)).toEqual(expected);
  });

  test('move from enemy point index', () => {
    const state = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    const expected = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    expect(move(state, 15)).toEqual(expected);
  });

  test('move ended in player point house', () => {
    const state = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    const expected = [0, 8, 8, 8, 8, 8, 8, 1, 7, 7, 7, 7, 7, 7, 7, 0];
    expect(move(state, 0)).toEqual(expected);
  });

  test('move ended in player side but cannot take opposite house', () => {
    const state = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    const expected = [8, 8, 8, 0, 8, 8, 8, 10, 8, 8, 0, 0, 8, 8, 8, 0];

    expect(move(state, 3)).toEqual(expected);
  });

  test('move ended in player side and take seeds from opposite house to point', () => {
    const state = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    const expected = [8, 8, 8, 8, 8, 0, 8, 10, 8, 0, 8, 8, 0, 8, 8, 0];
    expect(move(state, 5)).toEqual(expected);
  });

  test('move ended in player point house', () => {
    const state = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
    const expected = [8, 8, 8, 8, 8, 8, 0, 10, 0, 8, 8, 8, 8, 0, 8, 0];
    expect(move(state, 6)).toEqual(expected);
  });
});
