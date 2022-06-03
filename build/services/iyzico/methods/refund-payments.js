"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refundPayments = void 0;

var _iyzipay = _interopRequireDefault(require("../connection/iyzipay"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const refundPayments = data => {
  return new Promise((resolve, reject) => {
    _iyzipay.default.refund.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.refundPayments = refundPayments;