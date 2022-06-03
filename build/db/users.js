"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Schema
} = _mongoose.default;
const {
  ObjectId
} = Schema.Types;

const randomColorGenerator = () => {
  return Math.floor(Math.random() * 16777215).toString(16);
};

const UsersSchema = new Schema({
  uid: {
    type: String,
    default: (0, _nanoid.default)(),
    unique: true,
    required: true
  },
  locale: {
    type: String,
    required: true,
    default: "tr",
    enum: ["tr", "en"]
  },
  role: {
    type: String,
    required: true,
    default: "user",
    enum: ["user", "admin"]
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  identityNumber: {
    type: String,
    required: false,
    default: "00000000000"
  },
  password: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String
  },
  avatarColor: {
    type: String,
    default: randomColorGenerator(),
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: "Turkey"
  },
  zipCode: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true,
    default: "85.34.78.112"
  },
  cardUserKey: {
    type: String,
    required: false,
    //
    unique: true
  }
}, {
  _id: true,
  collection: "users",
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.password;
      return { ...ret
      };
    }
  }
});
UsersSchema.pre("save", async function (next) {
  try {
    this.password = await _bcryptjs.default.hash(this.password, 10);
    return next();
  } catch (err) {
    return next(err);
  }

  next();
});

const Users = _mongoose.default.model("Users", UsersSchema);

Users.starterData = [{
  _id: _mongoose.default.Types.ObjectId("61d054de0d8af19519e88a61"),
  locale: "tr",
  name: "John",
  surname: "Doe",
  email: "email@email.com",
  phoneNumber: "+905350000000",
  identityNumber: "74300864791",
  password: "123456",
  avatarUrl: "https://i.pravatar.cc/300",
  address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
  city: "Istanbul",
  country: "Turkey",
  zipCode: "34732",
  ip: "85.34.78.112"
}];
Users.exampleUserCardData = {
  cardAlias: "Benim Kartım",
  cardHolderName: "John Doe",
  cardNumber: "5528790000000008",
  expireMonth: "12",
  expireYear: "2030",
  cvc: "123"
};

Users.initializer = async () => {
  const count = await Users.estimatedDocumentCount();

  if (count === 0) {
    const created = await Users.create(Users.starterData);
    console.log(`${created.length} users created`);
    console.log(Users.starterData);
  }
}; //Users.initializer();


var _default = Users;
exports.default = _default;