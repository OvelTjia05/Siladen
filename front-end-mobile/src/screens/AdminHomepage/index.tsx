import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../../components/molecules/Header';
import {MyColor} from '../../components/atoms/MyColor';
import Title from '../../components/atoms/Title';
import {MyFont} from '../../components/atoms/MyFont';
import {
  IconCentang,
  IconKedaluwarsa,
  IconLaporan,
  IconRiwayat,
  IconRiwayat2,
  IconSedangDitindak,
  IconSettings,
  IconTolak,
  IconWaktu,
} from '../../assets/icons';
import Gap from '../../components/atoms/Gap';
import {ImagePlaceHolder} from '../../assets/images';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {socket} from '../../../socket';
import PushNotification from 'react-native-push-notification';
import {API_HOST} from '../../../config';

type Laporan = {
  id_laporan: string;
  status: string;
  tanggal_laporan_dikirim: Date;
  gambar: string;
};

const AdminHomepage = ({navigation, route}: any) => {
  const channel_ids = useSelector((data: any) => data.channelId);
  const tokenSelector = useSelector((data: any) => data.token);
  const nameSelector = useSelector((data: any) => data.name);
  const roleSelector = useSelector((data: any) => data.role);
  const jobSelector = useSelector((data: any) => data.job);

  const dataUser = {
    token: tokenSelector,
    name: nameSelector,
    role: roleSelector,
    job: jobSelector,
  };

  const today = new Date();
  const [laporanHariIni, setLaporanHariIni] = useState<Laporan[]>([]);
  const [laporanBulanIni, setLaporanBulanIni] = useState<Laporan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getTodayReports();
      // getCurrentMonthReports();
    }, []),
  );

  useEffect(() => {
    socket.off('admin received');
    socket.emit('join admin', 'admin');
    socket.on('admin received', () => {
      getTodayReports();
    });
  }, []);

  const getTodayReports = async () => {
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${dataUser.token}`,
      };

      const response = await axios.get(`${API_HOST}/api/laporan/current/day`, {
        headers,
      });
      setIsLoading(false);
      setLaporanHariIni(response.data.data);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Terjadi kesalahan saat memuat data',
        'Pastikan anda telah terhubung ke internet lalu coba lagi atau restart aplikasi',
        [
          {
            text: 'Coba Lagi',
            onPress: () => {
              getTodayReports();
            },
          },
        ],
      );
      console.log(error);
    }
  };

  const getCurrentMonthReports = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${dataUser.token}`,
      };

      const response = await axios.get(
        `${API_HOST}/api/laporan/current/month`,
        {headers},
      );
      setLaporanBulanIni(response.data.data);
    } catch (error) {
      console.log(error);
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

  const convertStatus = (status: any) => {
    switch (status) {
      case 'dalam antrian':
        return 'Dalam Antrian';
      case 'investigasi':
        return 'Sedang di Investigasi';
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

  function formatHour(date: any) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  function formatDate(date: any) {
    const year = date.getFullYear().toString();
    const month = getMonthName(date.getMonth());
    const day = date.getDate().toString();

    return `${day} ${month} ${year}`;
  }
  function formatDate2(date: any) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${day}/${month}/${year}`;
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

  const todayReport = () => {
    return (
      <View style={styles.card}>
        <Text style={styles.txtCardTitle}>
          Laporan{' '}
          <Text style={{fontFamily: 'Poppins-Bold'}}>
            hari ini ({formatDate2(today)})
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={MyColor.Primary} />
        ) : laporanHariIni.length === 0 ? (
          <View style={styles.cardNoReport}>
            <Text style={styles.txtTodayReport}>
              Tidak ada laporan hari ini 👏
            </Text>
          </View>
        ) : (
          <View>
            {laporanHariIni.map((item, index) => (
              <TouchableOpacity
                style={[
                  styles.cardContent,
                  {
                    backgroundColor: getStatusColor(item.status),
                  },
                ]}
                key={index}
                onPress={() =>
                  navigation.navigate('AdminHistoryDetail', {
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
                    <Text style={[styles.txtCard, {fontSize: 14}]}>
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
            {laporanHariIni.length >= 10 && (
              <View>
                <Text
                  style={{
                    fontFamily: MyFont.Primary,
                    fontSize: 14,
                    color: 'black',
                    textAlign: 'center',
                    padding: 10,
                  }}>
                  Laporan hari ini telah melebihi 10 laporan. Untuk daftar lebih
                  lengkap, silahkan buka menu daftar semua laporan.
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const currentMonthReport = () => {
    return (
      <View>
        {laporanBulanIni.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.txtCardTitle}>
              Laporan{' '}
              <Text style={{fontFamily: 'Poppins-Bold'}}>
                Bulan {getMonthName(today.getMonth())}
              </Text>
            </Text>
            <View style={styles.cardNoReport}>
              <Text style={styles.txtTodayReport}>
                Tidak ada laporan bulan ini 👏
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.txtCardTitle}>
              Laporan{' '}
              <Text style={{fontFamily: 'Poppins-Bold'}}>
                Bulan {getMonthName(today.getMonth())}
              </Text>
            </Text>
            {laporanBulanIni.map((item, index) => (
              <TouchableOpacity
                style={[
                  styles.cardContent,
                  {
                    backgroundColor: getStatusColor(item.status),
                  },
                ]}
                key={index}
                onPress={() =>
                  navigation.navigate('AdminHistoryDetail', {
                    dataUser: dataUser,
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
                    <Text style={[styles.txtCard, {fontSize: 14}]}>
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
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <Header backgroundTransparent />
      <View style={styles.welcomeUser}>
        <View>
          <Text style={styles.txtWelcome}>{greeting(today)},</Text>
          <Text style={styles.txtUsername}>{dataUser.name}</Text>
          <Text style={styles.txtRole}>
            {dataUser.job ? dataUser.job : null}
          </Text>
        </View>
        <View style={{flexDirection: 'row', columnGap: 20}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AdminHistoryItems', dataUser);
            }}>
            <Image
              source={IconRiwayat}
              resizeMode="contain"
              tintColor={'black'}
              style={{height: 30, width: 30}}
            />
            {/* <IconRiwayat2 fill={'black'} /> */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Settings', dataUser);
            }}>
            <IconSettings fill={'black'} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <Gap height={20} />
        {todayReport()}
        <Gap height={20} />
        {/* {currentMonthReport()} */}
        <Gap height={20} />
      </View>
      <TouchableOpacity
        style={styles.btnReportList}
        onPress={() => navigation.navigate('AdminHistoryItems', dataUser)}>
        <Text style={styles.txtCardStatus}>Daftar Semua Laporan</Text>
        <Image
          source={IconRiwayat}
          resizeMode="contain"
          style={{height: 35}}
          tintColor={MyColor.Light}
        />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AdminHomepage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeUser: {
    backgroundColor: MyColor.Light,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    minHeight: 114,
    maxHeight: 'auto',
    borderRadius: 20,
  },
  cardContent: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 120,
  },
  cardImage: {
    resizeMode: 'cover',
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  cardNoReport: {
    width: '100%',
    minHeight: 119,
    backgroundColor: MyColor.Primary,
  },
  btnReportList: {
    borderRadius: 20,
    backgroundColor: MyColor.Primary,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  txtTodayReport: {
    fontFamily: 'Poppins-Medium',
    padding: 20,
    fontSize: 18,
    color: '#fff',
  },
  txtCardTitle: {
    fontFamily: MyFont.Primary,
    fontSize: 17,
    color: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  txtCard: {
    fontFamily: MyFont.Primary,
    fontSize: 11,
    color: 'white',
  },
  txtCardStatus: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: 'white',
  },
  txtWelcome: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: 'black',
  },
  txtUsername: {
    fontFamily: 'Poppins-Bold',
    fontSize: 21,
    color: MyColor.Primary,
  },
  txtRole: {
    fontFamily: MyFont.Primary,
    fontSize: 15,
    color: MyColor.Primary,
  },
  Icon: {
    tintColor: 'red',
  },
});
