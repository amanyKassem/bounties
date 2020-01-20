import React from 'react';
import {AsyncStorage, View , Platform} from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './src/routes';
import { Root } from "native-base";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './src/store';
import './ReactotronConfig';
import * as Permissions from "expo-permissions";
import { Notifications } from 'expo'


// Keystore password: 40d7bd0bbdea46fa84f6f9b394bc7b5b
// Key alias:         QGFtYW55X2thc3NlbS9ib3VudGllcw==
// Key password:      cb4dd0571c4b4d1890c57c8ba0fceae3


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };

  }

  async componentDidMount() {

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('orders', {
        name: 'Chat messages',
        sound: true,
      });
    }

    // Notifications.addListener(this.handleNotification);


    await Font.loadAsync({
      cairo             : require('./assets/fonts/Cairo-Regular.ttf'),
      cairoBold         : require('./assets/fonts/Cairo-Bold.ttf'),
      Roboto            : require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium     : require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });

    this.setState({ isReady: true });

    // AsyncStorage.clear();

  }

  //
  // handleNotification = (notification) => {
  //   if (notification && notification.origin !== 'received') {
  //     this.props.navigation.navigate('notifications');
  //   }
  // }


  async componentWillMount() {

    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    const deviceId = await Notifications.getExpoPushTokenAsync();
    console.log('deviceIddeviceId' , deviceId)

    AsyncStorage.setItem('deviceID', deviceId);

  }

  render() {

    if (!this.state.isReady) {
      return (
          <View />
      );
    }

    return (
        <Provider store={store}>
          <PersistGate persistor={persistedStore}>
            <Root>
              <AppNavigator />
            </Root>
          </PersistGate>
        </Provider>

    );
  }
}
