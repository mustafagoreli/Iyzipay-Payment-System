"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _iyzipay = _interopRequireDefault(require("iyzipay"));

var _carts = _interopRequireDefault(require("../db/carts"));

var _users = _interopRequireDefault(require("../db/users"));

var _ApiError = _interopRequireDefault(require("../error/ApiError"));

var _Session = _interopRequireDefault(require("../middlewares/Session"));

var Checkout = _interopRequireWildcard(require("../services/iyzico/methods/checkouts"));

var Cards = _interopRequireWildcard(require("../services/iyzico/methods/cards"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid"));

var _payments = require("../utils/payments");

var _express = require("express");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = router => {
  // CHECKOUT FORM COMPLETE PAYMENT
  router.post("/checkout/complete/payment", async (req, res) => {
    let result = await Checkout.getFromPayment({
      locale: "tr",
      conversationId: (0, _nanoid.default)(),
      token: req.body.token
    });
    await (0, _payments.CompletePayment)(result);
    res.json(result);
  }); //CHECKOUT FORM INITIALİZE

  router.post("/checkout/:cartId", _Session.default, async (req, res) => {
    if (!req.user?.cardUserKey) {
      throw new _ApiError.default("No registered card available", 400, "cardUserKeyRequired");
    }

    if (!req.params?.cartId) {
      throw new _ApiError.default("Cart id is required", 400, "cartIdRequired");
    }

    const cart = await _carts.default.findOne({
      _id: req.params?.cartId
    }).populate("buyer").populate("products");

    if (!cart) {
      throw new _ApiError.default("Cart not found", 404, "cartNotFound");
    }

    if (cart?.completed) {
      throw new _ApiError.default("Cart is completed", 400, "cartCompleted");
    }

    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installments: '1',
      basketId: String(cart?._id),
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      enabledInstallments: [1, 2, 3, 4, 6, 9],
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/checkout/complete/payment`,
      ...(req.user?.cardUserKey && {
        cardUserKey: req.user?.cardUserKey
      }),
      buyer: {
        id: String(req.user._id),
        name: req.user?.name,
        surname: req.user?.surname,
        gsmNumber: req.user?.phoneNumber,
        email: req.user?.email,
        identityNumber: req.user?.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user?.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationDate: (0, _moment.default)(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationAddress: req.user?.address,
        ip: req.user?.ip,
        city: req.user?.city,
        country: req.user?.country,
        zipCode: req.user?.zipCode
      },
      shippingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      billingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      basketItems: cart.products.map((product, index) => {
        return {
          id: String(product?._id),
          name: product?.name,
          category1: product.categories[0],
          category2: product.categories[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product?.itemType],
          price: product?.price
        };
      })
    };
    let result = await Checkout.initialize(data);
    const html = `<!DOCTYPE html>
<html>
<head>
<title>Ödeme yap</title>
<meta charset="UTF-8" />
${result?.checkoutFormContent}
</head>
</html>`;
    res.send(html);
    /*
    let result = await PaymentsThreeDS.initializePayments(data);
    const html = Buffer.from(result?.threeDSHtmlContent, "base64").toString();
    res.send(html);
    */
  });
};

exports.default = _default;