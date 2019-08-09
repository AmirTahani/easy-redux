import { persistStore, persistReducer } from 'redux-persist';
import { all } from 'redux-saga/effects';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage';
export default function create(generator) {
  var sagaMiddleware = createSagaMiddleware();
  var middleWares = [sagaMiddleware];
  var whitelist = generator.getWhiteList();
  var persistConfig = {
    key: 'root',
    whitelist: whitelist,
    storage: storage
  };
  var reducers = persistReducer(persistConfig, combineReducers(generator.getReducers()));
  var sagas = generateSagas(generator.getSagas());
  var store = createStore(reducers, applyMiddleware.apply(void 0, middleWares));
  var persistor = persistStore(store);
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
              return all(sagas);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, root);
    })
  );
}