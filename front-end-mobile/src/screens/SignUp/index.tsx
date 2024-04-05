import React, {useState} from 'react';
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
  Pressable,
  Modal,
} from 'react-native';
import Gap from '../../components/atoms/Gap';
import {Logo} from '../../assets/images';
import {MyFont} from '../../components/atoms/MyFont';
import {MyColor} from '../../components/atoms/MyColor';
import {
  IconDropDown,
  IconMataTerbuka,
  IconMataTertutup,
  IconPanahKanan,
} from '../../assets/icons';
import Button from '../../components/atoms/Button';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import {API_HOST} from '../../../config';

const PasswordInput = ({placeholder, onChangeText, value}: any) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.InputContainer}>
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

const SignUp = ({navigation}: any) => {
  const dispatch = useDispatch();
  const role = 'user';
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [job, setJob] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasi_password, setKonfirmasi_password] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const Register = async () => {
    setIsLoading(true);
    if (!name || !username || !password || !konfirmasi_password || !job) {
      setIsLoading(false);
      Alert.alert('Harap isi semua field');
    } else if (password !== konfirmasi_password) {
      setIsLoading(false);
      Alert.alert(
        'Password Tidak Cocok',
        'Password dan konfirmasi password harus sama.',
      );
    } else if (name.length > 50 || username.length > 20) {
      setIsLoading(false);
      Alert.alert(
        (name.length > 50 && 'Nama terlalu panjang, maksimal 50 karakter') ||
          'Username terlalu panjang, maksimal 20 karakter',
      );
    } else {
      try {
        const response = await axios.post(`${API_HOST}/auth/user/register`, {
          name: name.trim(),
          username: username.trim(),
          password: password.trim(),
          konfirmasi_password: konfirmasi_password.trim(),
          job,
          role,
        });
        if (response.data.code == '201') {
          // console.log('daftar', response);
          Alert.alert('Akun berhasil dibuat', undefined, [
            {text: 'OK', onPress: () => navigation.navigate('Login')},
          ]);
          setName('');
          setUsername('');
          setPassword('');
          setKonfirmasi_password('');
        }
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        if (
          error.response &&
          error.response.data &&
          error.response.data.code === '409'
        ) {
          setIsLoading(false);
          Alert.alert('Username sudah pernah digunakan');
        }
        console.log(error);
      }
    }
  };

  const renderJob = (option: string) => (
    <Pressable
      style={[
        styles.modalItems,
        {backgroundColor: job === option ? MyColor.Primary : MyColor.Light},
      ]}
      onPress={() => {
        setJob(option), setIsModalVisible(false);
      }}>
      <Text
        style={[
          styles.txtModal,
          {
            color: job === option ? MyColor.Light : MyColor.Primary,
          },
        ]}>
        {option}
      </Text>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Gap height={90} />
      <View style={styles.logoContainer}>
        <Image source={Logo} resizeMode="contain" style={styles.logo} />
        <Text style={styles.txtLogo}>RSUD Dr.Sam Ratulangi{'\n'}Tondano</Text>
      </View>
      <Gap height={40} />
      <Text style={styles.txt}>Buat Laporan dengan Akun{'\n'}</Text>
      <Text style={styles.txtBold}>Silahkan buat akun Anda{'\n'}</Text>
      <Gap height={30} />
      <Input
        style={styles.txtInput}
        placeholder="Masukan nama lengkap Anda"
        placeholderTextColor="#787878"
        onChangeText={setName}
        value={name}
      />
      {/* <Gap height={10} /> */}
      <Input
        style={styles.txtInput}
        placeholder="Masukan username Anda"
        placeholderTextColor="#787878"
        onChangeText={setUsername}
        value={username}
      />
      {/* <Input
        style={styles.txtInput}
        placeholder="Masukan profesi anda di RSUD"
        placeholderTextColor="#787878"
        onChangeText={setJob}
        value={job}
      /> */}
      <Pressable
        style={[
          styles.InputContainer,
          {
            paddingHorizontal: 5,
            paddingVertical: 12,
            marginBottom: 20,
          },
        ]}
        onPress={() => setIsModalVisible(true)}>
        <Text
          style={[
            styles.txtInput,
            {
              width: '90%',
              marginBottom: 'auto',
              color: 'gray',
              paddingStart: 5,
            },
          ]}>
          {job ? job : 'Pilih peran tugas anda'}
        </Text>
        <IconDropDown fill={'black'} />
      </Pressable>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              {renderJob('Perawat')}
              {renderJob('Dokter')}
              {renderJob('Administrasi')}
              {renderJob('Tenaga Kesehatan Lainnya')}
            </View>
          </View>
        </View>
      </Modal>
      <PasswordInput
        placeholder="Masukan password Anda"
        onChangeText={setPassword}
        value={password}
      />
      <Gap height={10} />
      <PasswordInput
        placeholder={`Masukan lagi password yang sama`}
        onChangeText={setKonfirmasi_password}
        value={konfirmasi_password}
      />
      <Gap height={30} />
      {isLoading ? (
        <View style={{height: 45}}>
          <ActivityIndicator size="large" color={MyColor.Primary} />
        </View>
      ) : (
        <Button
          label="Daftar"
          width={193}
          backgroundColor={MyColor.Primary}
          textColor="#efefef"
          onClick={Register}
          icons={<IconPanahKanan />}
        />
      )}
      <Gap height={10} />
      <Button
        label="Sudah punya akun"
        width={193}
        backgroundColor="#efefef"
        textColor={MyColor.Primary}
        onClick={() => {
          navigation.navigate('Login');
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
  modal: {
    width: '90%',
    maxWidth: 350,
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: MyColor.Primary,
    backgroundColor: MyColor.Light,
    paddingHorizontal: 25,
    paddingVertical: 20,
    alignSelf: 'center',
  },
  modalContent: {
    rowGap: 10,
  },
  modalItems: {
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MyColor.Primary,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
  },
  InputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    width: '100%',
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
    fontSize: 19,
    color: MyColor.Primary,
  },
  txtModal: {
    fontFamily: MyFont.Primary,
    fontSize: 18,
    textAlign: 'center',
    color: MyColor.Primary,
  },
  txtInput: {
    fontSize: 14,
    fontFamily: MyFont.Primary,
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
});

export default SignUp;
