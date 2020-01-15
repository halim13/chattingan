import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASSUREMENT_ID,
} from 'react-native-dotenv';

var firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASSUREMENT_ID,
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// firebase.analytics();

import {Platform, InteractionManager} from 'react-native';

const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 60 * 1000;
if (Platform.OS === 'android') {
  // Work around issue `Setting a timer for long time`
  // see: https://github.com/firebase/firebase-js-sdk/issues/97
  const timerFix = {};
  const runTask = (id, fn, ttl, args) => {
    const waitingTime = ttl - Date.now();
    if (waitingTime <= 1) {
      InteractionManager.runAfterInteractions(() => {
        if (!timerFix[id]) {
          return;
        }
        delete timerFix[id];
        fn(...args);
      });
      return;
    }

    const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
    timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
  };

  global.setTimeout = (fn, time, ...args) => {
    if (MAX_TIMER_DURATION_MS < time) {
      const ttl = Date.now() + time;
      const id = '_lt_' + Object.keys(timerFix).length;
      runTask(id, fn, ttl, args);
      return id;
    }
    return _setTimeout(fn, time, ...args);
  };

  global.clearTimeout = id => {
    if (typeof id === 'string' && id.startsWith('_lt_')) {
      _clearTimeout(timerFix[id]);
      delete timerFix[id];
      return;
    }
    _clearTimeout(id);
  };
}

export default firebase;
