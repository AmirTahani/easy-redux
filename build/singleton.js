"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _generator = require("./generator");

var _generator2 = _interopRequireDefault(_generator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports["default"] = function () {
  var instance;

  function createInstance() {
    return new _generator2["default"]();
  }

  return {
    getInstance: function getInstance() {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    }
  };
}();