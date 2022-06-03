"use strict";

var Logs = _interopRequireWildcard(require("../src/utils/logs"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Iyzipay = require('iyzipay');

var iyzipay = new Iyzipay({
  apiKey: "sandbox-afXhZPW0MQlE4dCUUlHcEopnMBgXnAZI",
  secretKey: "sandbox-wbwpzKIiplZxI3hh5ALI4FJyAcZKL6kq",
  uri: 'https://sandbox-api.iyzipay.com'
});
iyzipay.installmentInfo.retrieve({
  locale: Iyzipay.LOCALE.TR,
  conversationId: '123456789',
  binNumber: '554960',
  price: '100'
}, function (err, result) {
  console.log(result);
  Logs.logFile("2-installment", result);
});