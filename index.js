import { persistStore } from 'redux-persist';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage';
export default function create(generator) {
  var sagaMiddleware = createSagaMiddleware();
  var middleWares = [sagaMiddleware];
  var reducers = combineReducers(generator.getReducers());
  var sagas = generator.getSagas();
  var whiteList = generator.getWhiteList();
  var store = createStore(reducers, applyMiddleware.apply(void 0, middleWares));
  persistStore(store, {
    whitelist: whiteList,
    storage: storage
  });
  store.rootTask = sagaMiddleware.run(sagas);
  return store;
}
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { takeEvery, put } from 'redux-saga/effects';
import storeCreator from './createStore';
import { connect, Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import axios from 'axios';

var ReduxGenerator = function ReduxGenerator() {
  var _this = this;

  _classCallCheck(this, ReduxGenerator);

  this.reducers = [];
  this.sagas = [];
  this.whiteList = [];
  this.actionCreators = {};

  this.createModule = function (_ref) {
    var type = _ref.type,
        method = _ref.method,
        url = _ref.url,
        cache = _ref.cache;

    _this.generateReducer(type);

    _this.generateSaga(type, method, url);

    _this.generateActionCreator(type);

    _this.setCache(type, cache);
  };

  this.generateActionCreator = function (type) {
    var actionCreator = function actionCreator() {
      return {
        type: type
      };
    };

    _this.setActionCreator(type, actionCreator);
  };

  this.setActionCreator = function (type, actionCreator) {
    _this.actionCreators = _objectSpread({}, _this.actionCreators, _defineProperty({}, type, actionCreator));
  };

  this.getActionCreator = function (type) {
    return _this.actionCreators[type];
  };

  this.setCache = function (type, cache) {
    if (cache) {
      _this.whiteList = [].concat(_toConsumableArray(_this.whiteList), [type]);
    }

    return _this;
  };

  this.getWhiteList = function () {
    return _this.whiteList;
  };

  this.generateReducer = function (type) {
    var initialState = _defineProperty({}, type, {
      data: null,
      loading: false,
      loaded: false,
      error: null
    });

    var reducer = function reducer() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      switch (action.type) {
        case "".concat(action.type, "_LOAD"):
          return _objectSpread({}, state, _defineProperty({}, action.type, _objectSpread({}, state[action.type], {
            loading: true
          })));

        case "".concat(action.type, "_LOAD_SUCCESS"):
          return _objectSpread({}, state, _defineProperty({}, action.type, _objectSpread({}, state[action.type], {
            loading: false,
            loaded: true
          })));

        case "".concat(action.type, "_LOAD_FAILURE"):
          return _objectSpread({}, state, _defineProperty({}, action.type, _objectSpread({}, state[action.type], {
            loading: false,
            loaded: true,
            error: action.error
          })));

        default:
          return state;
      }
    };

    _this.setReducer(reducer);
  };

  this.generateWatcher = function (type, method, url) {
    return (
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return axios[method](url);

              case 3:
                response = _context.sent;
                _context.next = 6;
                return put({
                  type: "".concat(type, "_LOAD_SUCCESS"),
                  data: response.data
                });

              case 6:
                _context.next = 12;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                _context.next = 12;
                return put({
                  type: "".concat(type, "_LOAD_FAILURE"),
                  error: _context.t0
                });

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 8]]);
      })
    );
  };

  this.getReducers = function () {
    return _this.reducers;
  };

  this.generateSaga = function (type, method, url) {
    var saga = takeEvery("".concat(type, "_LOAD"), _this.generateWatcher(type, method, url));

    _this.setSaga(saga);

    return _this;
  };

  this.getSagas = function () {
    return _this.sagas;
  };

  this.setReducer = function (reducer) {
    _this.reducers = [].concat(_toConsumableArray(_this.reducers), [reducer]);
    return _this;
  };

  this.setSaga = function (saga) {
    _this.sagas = [].concat(_toConsumableArray(_this.sagas), [saga]);
    return _this;
  };
};

var generator = new ReduxGenerator();
export { PersistGate, Provider, connect, generator, storeCreator };
