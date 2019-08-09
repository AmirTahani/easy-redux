import { takeEvery, put } from 'redux-saga/effects';
import createStore from './createStore';
import { connect, Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react'

import axios from 'axios';

export default class ReduxGenerator {
    reducers = [];
    sagas = [];
    whiteList = [];
    actionCreators = {};

    createModule = ({ type, method, url, cache }) => {
        this.generateReducer(type);
        this.generateSaga(type, method, url);
        this.generateActionCreator(type);
        this.setCache(type, cache);
    };

    generateActionCreator = (type) => {
        const actionCreator = () => {
            return {
                type
            };
        };
        this.setActionCreator(type, actionCreator);
    };

    setActionCreator = (type, actionCreator) => {
        this.actionCreators = {
            ...this.actionCreators,
            [type]: actionCreator
        };
    };

    getActionCreator = (type) => {
        return this.actionCreators[type];
    };


    setCache = (type, cache) => {
        if (cache) {
            this.whiteList = [
                ...this.whiteList,
                type
            ];
        }
        return this;
    };

    getWhiteList = () => {
        return this.whiteList;
    };


    generateReducer = (type) => {
        const initialState = {
            [type]: {
                data: null,
                loading: false,
                loaded: false,
                error: null
            }
        };
        const reducer = (state = initialState, action = {}) => {
            switch (action.type) {
                case `${action.type}_LOAD`:
                    return {
                        ...state,
                        [action.type]: {
                            ...state[action.type],
                            loading: true,
                        }
                    };
                case `${action.type}_LOAD_SUCCESS`:
                    return {
                        ...state,
                        [action.type]: {
                            ...state[action.type],
                            loading: false,
                            loaded: true
                        }
                    };
                case `${action.type}_LOAD_FAILURE`:
                    return {
                        ...state,
                        [action.type]: {
                            ...state[action.type],
                            loading: false,
                            loaded: true,
                            error: action.error
                        }
                    };
                default:
                    return state;
            }
        };
        this.setReducer(reducer);
    };

    generateWatcher = (type, method, url) => {
        return function* () {
            try {
                const response = yield axios[method](url);
                yield put({
                    type: `${type}_LOAD_SUCCESS`,
                    data: response.data
                });
            } catch (e) {
                yield put({
                    type: `${type}_LOAD_FAILURE`,
                    error: e
                });
            }
        }
    };

    getReducers = () => {
        return this.reducers;
    };

    generateSaga = (type, method, url) => {
        const saga = takeEvery(`${type}_LOAD`, this.generateWatcher(type, method, url));
        this.setSaga(saga);
        return this;
    };

    getSagas = () => {
        return this.sagas;
    };

    setReducer = (reducer) => {
        this.reducers = [
            ...this.reducers,
            reducer
        ];
        return this;
    };

    setSaga = (saga) => {
        this.sagas = [
            ...this.sagas,
            saga
        ];
        return this;
    };
}

const generator = new ReduxGenerator();
export { PersistGate, Provider, connect, generator, create };
