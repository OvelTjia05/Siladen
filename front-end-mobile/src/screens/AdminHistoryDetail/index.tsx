import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  IconCentang,
  IconDropDown,
  IconSedangDitindak,
  IconTolak,
  IconWaktu,
} from '../../assets/icons';
import {MyColor} from '../../components/atoms/MyColor';
import Header from '../../components/molecules/Header';
import {MyFont} from '../../components/atoms/MyFont';
import Gap from '../../components/atoms/Gap';
import {Ilustrasi, ImagePlaceHolder} from '../../assets/images';
import axios from 'axios';
import Title from '../../components/atoms/Title';
import {API_HOST} from '../../../config';
import Line from '../../components/atoms/Line';
import Button from '../../components/atoms/Button';
import {useSelector} from 'react-redux';
import socket from '../../../socket';

const AdminHistoryDetail = ({navigation, route}: any) => {
  const windowWidth = Dimensions.get('window').width;

  // const {id_laporan, dataUser} = route.params;
  const {id_laporan} = route.params;

  const tokenSelector = useSelector((data: any) => data.token);

  const dataUser = {
    token: tokenSelector,
  };

  const [status, setStatus] = useState(route.params.status);
  const [laporanDetail, setLaporanDetail] = useState<any | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedJenisInsiden, setSelectedJenisInsiden] = useState(
    'Kejadian Nyaris Cedera / KNC (Near miss)',
  );
  const [selectedGrading, setSelectedGrading] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getLaporan();
    console.log(
      'ini di admin detail laporan: ',
      dataUser,
      id_laporan,
      status,
      laporanDetail,
    );
  }, []);

  const getLaporan = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${dataUser.token}`,
      };
      const response = await axios.get(
        `${API_HOST}/api/laporan/detail/${id_laporan}?status=${status}`,
        {headers},
      );
      console.log('ini status di getlaporan: ', status);
      setLaporanDetail(response.data.data);
      console.log('ini response.data.data', response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateStatus = async (id_user: string) => {
    console.log('ini eee id USER PARAH: ', id_user);
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${dataUser.token}`,
      };
      const response = await axios.patch(
        `${API_HOST}/api/laporan/status/investigasi/${id_laporan}`,
        null,
        {headers},
      );
      getLaporan();
      console.log('ini updated status: ', response.data);
      const data = {
        id_user,
        message: 'laporan ini sedang diinvestigasi',
      };
      socket.emit('new message', data);
      navigation.navigate('AdminHistoryItems', dataUser);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getLaporan();
    console.log('status: ', status);
  }, [status]);

  const handleTolak = async (id_user: string) => {
    if (!selectedGrading) {
      Alert.alert('Harap pilih jenis insiden dan grading');
    }
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${dataUser.token}`,
      };
      const response = await axios.patch(
        `${API_HOST}/api/laporan/status/tolak/${id_laporan}`,
        {
          jenis_insiden: selectedJenisInsiden,
          grading_risiko_kejadian: selectedGrading,
        },
        {headers},
      );
      if (response.data.success === true) {
        const data = {
          id_user,
          message: 'laporan ini ditolak',
        };
        socket.emit('new message', data);
        setStatus('laporan ditolak');
      }
      console.log('ini updated status: ', response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleSelesai = async (id_user: string) => {
    if (!selectedGrading) {
      Alert.alert('Harap pilih jenis insiden dan grading');
    }
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${dataUser.token}`,
      };
      const response = await axios.patch(
        `${API_HOST}/api/laporan/status/selesai/${id_laporan}`,
        {
          jenis_insiden: selectedJenisInsiden,
          grading_risiko_kejadian: selectedGrading,
        },
        {headers},
      );
      if (response.data.success === true) {
        const data = {
          id_user,
          message: 'laporan ini selesai',
        };
        socket.emit('new message', data);
        setStatus('laporan ditolak');
        setStatus('laporan selesai');
      }
      console.log('ini updated status: ', response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(selectedGrading, selectedJenisInsiden);
  }, [selectedGrading]);

  const getStatusColor = (status: string) => {
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
        return `transparent`;
    }
  };

  const getGradingColor = (grade: string) => {
    switch (grade) {
      case 'biru':
        return MyColor.Primary;
      case 'kuning':
        return '#A37F00';
      case 'hijau':
        return '#008656';
      case 'merah':
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
        return ' ';
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
        return null;
    }
  };

  const handleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const formatDateTime = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
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

  const dataDummy = {
    jenis_insiden: 'Kejadian Tidak Diharapkan / KTD (Adverse Event)',
    grading_risiko_kejadian: 'kuning',
    tanggal_laporan_diterima: '2023-09-18T05:08:52.000Z',
  };

  const renderJenisInsiden = (option: string) => (
    <TouchableOpacity
      style={{marginTop: 10}}
      onPress={() => {
        setSelectedJenisInsiden(option);
        setIsExpanded(!isExpanded);
      }}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.txtCard}>- </Text>
        <Text style={styles.txtCard}>{option}</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    console.log('Ini jenis insiden: ', selectedJenisInsiden);
    console.log('ini grading: ', selectedGrading);
  }, [selectedGrading, selectedJenisInsiden]);

  const renderGradingButton = (option: string) => (
    <TouchableOpacity
      style={[
        styles.gradingBtn,
        {
          borderWidth: selectedGrading === option ? 2 : 0,
          backgroundColor:
            selectedGrading === option
              ? MyColor.Light
              : getGradingColor(option),
          borderColor:
            selectedGrading === option
              ? getGradingColor(option)
              : MyColor.Light,
        },
      ]}
      onPress={() => {
        setSelectedGrading(option);
      }}>
      <Text
        style={[
          styles.txtCard,
          {
            color:
              selectedGrading === option
                ? getGradingColor(option)
                : MyColor.Light,
            textTransform: 'capitalize',
          },
        ]}>
        {option}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <View
        style={[
          styles.statusLaporan,
          {backgroundColor: getStatusColor(laporanDetail?.status)},
        ]}>
        <Text style={styles.txtCardStatus}>
          {convertStatus(laporanDetail?.status)}
        </Text>
        <View>{getStatusIcon(laporanDetail?.status)}</View>
      </View>

      {laporanDetail && (
        <View style={styles.detailLaporan}>
          <Text style={styles.txtCard}>Jenis Insiden</Text>
          <Text style={[styles.txtCard, {fontFamily: 'Poppins-Bold'}]}>
            {laporanDetail.jenis_insiden}
          </Text>
          <Gap height={10} />
          <View style={styles.gradingContainer}>
            <Text style={styles.txtCard}>Grading Laporan</Text>
            <View
              style={[
                styles.grading,
                {
                  backgroundColor: getGradingColor(
                    laporanDetail.grading_risiko_kejadian,
                  ),
                },
              ]}>
              <Text style={styles.txtGrading}>
                {laporanDetail.grading_risiko_kejadian}
              </Text>
            </View>
          </View>
        </View>
      )}
      <View style={styles.container1}>
        <Gap height={30} />
        <Title label="Data Karakteristik Pasien" />
        <Text style={styles.txtKey}>Nama</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>{laporanDetail?.nama_pasien}</Text>
        </View>
        <Text style={styles.txtKey}>Nomor MR</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>{laporanDetail?.no_rekam_medis}</Text>
        </View>
        <Text style={styles.txtKey}>Ruangan</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>{laporanDetail?.ruangan}</Text>
        </View>
        <Text style={styles.txtKey}>Umur</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>{laporanDetail?.umur}</Text>
        </View>
        <Text style={styles.txtKey}>Penanggung biaya pasien</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>{laporanDetail?.asuransi}</Text>
        </View>
        <Text style={styles.txtKey}>Jenis Kelamin</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>
            {laporanDetail?.jenis_kelamin_pasien}
          </Text>
        </View>
        <Text style={styles.txtKey}>Waktu mendapatkan pelayanan</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>
            {laporanDetail &&
              formatDateTime(
                new Date(laporanDetail.waktu_mendapatkan_pelayanan),
              )}
          </Text>
        </View>
        <Gap height={40} />
        <Title label="Rincian Kejadian" />
        <Text style={styles.txtKey}>Waktu Insiden</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>
            {laporanDetail &&
              formatDateTime(new Date(laporanDetail.waktu_kejadian_insiden))}
          </Text>
        </View>
        <Text style={styles.txtKey}>Insiden</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>{laporanDetail?.insiden}</Text>
        </View>
        <Text style={styles.txtKey}>Kronologis Insiden</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>
            {laporanDetail?.kronologis_insiden}
          </Text>
        </View>
        <Text style={styles.txtKey}>Insiden yang terjadi pada pasien</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>
            {laporanDetail?.insiden_terjadi_pada_pasien}
          </Text>
        </View>
        <Text style={styles.txtKey}>Dampak insiden terhadap pasien</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>
            {laporanDetail?.dampak_insiden_terhadap_pasien}
          </Text>
        </View>
        <Text style={styles.txtKey}>Probabilitas</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>{laporanDetail?.probabilitas}</Text>
        </View>
        <Text style={styles.txtKey}>Orang pertama yang melaporkan insiden</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>
            {laporanDetail?.orang_pertama_melaporkan_insiden}
          </Text>
        </View>
        <Text style={styles.txtKey}>Insiden menyangkut pasien</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>{laporanDetail?.jenis_pasien}</Text>
        </View>
        <Text style={styles.txtKey}>Tempat Insiden</Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>{laporanDetail?.tempat_insiden}</Text>
        </View>
        <Text style={styles.txtKey}>
          Unit / Departemen terkait yang menyebabkan insiden
        </Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>
            {laporanDetail?.departement_penyebab_insiden}
          </Text>
        </View>
        <Text style={styles.txtKey}>
          Tindak lanjut yang dilakukan segera setelah kejadian, dan hasilnya
        </Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>
            {laporanDetail?.tindak_lanjut_setelah_kejadian_dan_hasil}
          </Text>
        </View>
        <Text style={styles.txtKey}>
          Tindak lanjut setelah insiden, dilakukan oleh
        </Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>
            {laporanDetail?.yang_melakukan_tindak_lanjut_setelah_insiden}
          </Text>
        </View>
        <Text style={styles.txtKey}>
          Apakah kejadian yang sama pernah terjadi di Unit Kerja lain? Jika YA,
          Kapan? Dan langkah/ tindakan apa yang telah diambil pada unit kerja
          tersebut untuk mencegah terulangnya kejadian yang sama?
        </Text>
        <View style={styles.box}>
          <Text style={styles.txtValue}>
            {laporanDetail?.kejadian_sama_pernah_terjadi_di_unit_lain}
          </Text>
        </View>
        <Gap height={40} />
        <Title label="Foto Pendukung" />
        {laporanDetail && (
          <View style={styles.boxImage}>
            <Image
              source={
                laporanDetail.gambar
                  ? {uri: laporanDetail.gambar}
                  : ImagePlaceHolder
              }
              style={styles.img}
            />
            {/* <Text>{laporanDetail.gambar}</Text> */}
            <Text style={styles.txtImage}>
              {laporanDetail.gambar
                ? laporanDetail.gambar.split('/').pop()
                : 'Tidak ada gambar'}
            </Text>
          </View>
        )}
        <Gap height={40} />
      </View>
      {laporanDetail?.status === 'dalam antrian' ? (
        // Tampilan untuk kondisi 'dalam antrian'
        isLoading ? (
          <View style={{alignSelf: 'center', padding: 30}}>
            <ActivityIndicator size="large" color={MyColor.Primary} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.statusLaporan2}
            onPress={() => handleUpdateStatus(laporanDetail?.id_user)}>
            <Text style={styles.txtCardStatus}>Investigasi</Text>
            <View>{getStatusIcon('investigasi')}</View>
          </TouchableOpacity>
        )
      ) : laporanDetail?.status === 'investigasi' ? (
        // Tampilan untuk kondisi 'investigasi'
        isLoading ? (
          <View style={{alignSelf: 'center', padding: 30}}>
            <ActivityIndicator size="large" color={MyColor.Primary} />
          </View>
        ) : (
          <View style={{backgroundColor: '#A37F00', padding: 30}}>
            <Text style={[styles.txtCard, {color: MyColor.Light}]}>
              Jenis Insiden
            </Text>
            <View style={styles.jenisLaporanContainer}>
              <TouchableOpacity
                onPress={handleExpand}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.txtCard}>{selectedJenisInsiden}</Text>
                <IconDropDown />
              </TouchableOpacity>
              {isExpanded && (
                <View style={{backgroundColor: MyColor.Light}}>
                  {renderJenisInsiden(
                    'Kejadian Nyaris Cedera / KNC (Near miss)',
                  )}
                  {renderJenisInsiden(
                    'Kejadian Tidak diharapkan / KTD (Adverse Event)',
                  )}
                  {renderJenisInsiden('Kejadian Sentinel (Sentinel Event)')}
                  {renderJenisInsiden('Kejadian Tidak Cedera / KTC')}
                  {renderJenisInsiden(
                    'Kondisi Potensi cedera serius (significant) (KPC)',
                  )}
                </View>
              )}
            </View>
            <Gap height={20} />
            <Text style={[styles.txtCard, {color: MyColor.Light}]}>
              Grading Laporan
            </Text>
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                backgroundColor: MyColor.Light,
                borderRadius: 10,
              }}>
              {renderGradingButton('biru')}
              {renderGradingButton('hijau')}
              {renderGradingButton('kuning')}
              {renderGradingButton('merah')}
            </View>
            <Gap height={30} />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => handleTolak(laporanDetail?.id_user)}>
                <Text style={styles.txtCardStatus}>Tolak</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, {backgroundColor: '#008656'}]}
                onPress={() => handleSelesai(laporanDetail?.id_user)}>
                <Text style={styles.txtCardStatus}>Selesai</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      ) : null}
    </ScrollView>
  );
};

export default AdminHistoryDetail;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  container1: {
    padding: 20,
  },
  btn: {
    width: 150,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#8D0000',
  },
  activeBtn: {
    backgroundColor: MyColor.Light,
    borderWidth: 1,
  },
  statusLaporan: {
    height: 91,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
  },
  statusLaporan2: {
    backgroundColor: '#A37F00',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    margin: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  detailLaporan: {
    padding: 20,
    backgroundColor: MyColor.Light,
  },
  gradingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    columnGap: 20,
  },
  grading: {
    flex: 1,
    height: 30,
    width: 'auto',
    paddingHorizontal: 10,
  },
  gradingBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: 66,
  },
  jenisLaporanContainer: {
    backgroundColor: MyColor.Light,
    padding: 10,
    borderRadius: 10,
  },
  txt: {
    fontFamily: MyFont.Primary,
    fontSize: 14,
    color: 'black',
  },
  txtKey: {
    fontFamily: MyFont.Primary,
    fontSize: 18,
    color: 'black',
    marginTop: 20,
  },
  txtValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: 'black',
  },
  txtTime: {
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
    color: 'black',
  },
  txtImage: {
    fontFamily: MyFont.Primary,
    fontSize: 12,
    color: 'gray',
    padding: 10,
  },
  txtGrading: {fontFamily: 'Poppins-Bold', fontSize: 17, color: MyColor.Light},
  txtCardStatus: {
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
    color: MyColor.Light,
  },
  txtCard: {
    fontFamily: MyFont.Primary,
    fontSize: 17,
    color: 'black',
  },
  txtIsiLaporan: {
    fontFamily: MyFont.Primary,
    fontSize: 14,
    color: 'black',
  },
  txtBox: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: 'black',
  },
  box: {
    backgroundColor: MyColor.Light,
    paddingVertical: 10,
    paddingHorizontal: 20,
    // width: '90%',
    borderRadius: 10,
    gap: 10,
  },
  boxImage: {
    overflow: 'hidden',
    backgroundColor: MyColor.Light,
    borderRadius: 10,
  },
  img: {
    height: 350,
    aspectRatio: 1,
    resizeMode: 'contain',
    backgroundColor: 'black',
    alignSelf: 'center',
  },
});
