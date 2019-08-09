import { persistStore } from 'redux-persist';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage';

export default function create(generator) {
    const sagaMiddleware = createSagaMiddleware();

    const middleWares = [
        sagaMiddleware
    ];

    const reducers = combineReducers(generator.getReducers());
    const sagas = generator.getSagas();
    const whiteList = generator.getWhiteList();


    const store = createStore(
        reducers,
        applyMiddleware(...middleWares),
    );

    persistStore(store, {
        whitelist: whiteList,
        storage: storage
    });

    store.rootTask = sagaMiddleware.run(sagas);

    return store;
}
