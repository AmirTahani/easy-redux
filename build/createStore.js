"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = create;

var _reduxPersist = require("redux-persist");

var _effects = require("redux-saga/effects");

var _redux = require("redux");

var _reduxSaga = require("redux-saga");

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _storage = require("redux-persist/lib/storage");

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function create(generator) {
  var sagaMiddleware = (0, _reduxSaga2["default"])();
  var middleWares = [sagaMiddleware];
  var whitelist = generator.getWhiteList();
  var persistConfig = {
    key: 'root',
    whitelist: whitelist,
    storage: _storage2["default"]
  };
  var reducers = (0, _reduxPersist.persistReducer)(persistConfig, (0, _redux.combineReducers)(generator.getReducers()));
  var sagas = generateSagas(generator.getSagas());
  var store = (0, _redux.createStore)(reducers, _redux.applyMiddleware.apply(void 0, middleWares));
  var persistor = (0, _reduxPersist.persistStore)(store);
  store.rootTask = sagaMiddleware.run(sagas);
  return {
    store: store,
    persistor: persistor
  };
}

function generateSagas(sagas) {
  return (
    /*#__PURE__*/
    regeneratorRuntime.mark(function root() {
      return regeneratorRuntime.wrap(function root$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _effects.all)(sagas);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, root);
    })
  );
}