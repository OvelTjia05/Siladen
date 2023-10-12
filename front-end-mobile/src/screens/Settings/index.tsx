import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Linking,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import Button from '../../components/atoms/Button';
import {MyColor} from '../../components/atoms/MyColor';
import Header from '../../components/molecules/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  saveIdUserAction,
  saveNameAction,
  saveRoleAction,
  saveTokenAction,
  saveUsernameAction,
} from '../../../redux/action';
import axios from 'axios';
import {CommonActions} from '@react-navigation/native';
import {IconAbout, IconKey, IconLogOut, IconPolicy} from '../../assets/icons';
import Gap from '../../components/atoms/Gap';
import Title from '../../components/atoms/Title';
import {ProfilePlaceHolder} from '../../assets/images';
import {MyFont} from '../../components/atoms/MyFont';
import socket from '../../../socket';

const Settings = ({navigation}: any) => {
  const name = useSelector((data: any) => data.name);
  // const role = useSelector((data:any)=> data.)
  const dispatch = useDispatch();
  const token = useSelector((data: any) => data.token);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const logout = async () => {
    setIsModalVisible(false);
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.delete(
        `https://backend-pelaporan-final.glitch.me/auth/user/logout`,
        {headers},
      );

      await AsyncStorage.setItem('id_user', '');
      await AsyncStorage.setItem('name', '');
      await AsyncStorage.setItem('token', '');
      await AsyncStorage.setItem('role', '');
      dispatch(saveIdUserAction(''));
      dispatch(saveNameAction(''));
      dispatch(saveTokenAction(''));
      dispatch(saveRoleAction(''));

      if (response.data.code === '200') {
        // navigation.navigate('WelcomePage');
        socket.off('message received');
        socket.off('admin received');

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'SplashScreen'}],
          }),
        );
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert(
        'Terjadi kesalahan',
        'Mohon coba lagi, jika kesalahan terus berlanjut silahkan hubungi Costumer Service',
      );
      console.log('ini error login: ', error);
    }
  };
  return (
    <View style={styles.container}>
      <Header backgroundTransparent />
      <View style={styles.container1}>
        <Gap height={20} />
        <Text style={styles.txtTitle}>Pengaturan</Text>
        <Gap height={10} />
        <View
          style={{
            backgroundColor: MyColor.Primary,
            height: 120,
            borderRadius: 20,
            width: '100%',
            maxWidth: 350,
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 20,
            columnGap: 20,
          }}>
          <Image source={ProfilePlaceHolder} style={styles.img} />
          <View>
            <Text style={styles.txtBold}>{name}</Text>
            <Text style={styles.txt}>Role disini</Text>
          </View>
        </View>
        <Gap height={10} />
        <TouchableOpacity
          style={[styles.btn, {borderColor: MyColor.Primary}]}
          onPress={() => navigation.navigate('ForgetPass')}>
          <Text style={[styles.txtBtn, {color: MyColor.Primary}]}>
            Ganti Password
          </Text>
          <IconKey />
        </TouchableOpacity>
        <Gap height={30} />
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            Linking.openURL(
              'https://alphacast.id/x/rsudtondano/siladen/tentangaplikasi/',
            )
              .then(result => {
                if (result) {
                  console.log('Buka link tentang aplikasi');
                } else {
                  console.log('Gagal membuka link tentang aplikasi');
                }
              })
              .catch(error => {
                console.error('Error:', error);
              })
          }>
          <Text style={styles.txtBtn}>Tentang Aplikasi</Text>
          <IconAbout />
        </TouchableOpacity>
        <Gap height={10} />
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            Linking.openURL(
              'https://alphacast.id/x/rsudtondano/siladen/privasinkeamanan/',
            )
              .then(result => {
                if (result) {
                  console.log('Buka link privasi dan keamanan');
                } else {
                  console.log('Gagal membuka link privasi dan keamanan');
                }
              })
              .catch(error => {
                console.error('Error:', error);
              })
          }>
          <Text style={styles.txtBtn}>Privasi & Keamanan</Text>
          <IconPolicy />
        </TouchableOpacity>
        <Gap height={30} />
        {isLoading ? (
          <ActivityIndicator size="large" color={MyColor.Primary} />
        ) : (
          <TouchableOpacity
            style={[styles.btn, {borderColor: '#8D0000'}]}
            onPress={() => {
              setIsModalVisible(true);
            }}>
            <Text style={[styles.txtBtn, {color: '#8D0000'}]}>
              Keluarkan Akun
            </Text>
            <IconLogOut />
          </TouchableOpacity>
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modal}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={[styles.txtBtn, {color: '#8D0000'}]}>
                  Keluarkan Akun
                </Text>
                <IconLogOut />
              </View>
              <Text style={styles.txtBoldModal}>
                Anda yakin mau keluarkan akun Anda?
              </Text>
              <Gap height={20} />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <TouchableOpacity
                  style={styles.btnModal}
                  onPress={() => {
                    setIsModalVisible(false);
                  }}>
                  <Text style={styles.txtBoldModal}>Tidak</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={logout}
                  style={[styles.btnModal, {backgroundColor: '#8D0000'}]}>
                  <Text style={[styles.txtBoldModal, {color: MyColor.Light}]}>
                    Ya
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  container1: {
    flex: 1,
    padding: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  btn: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'black',
    flexDirection: 'row',
    height: 46,
    width: '100%',
    maxWidth: 350,
    overflow: 'hidden',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnModal: {
    width: '40%',
    maxWidth: 130,
    borderWidth: 2,
    borderColor: '#8D0000',
    borderRadius: 10,
    alignItems: 'center',
  },
  img: {
    height: 70,
    width: 70,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  modal: {
    maxHeight: 200,
    maxWidth: 350,
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8D0000',
    backgroundColor: MyColor.Light,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
  },
  txt: {
    color: MyColor.Light,
    fontFamily: MyFont.Primary,
  },
  txtBtn: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: 'black',
  },
  txtBold: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: MyColor.Light,
  },
  txtBoldModal: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#8D0000',
  },
  txtTitle: {
    fontFamily: 'Poppins-Bold',
    color: MyColor.Primary,
    fontSize: 17,
    paddingLeft: 20,
  },
});
