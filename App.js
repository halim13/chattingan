// import firebase from './android/configs/firebase';
import React, {Component} from 'react';
import HomeNavigator from './src/public/navigations/home';
import {Provider} from 'react-redux';
import {store, persistor} from './src/public/redux/store/index';
import {PersistGate} from 'redux-persist/es/integration/react';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HomeNavigator />
        </PersistGate>
      </Provider>
    );
  }
}
