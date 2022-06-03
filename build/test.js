"use strict";

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_fs.default.writeFileSync("test.txt", "Mustafa Göreli Deneme 2", {
  encoding: "utf-8"
});