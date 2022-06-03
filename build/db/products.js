"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Schema
} = _mongoose.default;
const {
  ObjectId
} = Schema.Types;
const ProductsSchema = new Schema({
  uid: {
    type: String,
    default: (0, _nanoid.default)(),
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  categories: {
    type: [String]
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: "TRY",
    enum: ["TRY", "USD", "EUR"]
  },
  stock: {
    type: String,
    default: 1,
    required: true
  },
  itemType: {
    type: String,
    required: true,
    default: "PHYICAL",
    enum: ["PHYSICAL", "VIRTUAL"]
  }
}, {
  _id: true,
  collection: "products",
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      return { ...ret
      };
    }
  }
});

const Products = _mongoose.default.model("Products", ProductsSchema);

Products.starterData = [{
  _id: _mongoose.default.Types.ObjectId('61d054e5a2f56187efb0a3b2'),
  name: "Samsung Galaxy S20",
  uid: (0, _nanoid.default)(),
  images: ["https://picsum.photos/500/500?random=1", "https://picsum.photos/500/500?random=1", "https://picsum.photos/500/500?random=1"],
  categories: ["Telefonlar", "Android Telefonlar"],
  brand: "Samsung",
  price: 10000,
  currency: "TRY",
  stock: 10,
  itemType: "PHYSICAL"
}, {
  _id: _mongoose.default.Types.ObjectId('61d055016272c60f701be7ac'),
  name: "Iphone 12",
  uid: (0, _nanoid.default)(),
  images: ["https://picsum.photos/500/500?random=1", "https://picsum.photos/500/500?random=1", "https://picsum.photos/500/500?random=1"],
  categories: ["Telefonlar", "iOS Telefonlar"],
  brand: "Apple",
  price: 13000,
  currency: "TRY",
  stock: 5,
  itemType: "PHYSICAL"
}, {
  _id: _mongoose.default.Types.ObjectId('61d055095087612ecee33a20'),
  name: "Ipad Pro 2021",
  uid: (0, _nanoid.default)(),
  images: ["https://picsum.photos/500/500?random=1", "https://picsum.photos/500/500?random=1", "https://picsum.photos/500/500?random=1"],
  categories: ["Tabletler", "iPad"],
  brand: "Apple",
  price: 18000,
  currency: "TRY",
  stock: 8,
  itemType: "PHYSICAL"
}];

Products.initializer = async () => {
  const count = await Products.estimatedDocumentCount();

  if (count === 0) {
    const created = await Products.create(Products.starterData);
    console.log(`${created.length} users created`);
    console.log(Products.starterData);
  }
}; //Products.initializer();


var _default = Products;
exports.default = _default;