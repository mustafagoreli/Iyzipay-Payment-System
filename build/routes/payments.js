"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _iyzipay = _interopRequireDefault(require("iyzipay"));

var _moment = _interopRequireDefault(require("moment"));

var _carts = _interopRequireDefault(require("../db/carts"));

var _users = _interopRequireDefault(require("../db/users"));

var _ApiError = _interopRequireDefault(require("../error/ApiError"));

var _Session = _interopRequireDefault(require("../middlewares/Session"));

var Payments = _interopRequireWildcard(require("../services/iyzico/methods/payments"));

var Cards = _interopRequireWildcard(require("../services/iyzico/methods/cards"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid"));

var _payments2 = require("../utils/payments");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = router => {
  //YENİ BİR KARTLA ÖDEME OLUŞTUR VE KARTI KAYDETME
  router.post("/payments/:cartId/with-new-card", _Session.default, async (req, res) => {
    const {
      card
    } = req.body;

    if (!card) {
      throw new _ApiError.default("Card is required", 400, "cardRequired");
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

    card.registerCard = "0";
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
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      paymentCard: card,
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
    let result = await Payments.createPayment(data);
    await (0, _payments2.CompletePayment)(result);
    res.json(result);
  }); //YENİ BİR KARTLA ÖDEME OLUŞTUR VE KARTI KAYDET

  router.post("/payments/:cartId/with-new-card/register-card", _Session.default, async (req, res) => {
    const {
      card
    } = req.body;

    if (!card) {
      throw new _ApiError.default("Card is required", 400, "cardRequired");
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

    if (req.user?.cardUserKey) {
      card.cardUserKey = req.user?.cardUserKey;
    }

    card.registerCard = "1";
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
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      paymentCard: card,
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
    let result = await Payments.createPayment(data);

    if (!req.user?.cardUserKey) {
      const user = await _users.default.findOne({
        _id: req.user?._id
      });
      user.cardUserKey = result?.cardUserKey;
      await user.save();
    }

    await (0, _payments2.CompletePayment)(result);
    res.json(result);
  }); //HALİ HAZIRDAKİ BİR KART İLE ÖDEME YAP - cardIndex

  router.post("/payments/:cartId/:cardIndex/with-registered-card-index", _Session.default, async (req, res) => {
    let {
      cardIndex
    } = req.params;

    if (!cardIndex) {
      throw new _ApiError.default("Card index is required", 400, "cardIndexRequired");
    }

    if (!req.user?.cardUserKey) {
      throw new _ApiError.default("No registered card available", 400, "cardUserKeyRequired");
    }

    const cards = await Cards.getUserCards({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey
    });
    const index = parseInt(cardIndex);

    if (index >= cards?.cardDetails?.length) {
      throw new _ApiError.default("Card doesnt exists", 400, "cartIndexInvalid");
    }

    const {
      cardToken
    } = cards?.cardDetails[index];

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
    const card = {
      cardToken,
      cardUserKey: req.user?.cardUserKey
    };
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installments: '1',
      basketId: String(cart?._id),
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      paymentCard: card,
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
    let result = await Payments.createPayment(data);
    await (0, _payments2.CompletePayment)(result);
    res.json(result);
  }); //HALİ HAZIRDAKİ BİR KART İLE ÖDEME YAP - cardToken

  router.post("/payments/:cartId/with-registered-card-token", _Session.default, async (req, res) => {
    let {
      cardToken
    } = req.body;

    if (!cardToken) {
      throw new _ApiError.default("Card token is required", 400, "cardTokenRequired");
    }

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
    const card = {
      cardToken,
      cardUserKey: req.user?.cardUserKey
    };
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installments: '1',
      basketId: String(cart?._id),
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      paymentCard: card,
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
    let result = await Payments.createPayment(data);
    await (0, _payments2.CompletePayment)(result);
    res.json(result);
  });
};

exports.default = _default;