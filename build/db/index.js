"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _users = _interopRequireDefault(require("./users"));

var _products = _interopRequireDefault(require("./products"));

var _carts = _interopRequireDefault(require("./carts"));

var _paymentSuccess = _interopRequireDefault(require("./payment-success"));

var _paymentFailed = _interopRequireDefault(require("./payment-failed"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = [_users.default, _products.default, _carts.default, _paymentSuccess.default, _paymentFailed.default];
exports.default = _default;