/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  onRegister: function (token) {
    // console.log('TOKEN:', token);
    (async () => {
      await AsyncStorage.setItem('device_token', token.token);
    })();
  },
  onRegistrationError(err) {
    console.log('Registration error', err);
  },
  onNotification: function (notification) {
    // console.log('NOTIFICATION:', notification);
    if (notification.foreground) {
      if (!notification.data.isLocalNotification) {
        notification.data.isLocalNotification = true;

        PushNotification.localNotification({
          channelId: 'siladen-channel-rsud',
          title: notification.title,
          message: notification.message,
          userInfo: notification.data,
        });
      }
    }
  },

  popInitialNotification: true,
  requestPermissions: true,
});

AppRegistry.registerComponent(appName, () => App);
