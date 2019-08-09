import createStore from './createStore';
import { connect, Provider } from 'react-redux';
import ReduxGenerator from './generator';
import { PersistGate } from 'redux-persist/es/integration/react'

const generator = new ReduxGenerator();
export { PersistGate, Provider, connect, generator, createStore };
