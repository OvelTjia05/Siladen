import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect} from 'react';
import {BackgroundRS1, Logo} from '../../assets/images';
import Gap from '../../components/atoms/Gap';
import {MyColor} from '../../components/atoms/MyColor';
import {MyFont} from '../../components/atoms/MyFont';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {
  saveIdUserAction,
  saveNameAction,
  saveRoleAction,
  saveTokenAction,
} from '../../../redux/action';
import {API_HOST, API_HOST_FCM} from '../../../config';
import axios from 'axios';
import PushNotification, {Importance} from 'react-native-push-notification';
import {defineSocket, socket} from '../../../socket';

const SplashScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  useEffect(() => {
    // cekAuth();
    getFCMKey();
  }, [navigation]);

  // useEffect(() => {
  //   getFCMKey();
  // }, []);

  PushNotification.getChannels(function (channel_ids) {
    if (channel_ids.length < 1) {
      PushNotification.createChannel(
        {
          channelId: `siladen-channel-rsud`,
          channelName: 'Report Notification',
          importance: Importance.HIGH,
          vibrate: true,
        },
        created => {
          console.log(created);
        },
      );
    }
  });

  const getFCMKey = async () => {
    const FCMKey: any = await AsyncStorage.getItem('fcm_key');
    // console.log('ini key so ada', FCMKey);
    if (!FCMKey) {
      try {
        const response = await axios.get(`${API_HOST_FCM}/fcm/key`);
        // console.log('ini key FCM', response);
        if (response.data.key) {
          await AsyncStorage.setItem('fcm_key', response.data.key);
          cekAuth();
        }
      } catch (error: any) {
        console.log('error fcm key', error);
        if (error.code === 'ERR_NETWORK') {
          Alert.alert(
            'Kesalahan jaringan',
            'Pastikan anda telah terhubung ke internet lalu restart aplikasi',
            [
              {
                text: 'Restart',
                onPress: () => BackHandler.exitApp(),
              },
            ],
          );
        } else {
          Alert.alert(
            'Terjadi Kesalahan',
            'Silahkan restart kembali aplikasi, jika kesalahan terus berlanjut hubungi IT support',
            [
              {
                text: 'Restart',
                onPress: () => BackHandler.exitApp(),
              },
            ],
          );
        }
      }
    } else {
      cekAuth();
    }
  };

  const cekAuth = async () => {
    try {
      const name: any = await AsyncStorage.getItem('name');
      const idUser: any = await AsyncStorage.getItem('id_user');
      const role: any = await AsyncStorage.getItem('role');
      const token: any = await AsyncStorage.getItem('token');

      if (name && idUser && role && token) {
        dispatch(saveNameAction(name));
        dispatch(saveIdUserAction(idUser));
        dispatch(saveRoleAction(role));
        dispatch(saveTokenAction(token));
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        if (role === 'user') {
          try {
            const response = await axios.get(`${API_HOST}/auth/user/session/`, {
              headers,
            });

            if (response.data.code === '200') {
              navigation.replace('Navigation');
              if (!socket) {
                defineSocket();
              }
            }
          } catch (error: any) {
            if (error.code === 'ERR_NETWORK') {
              Alert.alert(
                'Kesalahan jaringan',
                'Pastikan anda telah terhubung ke internet lalu restart aplikasi',
                [
                  {
                    text: 'Restart',
                    onPress: () => BackHandler.exitApp(),
                  },
                ],
              );
            } else {
              navigation.replace('WelcomePage');
            }
          }
        } else if (role === 'admin') {
          try {
            const response = await axios.get(`${API_HOST}/auth/user/session/`, {
              headers,
            });

            if (response.data.code === '200') {
              navigation.replace('AdminHomepage');
              if (!socket) {
                defineSocket();
              }
            }
          } catch (error: any) {
            if (error.code === 'ERR_NETWORK') {
              Alert.alert(
                'Kesalahan jaringan',
                'Pastikan anda telah terhubung ke internet lalu restart aplikasi',
                [
                  {
                    text: 'Restart',
                    onPress: () => BackHandler.exitApp(),
                  },
                ],
              );
            } else {
              navigation.replace('WelcomePage');
            }
          }
        }
      } else {
        const navigateToDashboard = setTimeout(() => {
          navigation.replace('WelcomePage');
        }, 3000);
        return () => clearTimeout(navigateToDashboard);
      }
    } catch (error) {
      console.log('ini error splash screen: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={BackgroundRS1}
        resizeMode="cover"
        style={styles.bgRS}>
        <View style={styles.overlay}></View>
        <Gap height={100} />
        <Image source={Logo} resizeMode="contain" style={styles.logo} />
        <Gap height={100} />
        <Text style={styles.txtTitle}>Siladen</Text>
        <Text style={styles.txtSub}>Aplikasi Pelaporan Insiden</Text>
        <Gap height={100} />
        <Text style={styles.txt}>RSUD Dr.Sam Ratulangi{'\n'}Tondano</Text>
        <Gap height={80} />
        <Text style={styles.txtVersion}>v. 1.0.0</Text>
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    height: 70,
  },
  bgRS: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -1,
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  txt: {
    fontFamily: MyFont.Primary,
    textAlign: 'center',
    fontSize: 17,
    color: '#212121',
  },
  txtTitle: {
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    fontSize: 38,
    color: MyColor.Primary,
    lineHeight: 60,
  },
  txtSub: {
    fontFamily: MyFont.Primary,
    fontSize: 15,
    color: MyColor.Primary,
  },
  txtVersion: {
    color: '#787878',
  },
});
