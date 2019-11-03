'use strict';

var _ai = require('./ai');

var _ai2 = _interopRequireDefault(_ai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const initialState = [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];

console.log((0, _ai2.default)(initialState, 10));