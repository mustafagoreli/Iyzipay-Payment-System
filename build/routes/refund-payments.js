"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApiError = _interopRequireDefault(require("../error/ApiError"));

var _Session = _interopRequireDefault(require("../middlewares/Session"));

var RefundPayments = _interopRequireWildcard(require("../services/iyzico/methods/refund-payments"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid"));

var _paymentSuccess = _interopRequireDefault(require("../db/payment-success"));

var _iyzipay = _interopRequireDefault(require("iyzipay"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reasonEnum = ["double_payment", "buyer_request", "fraud", "other"];

var _default = router => {
  router.post("/payments/:paymentTransactionId/refund", _Session.default, async (req, res) => {
    const {
      paymentTransactionId
    } = req.params;
    const reasonObj = {};
    const {
      reason,
      description
    } = req.body;

    if (!paymentTransactionId) {
      throw new _ApiError.default("PaymentTransactionId is required", 400, "paymentTransactionIdRequired");
    }

    if (reason && description) {
      if (!reasonEnum.includes(reason)) {
        throw new _ApiError.default("Invalid cancel payment reason", 400, "invalidCancelPaymentReason");
      }

      reasonObj.reason = reason;
      reasonObj.description = description;
    }

    const payment = await _paymentSuccess.default.findOne({
      "itemTransactions.paymentTransactionId": paymentTransactionId
    });
    const currentItemTransaction = payment.log.itemTransactions.find((itemTransactions, index) => {
      return itemTransactions.paymentTransactionId === paymentTransactionId;
    });
    const result = await RefundPayments.refundPayments({
      locale: req.user?.locale,
      conversationId: (0, _nanoid.default)(),
      paymentTransactionId: currentItemTransaction?.paymentTransactionId,
      price: req.body?.refundPrice || currentItemTransaction?.paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      ip: req.user?.ip,
      ...reasonObj
    });
    res.json(result);
  });
};

exports.default = _default;