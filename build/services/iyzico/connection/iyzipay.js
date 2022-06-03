"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _iyzipay = _interopRequireDefault(require("iyzipay"));

var _config = _interopRequireDefault(require("../config/config.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const iyzipay = new _iyzipay.default(_config.default);
var _default = iyzipay;
exports.default = _default;