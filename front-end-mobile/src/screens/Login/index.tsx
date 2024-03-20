import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput as Input,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Gap from '../../components/atoms/Gap';
import {Logo} from '../../assets/images';
import {MyFont} from '../../components/atoms/MyFont';
import {MyColor} from '../../components/atoms/MyColor';
import {
  IconMataTerbuka,
  IconMataTertutup,
  IconPanahKanan,
} from '../../assets/icons';
import Button from '../../components/atoms/Button';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_HOST} from '../../../config';
import {useDispatch} from 'react-redux';
import {
  saveIdUserAction,
  saveNameAction,
  saveRoleAction,
  saveTokenAction,
  saveUsernameAction,
  saveJobAction,
} from '../../../redux/action';
import {CommonActions} from '@react-navigation/native';
import {defineSocket} from '../../../socket';

// const socket = io(API_HOST);

const PasswordInput = ({placeholder, onChangeText, value}: any) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.passwordInputContainer}>
      <Input
        style={styles.txtInputPassword}
        placeholder={placeholder}
        placeholderTextColor="#787878"
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        value={value}
      />
      <TouchableOpacity onPress={toggleSecureTextEntry}>
        {secureTextEntry ? (
          <IconMataTertutup stroke={'black'} />
        ) : (
          <IconMataTerbuka stroke={'black'} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const Login = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Harap isi username dan password.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_HOST}/auth/user/login`, {
        username: username.trim(),
        password: password.trim(),
      });
      const token = response.data.data.token;
      const id_user = response.data.data.id_user;
      const name = response.data.data.name;
      const role = response.data.data.role;
      const job = response.data.data.job ? response.data.data.job : '';

      await AsyncStorage.setItem('id_user', id_user);
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', role);
      await AsyncStorage.setItem('job', job);

      // console.log('ini login', response);
      if (response.data.code == '200') {
        const dataUser = response.data.data;
        if (dataUser.role !== 'admin') {
          const deviceToken: any = await AsyncStorage.getItem('device_token');
          await axios.patch(`${API_HOST}/api/user/device-token/${id_user}`, {
            device_token: deviceToken,
          });
          dispatch(saveIdUserAction(dataUser.id_user));
          dispatch(saveNameAction(dataUser.name));
          dispatch(saveRoleAction(dataUser.role));
          dispatch(saveTokenAction(dataUser.token));
          dispatch(saveUsernameAction(dataUser.username));
          dispatch(saveJobAction(dataUser.job));
          defineSocket();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Navigation'}],
            }),
          );

          setUsername('');
          setPassword('');
        } else {
          const headers = {
            Authorization: `Bearer ${token}`,
          };
          await axios.delete(`${API_HOST}/auth/user/logout`, {
            headers,
          });

          await AsyncStorage.setItem('id_user', '');
          await AsyncStorage.setItem('name', '');
          await AsyncStorage.setItem('token', '');
          await AsyncStorage.setItem('role', '');
          await AsyncStorage.setItem('job', '');

          Alert.alert('Peringatan', 'Gunakan akun lainnya!');
        }
      }

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      if (error.response) {
        if (error.response.data.code === '403') {
          Alert.alert('Login Gagal', 'Akun sedang login di perangkat lain');
        } else {
          Alert.alert(
            'Login Gagal',
            'Username tidak ditemukan atau password salah.',
          );
        }
      } else if (error.request) {
        Alert.alert(
          'Kesalahan Jaringan',
          'Pastikan anda telah terhubung ke internet',
        );
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Gap height={90} />
      <View style={styles.logoContainer}>
        <Image source={Logo} resizeMode="contain" style={styles.logo} />
        <Text style={styles.txtLogo}>RSUD Dr.Sam Ratulangi{'\n'}Tondano</Text>
      </View>
      <Gap height={40} />
      <Text style={styles.txt}>Buat Laporan dengan Akun{'\n'}</Text>
      <Text style={styles.txtBold}>Silahkan masuk dengan akun Anda{'\n'}</Text>
      <Gap height={40} />
      <Input
        style={styles.txtInput}
        placeholder="Masukan username Anda"
        placeholderTextColor="#787878"
        onChangeText={setUsername}
        value={username}
      />
      <Gap height={30} />
      <PasswordInput
        placeholder="Masukan password Anda"
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity onPress={() => navigation.navigate('ForgetPass')}>
        <Text style={styles.txtLupaPass}>Lupa password</Text>
      </TouchableOpacity>
      <Gap height={40} />
      {isLoading ? (
        <View style={{height: 45}}>
          <ActivityIndicator size="large" color={MyColor.Primary} />
        </View>
      ) : (
        <Button
          label="Masuk"
          width={193}
          backgroundColor={MyColor.Primary}
          textColor="#efefef"
          onClick={handleLogin}
          icons={<IconPanahKanan />}
        />
      )}
      <Gap height={10} />
      <Button
        label="Belum punya akun"
        width={193}
        backgroundColor="#efefef"
        textColor={MyColor.Primary}
        onClick={() => {
          navigation.navigate('SignUp');
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 43,
    height: 43,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  txtLogo: {
    fontFamily: MyFont.Primary,
    fontSize: 11,
    color: 'black',
  },
  txt: {
    fontFamily: MyFont.Primary,
    fontSize: 15,
    color: 'black',
  },
  txtBold: {
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
    color: MyColor.Primary,
  },
  txtInput: {
    fontSize: 14,
    fontFamily: MyFont.Primary,
    // borderWidth: 1,
    // borderColor: 'grey',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingStart: 10,
    width: '100%',
    marginBottom: 20,
    color: 'black',
  },
  txtInputPassword: {
    fontSize: 14,
    fontFamily: MyFont.Primary,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingStart: 10,
    width: '85%',
    color: 'black',
  },
  txtLupaPass: {
    fontFamily: MyFont.Primary,
    color: 'grey',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'grey',
    borderRadius: 10,
    backgroundColor: 'white',
    width: '100%',
  },
});

export default Login;
