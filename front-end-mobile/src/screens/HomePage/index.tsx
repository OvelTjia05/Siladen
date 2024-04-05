import React, {useState, useEffect, useCallback} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Header from '../../components/molecules/Header';
import {MyFont} from '../../components/atoms/MyFont';
import {MyColor} from '../../components/atoms/MyColor';
import Gap from '../../components/atoms/Gap';
import {ImagePlaceHolder} from '../../assets/images';
import {
  IconCentang,
  IconKedaluwarsa,
  IconLaporan,
  IconPanahKanan,
  IconSedangDitindak,
  IconTolak,
  IconWaktu,
} from '../../assets/icons';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import {API_HOST} from '../../../config';
import {socket} from '../../../socket';

type Laporan = {
  id_laporan: string;
  tanggal_laporan_dikirim: Date;
  gambar: string;
  status: string;
};

const HomePage = ({navigation, route}: any) => {
  const channel_ids = useSelector((data: any) => data.channelId);
  const idUser = useSelector((data: any) => data.id_user);
  const nameUser = useSelector((data: any) => data.name);
  const token = useSelector((data: any) => data.token);

  const dataUser = {
    name: nameUser,
    id_user: idUser,
    token: token,
  };

  const today = new Date();
  const [name, setName] = useState('');
  const [latestLaporan, setLatestLaporan] = useState<Laporan[]>([]);

  useEffect(() => {
    setName(dataUser.name);
    socket.off('message received');

    // konfigurasi socket
    socket.emit('join chat', dataUser.id_user);
    socket.emit('join admin', 'admin');
    socket.on('message received', (data: any) => {
      getLatestLaporan();
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      getLatestLaporan();
    }, []),
  );

  const getLatestLaporan = async () => {
    if (dataUser.id_user) {
      try {
        const headers = {
          Authorization: `Bearer ${dataUser.token}`,
        };
        const response = await axios.get(
          `${API_HOST}/api/laporan/user/latest/${dataUser.id_user}`,
          {headers},
        );
        setLatestLaporan(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'dalam antrian':
        return MyColor.Primary;
      case 'investigasi':
        return '#A37F00';
      case 'laporan selesai':
        return '#008656';
      case 'laporan ditolak':
        return '#8D0000';
      case 'laporan kedaluwarsa':
        return '#3A3A3A';
      default:
        return 'transparent';
    }
  };

  const convertStatus = (status: any) => {
    switch (status) {
      case 'dalam antrian':
        return 'Dalam Antrian';
      case 'investigasi':
        return 'Sedang Di Investigasi';
      case 'laporan selesai':
        return 'Laporan Selesai';
      case 'laporan ditolak':
        return 'Laporan Ditolak';
      case 'laporan kedaluwarsa':
        return 'Laporan Kedaluwarsa';
      default:
        return null;
    }
  };

  const getStatusIcon = (status: any) => {
    switch (status) {
      case 'dalam antrian':
        return <IconWaktu />;
      case 'investigasi':
        return <IconSedangDitindak />;
      case 'laporan selesai':
        return <IconCentang />;
      case 'laporan ditolak':
        return <IconTolak />;
      case 'laporan kedaluwarsa':
        return <IconKedaluwarsa />;
      default:
        return '';
    }
  };

  function greeting(date: Date) {
    const currentHour = date.getHours();

    if (currentHour >= 3 && currentHour < 11) {
      return 'Selamat Pagi';
    } else if (currentHour >= 11 && currentHour < 15) {
      return 'Selamat Siang';
    } else if (currentHour >= 15 && currentHour < 19) {
      return 'Selamat Sore';
    } else {
      return 'Selamat Malam';
    }
  }

  function formatHour(date: Date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  function formatDate(date: Date) {
    const year = date.getFullYear().toString();
    const month = getMonthName(date.getMonth());
    const day = date.getDate().toString();

    return `${day} ${month} ${year}`;
  }

  function getMonthName(monthIndex: any) {
    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    return monthNames[monthIndex];
  }

  const laporanTerakhir = () => {
    return (
      <View>
        {latestLaporan && latestLaporan.length === 0 ? (
          <View style={styles.cardLaporanTerakhir}>
            <Text style={styles.txtLaporanTerakhir}>
              Anda belum membuat laporan apapun
            </Text>
            <TouchableOpacity
              style={styles.createReportButton}
              onPress={() => navigation.navigate('BuatLaporan')}>
              <Text style={styles.createReportButtonText}>
                Tekan disini untuk {'\n'}membuat laporan baru!
              </Text>
              <Image
                source={IconLaporan}
                resizeMode="contain"
                style={{height: 45}}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.txtCardTitle}>Laporan Terakhir Anda</Text>
            {latestLaporan && latestLaporan[0] && (
              <TouchableOpacity
                style={[
                  styles.cardContent,
                  {
                    backgroundColor: getStatusColor(latestLaporan[0].status),
                  },
                ]}
                onPress={() =>
                  navigation.navigate('DetailLaporan', {
                    id_laporan: latestLaporan[0].id_laporan,
                    status: latestLaporan[0].status,
                  })
                }>
                <View style={{flexDirection: 'row', columnGap: 20}}>
                  <Image
                    source={
                      latestLaporan[0].gambar
                        ? {uri: latestLaporan[0].gambar}
                        : ImagePlaceHolder
                    }
                    style={styles.cardImage}
                  />
                  <View style={{width: 150}}>
                    <Text style={styles.txtCardTime}>
                      {formatHour(
                        new Date(latestLaporan[0].tanggal_laporan_dikirim),
                      )}
                    </Text>
                    <Text style={styles.txtCard}>
                      {formatDate(
                        new Date(latestLaporan[0].tanggal_laporan_dikirim),
                      )}
                    </Text>
                    <Text style={styles.txtCardStatus}>
                      {convertStatus(latestLaporan[0].status)}
                    </Text>
                  </View>
                </View>
                {getStatusIcon(latestLaporan[0].status)}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  const riwayatLaporan = () => {
    return (
      <View style={styles.card}>
        <Text style={styles.txtCardTitle}>Riwayat Laporan</Text>
        {latestLaporan.slice(1, 3).map((item: any, index) => (
          <TouchableOpacity
            style={[
              styles.cardContent,
              {
                backgroundColor: getStatusColor(item.status),
              },
            ]}
            key={index}
            onPress={() =>
              navigation.navigate('DetailLaporan', {
                id_laporan: item.id_laporan,
                status: item.status,
              })
            }>
            <View style={{flexDirection: 'row', columnGap: 20}}>
              <Image
                source={item.gambar ? {uri: item.gambar} : ImagePlaceHolder}
                style={styles.cardImage}
              />
              <View style={{width: 150}}>
                <Text style={styles.txtCardTime}>
                  {formatHour(new Date(item.tanggal_laporan_dikirim))}
                </Text>
                <Text style={styles.txtCard}>
                  {formatDate(new Date(item.tanggal_laporan_dikirim))}
                </Text>
                <Text style={styles.txtCardStatus}>
                  {convertStatus(item.status)}
                </Text>
              </View>
            </View>
            {getStatusIcon(item.status)}
          </TouchableOpacity>
        ))}
        <Pressable
          style={styles.cardFooter}
          onPress={() => {
            navigation.navigate('History');
          }}>
          <Text
            style={{
              fontFamily: MyFont.Primary,
              fontSize: 14,
              color: MyColor.Light,
            }}>
            Lihat lebih lengkap di menu riwayat
          </Text>
          <IconPanahKanan />
        </Pressable>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header backgroundTransparent />
      <Gap height={20} />
      <View style={styles.container1}>
        <Text style={styles.txtWelcome}>
          {greeting(today)},{'\n'}
          <Text style={styles.txtName}>{name}</Text>
        </Text>
        <Gap height={10} />
        {laporanTerakhir()}
        <Gap height={20} />
        {latestLaporan && latestLaporan.length > 1 ? riwayatLaporan() : null}
        <Gap height={20} />
        <View style={styles.card}>
          <Text style={styles.txtCardTitle}>Berita Kesehatan</Text>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              color: MyColor.Primary,
              fontSize: 20,
              width: '100%',
              padding: 20,
            }}>
            Belum ada berita saat ini
          </Text>
          {/* <View
            style={{
              backgroundColor: MyColor.Light,
              flexDirection: 'row',
              columnGap: 10,
              height: 'auto',
            }}>
            <Image
              source={dummyCardData.gambar}
              resizeMode="contain"
              style={{width: 100}}
            />
            <View style={{flex: 1, maxHeight: 68}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Bold',
                  fontSize: 12,
                  color: '#212121',
                }}>
                {dummyCardData.judul}
              </Text>
              <Text
                style={{
                  fontFamily: MyFont.Primary,
                  fontSize: 10,
                  color: '#212121',
                }}>
                {dummyCardData.tanggal}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Italic',
                  fontSize: 10,
                  color: '#212121',
                }}>
                {dummyCardData.sumber}
              </Text>
            </View>
          </View> */}
          <Pressable style={styles.cardFooter}>
            <Text
              style={{
                fontFamily: MyFont.Primary,
                fontSize: 12,
                color: MyColor.Light,
              }}
              onPress={() => navigation.navigate('News')}>
              Lihat informasi & berita kesehatan lainnya
            </Text>
            <IconPanahKanan />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  container1: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  cardLaporanTerakhir: {
    borderRadius: 20,
    flexWrap: 'wrap',
    minHeight: 119,
    backgroundColor: MyColor.Primary,
  },
  txtLaporanTerakhir: {
    padding: 20,
    fontFamily: MyFont.Primary,
    fontSize: 11,
    color: '#fff',
  },
  createReportButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  createReportButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#fff',
  },
  card: {
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    flexWrap: 'wrap',
    minHeight: 114,
    maxHeight: 'auto',
    borderRadius: 20,
  },
  cardImage: {
    resizeMode: 'cover',
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  txtWelcome: {
    color: 'black',
    fontFamily: MyFont.Primary,
    fontSize: 16,
  },
  txtName: {
    color: MyColor.Primary,
    fontFamily: 'Poppins-Bold',
    fontSize: 21,
  },
  txtCardTitle: {
    fontFamily: MyFont.Primary,
    fontSize: 17,
    color: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  txtCard: {
    fontSize: 11,
    color: 'white',
    fontFamily: MyFont.Primary,
  },
  txtCardTime: {
    fontSize: 14,
    color: 'white',
    fontFamily: MyFont.Primary,
  },
  txtCardStatus: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  cardContent: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 120,
    width: '100%',
  },
  cardFooter: {
    backgroundColor: MyColor.Primary,
    padding: 10,
    flexDirection: 'row',
    columnGap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
