import { persistStore, persistReducer } from 'redux-persist';
import { all } from 'redux-saga/effects';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage';

export default function create(generator) {
    const sagaMiddleware = createSagaMiddleware();

    const middleWares = [
        sagaMiddleware
    ];
    const whitelist = generator.getWhiteList();

    const persistConfig = {
        key: 'root',
        whitelist,
        storage
    };

    console.log(generator.getReducers(), 'this is generator.getReducers()');
    const reducers = persistReducer(persistConfig, combineReducers(generator.getReducers()));
    console.log(reducers, 'this reeducers inside persist reduceer');
    console.log(generator.getSagas(), 'thi sis sagas generator');
    const sagas = generateSagas(generator.getSagas());
    console.log(sagas, 'sagas we need');


    const store = createStore(
        reducers,
        applyMiddleware(...middleWares),
    );

    const persistor = persistStore(store);

    store.rootTask = sagaMiddleware.run(sagas);

    return { store, persistor };
}


function generateSagas(sagas) {
    return function* root() {
        yield all(sagas);
    }
}
