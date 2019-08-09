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