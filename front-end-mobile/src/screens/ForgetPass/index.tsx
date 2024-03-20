import React from 'react';
import {StyleSheet, Text, View, Image, ScrollView, Linking} from 'react-native';
import Gap from '../../components/atoms/Gap';
import {Logo} from '../../assets/images';
import {MyFont} from '../../components/atoms/MyFont';
import {MyColor} from '../../components/atoms/MyColor';
import Button from '../../components/atoms/Button';

const ForgetPass = ({navigation}: any) => {
  const phoneNumber = '+6285756948021';

  const handleTelepon = () => {
    Linking.openURL(`tel:${phoneNumber}`)
      .then(result => {
        if (result) {
          console.log('Aplikasi telepon telah dibuka');
        } else {
          console.log('Gagal membuka aplikasi telepon');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}`)
      // Linking.openURL(`https://chat.whatsapp.com/LFFMeQtBsAp2Z4C1Rxrg8B`)
      .then(result => {
        if (result) {
          console.log('Aplikasi WhatsApp telah dibuka');
        } else {
          console.log('Gagal membuka aplikasi WhatsApp');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  // const handleTelegram = () => {
  //   // Linking.openURL(`whatsapp://send?phone=${phoneNumber}`)
  //   Linking.openURL(`https://t.me/+P2Ljm3sMJyY4MDBl`)
  //     .then(result => {
  //       if (result) {
  //         console.log('Aplikasi Telegram telah dibuka');
  //       } else {
  //         console.log('Gagal membuka aplikasi Telegram');
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  // };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Gap height={110} />
      <View style={styles.logoContainer}>
        <Image source={Logo} resizeMode="contain" style={styles.logo} />
        <Text style={styles.txtLogo}>RSUD Dr.Sam Ratulangi{'\n'}Tondano</Text>
      </View>
      <Gap height={100} />
      <View style={styles.content}>
        <Text style={styles.txt}>
          {/* Jika Anda lupa password akun, silahkan menghubungi di telegram IT Help
          Desk RSUD Sam Ratulangi Tondano. */}
          Jika Anda lupa password akun, silahkan menghubungi bagian{' '}
          <Text style={{fontFamily: 'Poppins-Bold'}}>admin IT</Text> melalui
          kontak yang ada dibawah ini
        </Text>
        <Gap height={30} />
        <View style={{flexDirection: 'row', columnGap: 30, marginTop: 10}}>
          <Button
            label="Whatsapp admin IT"
            width={250}
            backgroundColor={MyColor.Primary}
            textColor="white"
            onClick={handleWhatsApp}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
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
    textAlign: 'center',
    fontFamily: MyFont.Primary,
    fontSize: 17,
    color: 'black',
  },

  txtPhoneNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    textAlign: 'center',
    color: MyColor.Primary,
  },
});

export default ForgetPass;
