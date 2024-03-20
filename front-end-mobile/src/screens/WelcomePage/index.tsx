import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import Gap from '../../components/atoms/Gap';
import {MyColor} from '../../components/atoms/MyColor';
import {BackgroundRS1, Logo} from '../../assets/images';
import {MyFont} from '../../components/atoms/MyFont';
import {IconBuatLaporan, IconBuatLaporanAnonim} from '../../assets/icons';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';

const screenWidth = Dimensions.get('window').width;
const w = screenWidth * 0.85;

const WelcomePage = ({navigation}: any) => {
  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={BackgroundRS1}
        resizeMode="cover"
        style={styles.bg}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.62)', '#efefef']}
          style={styles.overlay}></LinearGradient>
        <View style={styles.content}>
          <Gap height={100} />
          <View style={styles.logoContainer}>
            <Image source={Logo} resizeMode="contain" style={styles.logo} />
            <Text style={styles.txt}>RSUD Dr.Sam Ratulangi{'\n'}Tondano</Text>
          </View>
          <Gap height={60} />
          <Text style={styles.txtTitle}>
            <Text style={styles.txtWelcome}>Selamat datang di{'\n'}</Text>
            <Text style={styles.txtBold}>Aplikasi Laporan Insiden{'\n'}</Text>
            <Text>(Siladen)</Text>
          </Text>
          <Gap height={60} />
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.btnTxt}>
              Buat Laporan{'\n'}
              <Text style={{fontFamily: 'Poppins-Bold'}}>dengan akun</Text>
            </Text>
            <IconBuatLaporan />
          </TouchableOpacity>
          <Text style={[styles.txt, {textAlign: 'center'}]}>
            Identitas akan terekam, riwayat laporan akan{'\n'}tersimpan, dan
            masih ada fitur lainnya.
          </Text>
          <Gap height={20} />
          <TouchableOpacity
            style={[styles.btn, {backgroundColor: 'transparent'}]}
            onPress={() => navigation.navigate('BuatLaporan')}>
            <Text style={[styles.btnTxt, {color: MyColor.Primary}]}>
              Buat Laporan{'\n'}
              <Text style={{fontFamily: 'Poppins-Bold'}}>secara anonim</Text>
            </Text>
            <IconBuatLaporanAnonim />
          </TouchableOpacity>
          <Text style={[styles.txt, {textAlign: 'center'}]}>
            Identitas tidak akan tersimpan, dan laporan{'\n'}akan dikirim tanpa
            identitas maupun riwayat apapun.
          </Text>
          <Gap height={30} />
          <TouchableOpacity
            style={[styles.btn, {backgroundColor: 'transparent', height: 38}]}
            onPress={() => navigation.navigate('AdminLogin')}>
            <Text style={[styles.btnTxt, {color: MyColor.Primary}]}>
              Masuk sebagai petugas
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default WelcomePage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 30,
    backgroundColor: MyColor.Primary,
    width: 303,
    height: 73,
    borderRadius: 27,
    borderColor: '#007FA4',
    borderWidth: 2,
  },

  btnTxt: {
    fontFamily: MyFont.Primary,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  logo: {
    width: 43,
    height: 43,
  },
  logoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 20,
  },
  txt: {
    fontFamily: MyFont.Primary,
    fontSize: 11,
    color: 'black',
  },
  txtWelcome: {
    fontFamily: MyFont.Primary,
    fontSize: 19,
    color: 'black',
  },
  txtTitle: {
    fontFamily: MyFont.Primary,
    fontSize: 19,
    color: MyColor.Primary,
    textAlign: 'center',
  },
  txtBold: {
    fontFamily: 'Poppins-Bold',
  },
});
