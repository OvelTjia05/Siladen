import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import Header from '../../components/molecules/Header';
import {
  IconCentang,
  IconKedaluwarsa,
  IconSedangDitindak,
  IconTolak,
  IconWaktu,
} from '../../assets/icons';
import {MyColor} from '../../components/atoms/MyColor';
import {MyFont} from '../../components/atoms/MyFont';
import {ImagePlaceHolder} from '../../assets/images';
import {useSelector} from 'react-redux';
import {API_HOST} from '../../../config';

type Laporan = {
  id_laporan: string;
  nama_pasien: string;
  insiden: string;
  tanggal_laporan_dikirim: Date;
  gambar: string;
  status: string;
};

const AdminHistoryByStatus = ({navigation, route}: any) => {
  const {status, month, year} = route.params;
  const tokenSelector = useSelector((data: any) => data.token);

  const dataUser = {
    token: tokenSelector,
  };
  const [laporanList, setLaporanList] = useState<Laporan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getLaporan();
      // console.log('ini di status', route.params);
    }, []),
  );

  const getLaporan = async () => {
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${dataUser.token}`,
      };
      const response = await axios.get(
        `${API_HOST}/api/laporan?status=${status}&month=${
          month + 1
        }&year=${year}`,
        {headers},
      );
      setIsLoading(false);
      setLaporanList(response.data.data);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Terjadi kesalahan saat memuat data',
        'Pastikan anda telah terhubung ke internet lalu coba lagi atau restart aplikasi',
        [
          {
            text: 'Coba Lagi',
            onPress: () => {
              getLaporan();
            },
          },
        ],
      );
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

  const formatDateTime = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = getMonthName(date.getMonth());
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} - ${day} ${month} ${year}`;
  };

  function getMonthName(monthIndex: number) {
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header backgroundTransparent />
      <View style={[styles.status, {backgroundColor: getStatusColor(status)}]}>
        <View
          style={{
            flexDirection: 'row',
            columnGap: 20,
            maxWidth: '80%',
            alignItems: 'center',
          }}>
          {getStatusIcon(status)}
          <Text style={styles.txtStatus}>{convertStatus(status)}</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.txtJumlah}>{laporanList?.length}</Text>
          <Text style={styles.txt}>Laporan</Text>
        </View>
      </View>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={MyColor.Primary} />
        </View>
      ) : (
        <>
          {laporanList.map((item, index) => (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                columnGap: 10,
                height: 134,
                paddingHorizontal: 20,
                paddingVertical: 10,
                alignItems: 'center',
                backgroundColor: index % 2 === 0 ? '#fff' : 'transparent',
                // marginBottom: 20,
              }}
              key={index}
              onPress={() => {
                navigation.navigate('AdminHistoryDetail', {
                  id_laporan: item.id_laporan,
                  status: item.status,
                });
              }}>
              <Image
                source={item.gambar ? {uri: item.gambar} : ImagePlaceHolder}
                style={styles.img}
              />
              <View style={{flex: 1}}>
                <Text style={styles.txt2}>{item.nama_pasien}</Text>
                <Text style={[styles.txt2, {fontFamily: 'Poppins-Bold'}]}>
                  {formatDateTime(new Date(item.tanggal_laporan_dikirim))}
                </Text>
                <Text
                  style={[styles.txt2, {fontSize: 11}]}
                  ellipsizeMode="tail"
                  numberOfLines={3}>
                  {item.insiden}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
};

export default AdminHistoryByStatus;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  status: {
    paddingHorizontal: 20,
    height: 97,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  img: {
    resizeMode: 'cover',
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  txt: {
    fontFamily: MyFont.Primary,
    fontSize: 14,
    color: MyColor.Light,
  },
  txt2: {
    fontFamily: MyFont.Primary,
    fontSize: 16,
    color: 'black',
  },
  txtStatus: {
    flex: 1,
    fontFamily: 'Poppins-Bold',
    color: MyColor.Light,
    fontSize: 17,
  },
  txtJumlah: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: MyColor.Light,
    height: 40,
  },
});
