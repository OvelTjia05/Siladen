import React, {useState, useEffect} from 'react';
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
import {Ilustrasi, Ilustrasi1} from '../../assets/images';
import {
  IconCentang,
  IconLaporan,
  IconPanahKanan,
  IconSedangDitindak,
  IconTolak,
  IconWaktu,
} from '../../assets/icons';
import axios from 'axios';

interface Laporan {
  tanggal_laporan_dikirim: Date;
  gambar: string;
  status: string;
}

const HomePage = ({navigation, route}: any) => {
  const today = new Date();
  const [name, setName] = useState('');
  const [latestLaporan, setLatestLaporan] = useState<Laporan[]>([]);
  const dataUser = route.params;

  useEffect(() => {
    setName(dataUser.name);
    getLatestLaporan();
  }, []);

  const getLatestLaporan = async () => {
    if (dataUser.id_user) {
      try {
        console.log(dataUser.token);
        const headers = {
          Authorization: `Bearer ${dataUser.token}`,
        };
        const response = await axios.get(
          `https://backend-pelaporan-final.glitch.me/api/laporan/user/latest/${dataUser.id_user}`,
          {headers},
        );
        setLatestLaporan(response.data.data);
        console.log('ini response.data.data: ', response.data.data);
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
      default:
        return '';
    }
  };

  const riwayat = [
    {
      jenis: 'Radiologi',
      waktu: '19:45',
      tanggal: '2023-02-07',
      status: 'Laporan Selesai',
    },
  ];

  const dummyCardData = {
    gambar: require('../../assets/images/ilustrasi1.png'),
    judul: '4 Strategi Pemerintah kendalikan TB di Indonesia',
    tanggal: '5 September 2021',
    sumber: 'sehatnegeriku.kemkes.go.id',
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
    const localTime = new Date(date.getTime());

    const hours = localTime.getHours().toString().padStart(2, '0');
    const minutes = localTime.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  function formatDate(date: any) {
    const localTime = new Date(date.getTime());

    const year = localTime.getFullYear().toString();
    const month = getMonthName(localTime.getMonth());
    const day = localTime.getDate().toString();

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
              onPress={() => navigation.navigate('BuatLaporan', dataUser)}>
              <Text style={styles.createReportButtonText}>
                Tekan disini untuk {'\n'}membuat laporan baru!
              </Text>
              <Image source={IconLaporan} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.txtCardTitle}>Laporan Terakhir Anda</Text>
            {latestLaporan && latestLaporan[0] && (
              <View
                style={[
                  styles.cardContent,
                  {
                    backgroundColor: getStatusColor(latestLaporan[0].status),
                  },
                ]}>
                <View style={{flexDirection: 'row', columnGap: 20}}>
                  <Image
                    source={{uri: latestLaporan[0].gambar}}
                    style={styles.cardImage}
                  />
                  <View>
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
              </View>
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
          <View
            style={[
              styles.cardContent,
              {
                backgroundColor: getStatusColor(item.status),
              },
            ]}
            key={index}>
            <View style={{flexDirection: 'row', columnGap: 20}}>
              <Image
                source={{
                  uri: item.gambar,
                }}
                style={styles.cardImage}
              />
              <View>
                <Text style={styles.txtCard}>{item.kategori_bidang}</Text>
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
          </View>
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
      <Header />
      <Gap height={20} />
      <View style={styles.container1}>
        <Text style={styles.txtWelcome}>
          {greeting(today)},{'\n'}
          <Text style={styles.txtName}>{name}</Text>
        </Text>
        {laporanTerakhir()}
        <Gap height={20} />
        {latestLaporan && latestLaporan.length > 1 ? riwayatLaporan() : null}
        <Gap height={20} />
        <View style={styles.card}>
          <Text style={styles.txtCardTitle}>Berita Kesehatan</Text>
          <View
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
          </View>
          <Pressable style={styles.cardFooter}>
            <Text
              style={{
                fontFamily: MyFont.Primary,
                fontSize: 12,
                color: MyColor.Light,
              }}>
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
    justifyContent: 'space-between',
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
