"use strict";

var _iyzipay = _interopRequireDefault(require("iyzipay"));

var Cards = _interopRequireWildcard(require("./methods/cards"));

var _nanoid = _interopRequireDefault(require("../../utils/nanoid"));

var Logs = _interopRequireWildcard(require("../../utils/logs"));

var Installments = _interopRequireWildcard(require("./methods/installments"));

var Payments = _interopRequireWildcard(require("./methods/payments"));

var PaymentsThreeDS = _interopRequireWildcard(require("./methods/threeds-payment"));

var Checkouts = _interopRequireWildcard(require("./methods/checkouts"));

var CancelPayments = _interopRequireWildcard(require("./methods/cancel-payment"));

var _iyzipay2 = _interopRequireDefault(require("./connection/iyzipay"));

var RefundPayments = _interopRequireWildcard(require("./methods/refund-payments"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*--------------------------------------*/

/* a) CARDS  */

/*--------------------------------------*/
//Bir kullanıcı ve kart olustur
const createUserAndCards = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    email: "email@email.com",
    externalId: (0, _nanoid.default)(),
    card: {
      cardAlias: "Kredi Kartım",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030"
    }
  }).then(result => {
    console.log(result);
    Logs.logFile("1-cards-kullanici-ve-kart-olustur", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("1-cards-kullanici-ve-kart-olustur-hata", err);
  });
}; //createUserAndCards();
//kullanıcı için kart tanımla


const createAcardForAUser = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    email: "email@email.com",
    externalId: (0, _nanoid.default)(),
    cardUserKey: "9rvjsI8vILFr3zzbKltmaAGvPvw=",
    card: {
      cardAlias: "Kredi Kartım",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030"
    }
  }).then(result => {
    console.log(result);
    Logs.logFile("2-bir-kullanıcıya-kart-ekle", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("2-bir-kullanıcıya-kart-ekle-hata", err);
  });
}; //createAcardForAUser();
//bir kullanıcı için kartlarını oku


const readCardsOfAUser = () => {
  Cards.getUserCards({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    cardUserKey: "9rvjsI8vILFr3zzbKltmaAGvPvw="
  }).then(result => {
    console.log(result);
    Logs.logFile("3-cards-bir-kullanıcı-icin-kart-oku", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("3-cards-bir-kullanıcı-icin-kart-oku-hata", err);
  });
}; //readCardsOfAUser();
//bir kullanıcnın bir kartını sil


const deleteCardsOfAUser = () => {
  Cards.deleteUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    cardUserKey: "9rvjsI8vILFr3zzbKltmaAGvPvw=",
    cardToken: "QlOwGF7hGREbfMz3HVyPMZSedSs="
  }).then(result => {
    console.log(result);
    Logs.logFile("4-bir-kullanıcının-kartını-sil", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("4-bir-kullanıcının-kartını-sil-hata", err);
  });
}; //deleteCardsOfAUser();
//readCardsOfAUser();

/*--------------------------------------*/

/* b) INSTALLMENTS  */

/*--------------------------------------*/
// bir kart ve ücret ile gerceklesebilecek taksitlerin kontrolü


const checkInstallments = () => {
  return Installments.checkInstallment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    binNumber: "552879",
    price: "1000"
  }).then(result => {
    console.log(result);
    Logs.logFile("5-bir-kart-ile-ücret-taksit-kontrolu", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("5-bir-kart-ile-ücret-taksit-kontrolu-hata", err);
  });
}; //checkInstallments();

/*--------------------------------------*/

/* c) NORMAL PAYMENTS  */

/*--------------------------------------*/
// Kayıtlı olmayan kartla ödeme yapmak ve kartı kaydetmek


const createPayment = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installments: "1",
    basketId: "867JDL",
    paymentChannell: _iyzipay.default.PAYMENT_CHANNEL.MOBILE_WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "0"
    },
    buyer: {
      id: 'BY789',

      /* Kullanıcının üst sistemdeki ID numarası */
      name: 'John',

      /* Kullanıcının adı */
      surname: 'Doe',

      /* Kullanıcın soyadı */
      gsmNumber: '+905350000000',

      /* Kullanıcının telefon numarası */
      email: 'email@email.com',

      /* Kullanıcının e-posta adresi */
      identityNumber: '00000000000',

      /* Kullanıcının kimlik numarası / eğer yoksa 11 tane 0 girilebilir */
      lastLoginDate: '2015-10-05 12:43:35',

      /* En son giriş tarihi */
      registrationDate: '2013-04-21 15:12:09',

      /* Kayıt tarihi */
      registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Kullanıcının kayıt adresi */
      ip: '85.34.78.112',

      /* Kullanıcının IP adresi */
      city: 'Istanbul',

      /* Kullanıcının şehri */
      country: 'Turkey',

      /* Kullanıcının ülkesi */
      zipCode: '34732'
      /* Kullanıcının posta kodu */

    },
    shippingAddress: {
      contactName: 'Jane Doe',

      /* Teslimat için Kullanıcının Adı */
      city: 'Istanbul',

      /* Teslimat için Kullanıcının Şehri */
      country: 'Turkey',

      /* Teslimat için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Teslimat için Kullanıcının Şehri */
      zipCode: '34742'
      /* Teslimat için Kullanıcının Posta Kodu */

    },
    billingAddress: {
      contactName: 'Jane Doe',

      /* Fatura için Kullanıcının Adı */
      city: 'Istanbul',

      /* Fatura için Kullanıcının Şehri */
      country: 'Turkey',

      /* Fatura için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Fatura için Kullanıcının Adresi */
      zipCode: '34742'
      /* Fatura için Kullanıcının Posta Kodu */

    },
    basketItems: [{
      id: 'BI101',

      /* Sepet ürününün ID'si */
      name: 'Binocular',

      /* Sepet ürününün adı */
      category1: 'Collectibles',

      /* Sepet ürününün ilk kategorisi */
      category2: 'Accessories',

      /* Sepet ürününün ikinci kategorisi */
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,

      /* Sepet ürününün tipi */
      price: 90
      /* Sepet ürününün toplam fiyattaki kırılımı */

    }, {
      id: 'BI102',
      name: 'Game code',
      category1: 'Game',
      category2: 'Online Game Items',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.VIRTUAL,
      price: 150
    }, {
      id: 'BI103',
      name: 'Usb',
      category1: 'Electronics',
      category2: 'Usb / Cable',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("6-payments-yeni-bir-kartla-odeme-alma-ve-kartı-kaydetme", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("6-payments-yeni-bir-kartla-odeme-alma-ve-kartı-kaydetme-hata", err);
  });
}; //createPayment();


const createPaymentAndSaveCard = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installments: "1",
    basketId: "867JDL",
    paymentChannell: _iyzipay.default.PAYMENT_CHANNEL.MOBILE_WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardUserKey: "9rvjsI8vILFr3zzbKltmaAGvPvw=",
      cardAlias: "Kredi Kartım ödemeden sonra",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "1"
    },
    buyer: {
      id: 'BY789',

      /* Kullanıcının üst sistemdeki ID numarası */
      name: 'John',

      /* Kullanıcının adı */
      surname: 'Doe',

      /* Kullanıcın soyadı */
      gsmNumber: '+905350000000',

      /* Kullanıcının telefon numarası */
      email: 'email@email.com',

      /* Kullanıcının e-posta adresi */
      identityNumber: '00000000000',

      /* Kullanıcının kimlik numarası / eğer yoksa 11 tane 0 girilebilir */
      lastLoginDate: '2015-10-05 12:43:35',

      /* En son giriş tarihi */
      registrationDate: '2013-04-21 15:12:09',

      /* Kayıt tarihi */
      registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Kullanıcının kayıt adresi */
      ip: '85.34.78.112',

      /* Kullanıcının IP adresi */
      city: 'Istanbul',

      /* Kullanıcının şehri */
      country: 'Turkey',

      /* Kullanıcının ülkesi */
      zipCode: '34732'
      /* Kullanıcının posta kodu */

    },
    shippingAddress: {
      contactName: 'Jane Doe',

      /* Teslimat için Kullanıcının Adı */
      city: 'Istanbul',

      /* Teslimat için Kullanıcının Şehri */
      country: 'Turkey',

      /* Teslimat için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Teslimat için Kullanıcının Şehri */
      zipCode: '34742'
      /* Teslimat için Kullanıcının Posta Kodu */

    },
    billingAddress: {
      contactName: 'Jane Doe',

      /* Fatura için Kullanıcının Adı */
      city: 'Istanbul',

      /* Fatura için Kullanıcının Şehri */
      country: 'Turkey',

      /* Fatura için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Fatura için Kullanıcının Adresi */
      zipCode: '34742'
      /* Fatura için Kullanıcının Posta Kodu */

    },
    basketItems: [{
      id: 'BI101',

      /* Sepet ürününün ID'si */
      name: 'Binocular',

      /* Sepet ürününün adı */
      category1: 'Collectibles',

      /* Sepet ürününün ilk kategorisi */
      category2: 'Accessories',

      /* Sepet ürününün ikinci kategorisi */
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,

      /* Sepet ürününün tipi */
      price: 90
      /* Sepet ürününün toplam fiyattaki kırılımı */

    }, {
      id: 'BI102',
      name: 'Game code',
      category1: 'Game',
      category2: 'Online Game Items',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.VIRTUAL,
      price: 150
    }, {
      id: 'BI103',
      name: 'Usb',
      category1: 'Electronics',
      category2: 'Usb / Cable',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("7-payments-yeni-bir-kartla-odeme-alma-ve-kartı-kaydet", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("7-payments-yeni-bir-kartla-odeme-alma-ve-kartı-kaydet-hata", err);
  });
}; //createPaymentAndSaveCard();
//readCardsOfAUser();
//Bir kayıtlı kart ile ödeme yap


const createPaymentWithSavedCard = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installments: "1",
    basketId: "867JDL",
    paymentChannell: _iyzipay.default.PAYMENT_CHANNEL.MOBILE_WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardUserKey: "9rvjsI8vILFr3zzbKltmaAGvPvw=",
      cardToken: "wiiSkbUEc/n01EZp6V/fNTLyCuQ="
    },
    buyer: {
      id: 'BY789',

      /* Kullanıcının üst sistemdeki ID numarası */
      name: 'John',

      /* Kullanıcının adı */
      surname: 'Doe',

      /* Kullanıcın soyadı */
      gsmNumber: '+905350000000',

      /* Kullanıcının telefon numarası */
      email: 'email@email.com',

      /* Kullanıcının e-posta adresi */
      identityNumber: '00000000000',

      /* Kullanıcının kimlik numarası / eğer yoksa 11 tane 0 girilebilir */
      lastLoginDate: '2015-10-05 12:43:35',

      /* En son giriş tarihi */
      registrationDate: '2013-04-21 15:12:09',

      /* Kayıt tarihi */
      registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Kullanıcının kayıt adresi */
      ip: '85.34.78.112',

      /* Kullanıcının IP adresi */
      city: 'Istanbul',

      /* Kullanıcının şehri */
      country: 'Turkey',

      /* Kullanıcının ülkesi */
      zipCode: '34732'
      /* Kullanıcının posta kodu */

    },
    shippingAddress: {
      contactName: 'Jane Doe',

      /* Teslimat için Kullanıcının Adı */
      city: 'Istanbul',

      /* Teslimat için Kullanıcının Şehri */
      country: 'Turkey',

      /* Teslimat için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Teslimat için Kullanıcının Şehri */
      zipCode: '34742'
      /* Teslimat için Kullanıcının Posta Kodu */

    },
    billingAddress: {
      contactName: 'Jane Doe',

      /* Fatura için Kullanıcının Adı */
      city: 'Istanbul',

      /* Fatura için Kullanıcının Şehri */
      country: 'Turkey',

      /* Fatura için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Fatura için Kullanıcının Adresi */
      zipCode: '34742'
      /* Fatura için Kullanıcının Posta Kodu */

    },
    basketItems: [{
      id: 'BI101',

      /* Sepet ürününün ID'si */
      name: 'Binocular',

      /* Sepet ürününün adı */
      category1: 'Collectibles',

      /* Sepet ürününün ilk kategorisi */
      category2: 'Accessories',

      /* Sepet ürününün ikinci kategorisi */
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,

      /* Sepet ürününün tipi */
      price: 90
      /* Sepet ürününün toplam fiyattaki kırılımı */

    }, {
      id: 'BI102',
      name: 'Game code',
      category1: 'Game',
      category2: 'Online Game Items',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.VIRTUAL,
      price: 150
    }, {
      id: 'BI103',
      name: 'Usb',
      category1: 'Electronics',
      category2: 'Usb / Cable',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("8-payments-kayıtlı-bir-kartla-odeme-alma-ve-kartı-kaydet", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("8-payments-kayıtlı-bir-kartla-odeme-alma-ve-kartı-kaydet-hata", err);
  });
}; //createPaymentWithSavedCard();

/*--------------------------------------*/

/* d) 3D Secure Payments  */

/*--------------------------------------*/


const initializeThreeDSPayments = () => {
  PaymentsThreeDS.initializePayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installments: "1",
    basketId: "867JDL",
    paymentChannell: _iyzipay.default.PAYMENT_CHANNEL.MOBILE_WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "0"
    },
    buyer: {
      id: 'BY789',

      /* Kullanıcının üst sistemdeki ID numarası */
      name: 'John',

      /* Kullanıcının adı */
      surname: 'Doe',

      /* Kullanıcın soyadı */
      gsmNumber: '+905350000000',

      /* Kullanıcının telefon numarası */
      email: 'email@email.com',

      /* Kullanıcının e-posta adresi */
      identityNumber: '00000000000',

      /* Kullanıcının kimlik numarası / eğer yoksa 11 tane 0 girilebilir */
      lastLoginDate: '2015-10-05 12:43:35',

      /* En son giriş tarihi */
      registrationDate: '2013-04-21 15:12:09',

      /* Kayıt tarihi */
      registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Kullanıcının kayıt adresi */
      ip: '85.34.78.112',

      /* Kullanıcının IP adresi */
      city: 'Istanbul',

      /* Kullanıcının şehri */
      country: 'Turkey',

      /* Kullanıcının ülkesi */
      zipCode: '34732'
      /* Kullanıcının posta kodu */

    },
    shippingAddress: {
      contactName: 'Jane Doe',

      /* Teslimat için Kullanıcının Adı */
      city: 'Istanbul',

      /* Teslimat için Kullanıcının Şehri */
      country: 'Turkey',

      /* Teslimat için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Teslimat için Kullanıcının Şehri */
      zipCode: '34742'
      /* Teslimat için Kullanıcının Posta Kodu */

    },
    billingAddress: {
      contactName: 'Jane Doe',

      /* Fatura için Kullanıcının Adı */
      city: 'Istanbul',

      /* Fatura için Kullanıcının Şehri */
      country: 'Turkey',

      /* Fatura için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Fatura için Kullanıcının Adresi */
      zipCode: '34742'
      /* Fatura için Kullanıcının Posta Kodu */

    },
    basketItems: [{
      id: 'BI101',

      /* Sepet ürününün ID'si */
      name: 'Binocular',

      /* Sepet ürününün adı */
      category1: 'Collectibles',

      /* Sepet ürününün ilk kategorisi */
      category2: 'Accessories',

      /* Sepet ürününün ikinci kategorisi */
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,

      /* Sepet ürününün tipi */
      price: 90
      /* Sepet ürününün toplam fiyattaki kırılımı */

    }, {
      id: 'BI102',
      name: 'Game code',
      category1: 'Game',
      category2: 'Online Game Items',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.VIRTUAL,
      price: 150
    }, {
      id: 'BI103',
      name: 'Usb',
      category1: 'Electronics',
      category2: 'Usb / Cable',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("9-threeds-payments-yeni-bir-kartla-odeme-yapma", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("9-threeds-payments-yeni-bir-kartla-odeme-yapma-hata", err);
  });
}; //initializeThreeDSPayments();
//complete payments in threeds


const completeThreeDSPayment = () => {
  PaymentsThreeDS.completePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "17719949",
    conversationData: "conversation data"
  }).then(result => {
    console.log(result);
    Logs.logFile("10-threeds-odeme-tamamla", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("10-threeds-odeme-tamamla-hata", err);
  });
}; //completeThreeDSPayment();
//threeds ödemesini hali hazırdaki kayıtlı olan kartla gerçekleştir


const initializeThreeDSPaymentswithRegisteredCard = () => {
  PaymentsThreeDS.initializePayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installments: "1",
    basketId: "867JDL",
    paymentChannell: _iyzipay.default.PAYMENT_CHANNEL.MOBILE_WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "9rvjsI8vILFr3zzbKltmaAGvPvw=",
      cardToken: "wiiSkbUEc/n01EZp6V/fNTLyCuQ="
    },
    buyer: {
      id: 'BY789',

      /* Kullanıcının üst sistemdeki ID numarası */
      name: 'John',

      /* Kullanıcının adı */
      surname: 'Doe',

      /* Kullanıcın soyadı */
      gsmNumber: '+905350000000',

      /* Kullanıcının telefon numarası */
      email: 'email@email.com',

      /* Kullanıcının e-posta adresi */
      identityNumber: '00000000000',

      /* Kullanıcının kimlik numarası / eğer yoksa 11 tane 0 girilebilir */
      lastLoginDate: '2015-10-05 12:43:35',

      /* En son giriş tarihi */
      registrationDate: '2013-04-21 15:12:09',

      /* Kayıt tarihi */
      registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Kullanıcının kayıt adresi */
      ip: '85.34.78.112',

      /* Kullanıcının IP adresi */
      city: 'Istanbul',

      /* Kullanıcının şehri */
      country: 'Turkey',

      /* Kullanıcının ülkesi */
      zipCode: '34732'
      /* Kullanıcının posta kodu */

    },
    shippingAddress: {
      contactName: 'Jane Doe',

      /* Teslimat için Kullanıcının Adı */
      city: 'Istanbul',

      /* Teslimat için Kullanıcının Şehri */
      country: 'Turkey',

      /* Teslimat için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Teslimat için Kullanıcının Şehri */
      zipCode: '34742'
      /* Teslimat için Kullanıcının Posta Kodu */

    },
    billingAddress: {
      contactName: 'Jane Doe',

      /* Fatura için Kullanıcının Adı */
      city: 'Istanbul',

      /* Fatura için Kullanıcının Şehri */
      country: 'Turkey',

      /* Fatura için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Fatura için Kullanıcının Adresi */
      zipCode: '34742'
      /* Fatura için Kullanıcının Posta Kodu */

    },
    basketItems: [{
      id: 'BI101',

      /* Sepet ürününün ID'si */
      name: 'Binocular',

      /* Sepet ürününün adı */
      category1: 'Collectibles',

      /* Sepet ürününün ilk kategorisi */
      category2: 'Accessories',

      /* Sepet ürününün ikinci kategorisi */
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,

      /* Sepet ürününün tipi */
      price: 90
      /* Sepet ürününün toplam fiyattaki kırılımı */

    }, {
      id: 'BI102',
      name: 'Game code',
      category1: 'Game',
      category2: 'Online Game Items',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.VIRTUAL,
      price: 150
    }, {
      id: 'BI103',
      name: 'Usb',
      category1: 'Electronics',
      category2: 'Usb / Cable',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("11-threeds-payments-kayıtlı-bir-kartla-odeme-yapma", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("9-threeds-payments-kayıtlı-bir-kartla-odeme-yapma-hata", err);
  });
}; //initializeThreeDSPaymentswithRegisteredCard();


const initializeThreeDSPaymentswithNewCardAndRegister = () => {
  PaymentsThreeDS.initializePayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installments: "1",
    basketId: "867JDL",
    paymentChannell: _iyzipay.default.PAYMENT_CHANNEL.MOBILE_WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "9rvjsI8vILFr3zzbKltmaAGvPvw=",
      cardAlias: "Kredi Kartım ödemeden sonra",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "1"
    },
    buyer: {
      id: 'BY789',

      /* Kullanıcının üst sistemdeki ID numarası */
      name: 'John',

      /* Kullanıcının adı */
      surname: 'Doe',

      /* Kullanıcın soyadı */
      gsmNumber: '+905350000000',

      /* Kullanıcının telefon numarası */
      email: 'email@email.com',

      /* Kullanıcının e-posta adresi */
      identityNumber: '00000000000',

      /* Kullanıcının kimlik numarası / eğer yoksa 11 tane 0 girilebilir */
      lastLoginDate: '2015-10-05 12:43:35',

      /* En son giriş tarihi */
      registrationDate: '2013-04-21 15:12:09',

      /* Kayıt tarihi */
      registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Kullanıcının kayıt adresi */
      ip: '85.34.78.112',

      /* Kullanıcının IP adresi */
      city: 'Istanbul',

      /* Kullanıcının şehri */
      country: 'Turkey',

      /* Kullanıcının ülkesi */
      zipCode: '34732'
      /* Kullanıcının posta kodu */

    },
    shippingAddress: {
      contactName: 'Jane Doe',

      /* Teslimat için Kullanıcının Adı */
      city: 'Istanbul',

      /* Teslimat için Kullanıcının Şehri */
      country: 'Turkey',

      /* Teslimat için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Teslimat için Kullanıcının Şehri */
      zipCode: '34742'
      /* Teslimat için Kullanıcının Posta Kodu */

    },
    billingAddress: {
      contactName: 'Jane Doe',

      /* Fatura için Kullanıcının Adı */
      city: 'Istanbul',

      /* Fatura için Kullanıcının Şehri */
      country: 'Turkey',

      /* Fatura için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Fatura için Kullanıcının Adresi */
      zipCode: '34742'
      /* Fatura için Kullanıcının Posta Kodu */

    },
    basketItems: [{
      id: 'BI101',

      /* Sepet ürününün ID'si */
      name: 'Binocular',

      /* Sepet ürününün adı */
      category1: 'Collectibles',

      /* Sepet ürününün ilk kategorisi */
      category2: 'Accessories',

      /* Sepet ürününün ikinci kategorisi */
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,

      /* Sepet ürününün tipi */
      price: 90
      /* Sepet ürününün toplam fiyattaki kırılımı */

    }, {
      id: 'BI102',
      name: 'Game code',
      category1: 'Game',
      category2: 'Online Game Items',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.VIRTUAL,
      price: 150
    }, {
      id: 'BI103',
      name: 'Usb',
      category1: 'Electronics',
      category2: 'Usb / Cable',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("12-threeds-payments-kayıtlı-bir-kartla-odeme-yapma", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("12-threeds-payments-kayıtlı-bir-kartla-odeme-yapma-hata", err);
  });
}; //initializeThreeDSPaymentswithNewCardAndRegister();
//readCardsOfAUser();

/*--------------------------------------*/

/* e) Checkout Form  */

/*--------------------------------------*/


const initializeCheckoutForm = () => {
  Checkouts.initialize({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installments: "1",
    basketId: "867JDL",
    paymentChannell: _iyzipay.default.PAYMENT_CHANNEL.MOBILE_WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/checkout/complete/payment",
    cardUserKey: "9rvjsI8vILFr3zzbKltmaAGvPvw=",
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: 'BY789',

      /* Kullanıcının üst sistemdeki ID numarası */
      name: 'John',

      /* Kullanıcının adı */
      surname: 'Doe',

      /* Kullanıcın soyadı */
      gsmNumber: '+905350000000',

      /* Kullanıcının telefon numarası */
      email: 'email@email.com',

      /* Kullanıcının e-posta adresi */
      identityNumber: '00000000000',

      /* Kullanıcının kimlik numarası / eğer yoksa 11 tane 0 girilebilir */
      lastLoginDate: '2015-10-05 12:43:35',

      /* En son giriş tarihi */
      registrationDate: '2013-04-21 15:12:09',

      /* Kayıt tarihi */
      registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Kullanıcının kayıt adresi */
      ip: '85.34.78.112',

      /* Kullanıcının IP adresi */
      city: 'Istanbul',

      /* Kullanıcının şehri */
      country: 'Turkey',

      /* Kullanıcının ülkesi */
      zipCode: '34732'
      /* Kullanıcının posta kodu */

    },
    shippingAddress: {
      contactName: 'Jane Doe',

      /* Teslimat için Kullanıcının Adı */
      city: 'Istanbul',

      /* Teslimat için Kullanıcının Şehri */
      country: 'Turkey',

      /* Teslimat için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Teslimat için Kullanıcının Şehri */
      zipCode: '34742'
      /* Teslimat için Kullanıcının Posta Kodu */

    },
    billingAddress: {
      contactName: 'Jane Doe',

      /* Fatura için Kullanıcının Adı */
      city: 'Istanbul',

      /* Fatura için Kullanıcının Şehri */
      country: 'Turkey',

      /* Fatura için Kullanıcının Ülkesi */
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',

      /* Fatura için Kullanıcının Adresi */
      zipCode: '34742'
      /* Fatura için Kullanıcının Posta Kodu */

    },
    basketItems: [{
      id: 'BI101',

      /* Sepet ürününün ID'si */
      name: 'Binocular',

      /* Sepet ürününün adı */
      category1: 'Collectibles',

      /* Sepet ürününün ilk kategorisi */
      category2: 'Accessories',

      /* Sepet ürününün ikinci kategorisi */
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,

      /* Sepet ürününün tipi */
      price: 90
      /* Sepet ürününün toplam fiyattaki kırılımı */

    }, {
      id: 'BI102',
      name: 'Game code',
      category1: 'Game',
      category2: 'Online Game Items',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.VIRTUAL,
      price: 150
    }, {
      id: 'BI103',
      name: 'Usb',
      category1: 'Electronics',
      category2: 'Usb / Cable',
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("13-checkout-form-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("13-checkout-form-payments-hata", err);
  });
}; //initializeCheckoutForm();
//tamamlanmış yada tamamlanmamış ödeme bilgisini gösterir


const getFromPayment = () => {
  Checkouts.getFromPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    token: "afcacc2d-5e4b-423c-aa46-e1196d9711d4"
  }).then(result => {
    console.log(result);
    Logs.logFile("14-checkout-form-payments-get-details", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("14-checkout-form-payments-get-details-hata", err);
  });
}; //getFromPayment();

/*--------------------------------------*/

/* f) CANCEL PAYMENTS  */

/*--------------------------------------*/
//ödemeyi iptal etme testi


const cancelPayments = () => {
  CancelPayments.cancelPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "17718400",
    ip: '85.34.78.112'
  }).then(result => {
    console.log(result);
    Logs.logFile("15-cancel-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("5-cancel-payments-hata", err);
  });
}; //cancelPayments();


const cancelPaymentsWithReason = () => {
  CancelPayments.cancelPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "17718386",
    ip: '85.34.78.112',
    reason: _iyzipay.default.REFUND_REASON.BUYER_REQUEST,
    description: "Kullanıcı isteği ile iptal edilmiştir"
  }).then(result => {
    console.log(result);
    Logs.logFile("16-cancel-payments-reason", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("16-cancel-payments-reason-hata", err);
  });
}; //cancelPaymentsWithReason();

/*--------------------------------------*/

/* g) REFUND PAYMENTS  */

/*--------------------------------------*/
//ödemenin birlirli bir parcasını iade et


const refundPayment = () => {
  RefundPayments.refundPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentTransactionId: "18931283",
    price: "60",
    currency: _iyzipay.default.CURRENCY.TRY,
    ip: '85.34.78.112'
  }).then(result => {
    console.log(result);
    Logs.logFile("17-refund-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("17-refund-payments-hata", err);
  });
}; //refundPayment();
//ödemenin birlirli bir parcasını neden ile iade et


const refundPaymentWithReason = () => {
  RefundPayments.refundPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentTransactionId: "18931283",
    price: "40",
    currency: _iyzipay.default.CURRENCY.TRY,
    ip: '85.34.78.112',
    reason: _iyzipay.default.REFUND_REASON.BUYER_REQUEST,
    description: "Kullanıcı iade istedi"
  }).then(result => {
    console.log(result);
    Logs.logFile("18-refund-payments-with-reason", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("18-refund-payments-with-reason-hata", err);
  });
};

refundPaymentWithReason();