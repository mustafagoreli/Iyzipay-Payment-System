"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logFile = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logFile = (filename, data) => {
  const dir = _path.default.join(__dirname, `../logs/${filename}.json`);

  const writeData = JSON.stringify(data, null, 4);

  _fs.default.writeFileSync(dir, writeData);
};

exports.logFile = logFile;
logFile("test", {
  test: 1,
  name: "Mustafa"
});