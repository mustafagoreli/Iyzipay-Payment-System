"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _ApiError = _interopRequireDefault(require("../error/ApiError"));

var _Session = _interopRequireDefault(require("../middlewares/Session"));

var CancelPayments = _interopRequireWildcard(require("../services/iyzico/methods/cancel-payment"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid"));

var _paymentSuccess = _interopRequireDefault(require("../db/payment-success"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  ObjectId
} = _mongoose.Types;
const reasonEnum = ["double_payment", "buyer_request", "fraud", "other"];

var _default = router => {
  //CANCEL PAYMENT
  router.post("/payments/:paymentSuccessId/cancel", _Session.default, async (req, res) => {
    const {
      reason,
      description
    } = req.body;
    const {
      paymentSuccessId
    } = req.params;
    const reasonObj = {};

    if (!paymentSuccessId) {
      throw new _ApiError.default("PaymentSuccessId is required", 400, "paymentSuccessIdRequired");
    }

    if (reason && description) {
      if (!reasonEnum.includes(reason)) {
        throw new _ApiError.default("Invalid cancel payment reason", 400, "invalidCancelPaymentReason");
      }

      reasonObj.reason = reason;
      reasonObj.description = description;
    }

    const payment = await _paymentSuccess.default.findOne({
      _id: ObjectId(paymentSuccessId)
    });
    const result = await CancelPayments.cancelPayment({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      paymentId: payment?.paymentId,
      ip: req.user?.ip,
      ...reasonObj
    });
    res.json(result);
  });
};

exports.default = _default;