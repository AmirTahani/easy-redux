const createStore = require('./build/createStore').default;
const { connect, Provider } = require('react-redux');
const ReduxGenerator = require('./build/generator').default;
const Singleton = require('./build/singleton').default;
const { PersistGate } = require('redux-persist/es/integration/react');

module.exports = { PersistGate, Provider, connect, Singleton, createStore };
