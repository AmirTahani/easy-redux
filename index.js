const createStore = require('./build/createStore');
const { connect, Provider } = require('react-redux');
const ReduxGenerator = require('./build/generator');
const { PersistGate } = require('redux-persist/es/integration/react');

const generator = new ReduxGenerator();
module.exports = { PersistGate, Provider, connect, generator, createStore };
