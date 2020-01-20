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
  getChatHistory = history => {
    const uid = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('/users/' + uid + '/historyMessages')
      .once('value')
      .then(result => {
        // console.log(result);
        const records = [];
        result.forEach(res => {
          const messageId = res.val().id;
          firebase
            .database()
            .ref('/messages/' + messageId)
            .limitToLast(1)
            .once('value')
            .then(res_ => {
              res_.forEach(_res => {
                records.push(_res.val());
              });
              // console.log(records);
              history(records);
            });
        });
      });
  };

  send = messages => {
    const uid = firebase.auth().currentUser.uid;
    messages.forEach(item => {
      const message = {
        text: item.text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: item.user,
      };

      const id = item.user.cuid;
      let messageId = uid + '_' + id;
      const searchMessage = id + '_' + uid;
      firebase
        .database()
        .ref('/messages/')
        .child(searchMessage)
        .once('value', snapshot => {
          if (snapshot.val()) {
            messageId = searchMessage;
          }
        });
      firebase
        .database()
        .ref('messages/' + messageId + '/')
        .push(message)
        .then(_ => {
          firebase
            .database()
            .ref('users/' + uid + '/historyMessages/' + messageId + '/')
            .set({
              id: messageId,
            })
            .then(__ => {
              firebase
                .database()
                .ref('users/' + id + '/historyMessages/' + messageId + '/')
                .set({
                  id: messageId,
                });
            });
        });
      // this.db.push(message);
    });
  };

  parse = message => {
    const {user, text, timestamp} = message.val();
    const {key: _id} = message;
    const createdAt = new Date(timestamp);

    return {
      _id,
      createdAt: createdAt,
      text,
      user,
    };
  };

  get = async (callback, id) => {
    const uid = firebase.auth().currentUser.uid;
    let messageId = uid + '_' + id;
    const searchMessage = id + '_' + uid;
    await firebase
      .database()
      .ref('/messages/')
      .child(searchMessage)
      .once('value', snapshot => {
        if (snapshot.val()) {
          messageId = searchMessage;
        }
      });
    firebase
      .database()
      .ref('messages/' + messageId)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  };

  off() {
    this.db.off();
  }

  get db() {
    const uid = this.uid;
    return firebase.database().ref(`messages/`);
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get FriendChat() {
    return this.parse.user._id;
  }
}

export default new Firebase();
