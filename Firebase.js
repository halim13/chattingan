import firebase from 'firebase';
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
import moment from 'moment';

class Firebase {
  constructor() {
    this.init();
    // this.checkAuth();
  }

  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        databaseURL: DATABASE_URL,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID,
        measurementId: MEASSUREMENT_ID,
      });
    }
  };

  checkAuth = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        return false;
        // firebase.auth().signInAnonymously();
      }
      return true;
    });
  };

  send = messages => {
    messages.forEach(item => {
      const message = {
        text: item.text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: item.user,
      };
      this.db.push(message);
    });
  };

  parse = message => {
    const {user, text, timestamp} = message.val();
    const {key: _id} = message;
    const createdAt = new Date(timestamp);
    // const time = moment(timestamp, 'HH:MM').format('HH:mm');

    return {
      _id,
      createdAt: createdAt,
      text,
      user,
    };
  };

  get = callback => {
    this.db.on('child_added', snapshot => callback(this.parse(snapshot)));
  };

  off() {
    this.db.off();
  }

  get db() {
    const uid = this.uid;
    return firebase.database().ref(`messages/${uid}`);
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
}

export default new Firebase();
