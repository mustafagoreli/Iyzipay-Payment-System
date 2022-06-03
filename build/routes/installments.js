"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _moment = _interopRequireDefault(require("moment"));

var _Session = _interopRequireDefault(require("../middlewares/Session"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid"));

var Installments = _interopRequireWildcard(require("../services/iyzico/methods/installments"));

var _ApiError = _interopRequireDefault(require("../error/ApiError"));

var _carts = _interopRequireDefault(require("../db/carts"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  ObjectId
} = _mongoose.Types;

var _default = router => {
  //Fiyata göre Taksit Kontrolü
  router.post("/installments", _Session.default, async (req, res) => {
    const {
      binNumber,
      price
    } = req.body;

    if (!binNumber || !price) {
      throw new _ApiError.default("Missing Parameters", 400, "missingParameters");
    }

    const result = await Installments.checkInstallment({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      binNumber: binNumber,
      price: price
    });
    res.json(result);
  }); //Sepetin Fiyatına Göre Taksit Modülü

  router.post("/Installments/:cartId", _Session.default, async (req, res) => {
    const {
      binNumber
    } = req.body;
    const {
      cartId
    } = req.params;

    if (!cartId) {
      throw new _ApiError.default("cart id is required", 400, "cartRequired");
    }

    const cart = await _carts.default.findOne({
      _id: ObjectId(cartId)
    }).populate("products", {
      _id: 1,
      price: 1
    });
    const price = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);

    if (!binNumber || !price) {
      throw new _ApiError.default("Missing parameters", 400, "missingParameters");
    }

    const result = await Installments.checkInstallment({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      binNumber: binNumber,
      price: price
    });
    res.json(cart);
  });
};

exports.default = _default;