import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  IconCentang,
  IconKedaluwarsa,
  IconSedangDitindak,
  IconTolak,
  IconWaktu,
} from '../../assets/icons';
import {MyColor} from '../../components/atoms/MyColor';
import Header from '../../components/molecules/Header';
import {MyFont} from '../../components/atoms/MyFont';
import Gap from '../../components/atoms/Gap';
import {ImagePlaceHolder} from '../../assets/images';
import axios from 'axios';
import Title from '../../components/atoms/Title';
import {useSelector} from 'react-redux';
import {API_HOST} from '../../../config';

const DetailLaporan = ({navigation, route}: any) => {
  const token = useSelector((data: any) => data.token);
  const [laporanDetail, setLaporanDetail] = useState<any | null>(null);
  const {id_laporan, status} = route.params;

  useEffect(() => {
    getLaporan();
  }, []);

  const getLaporan = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(
        `${API_HOST}/api/laporan/detail/${id_laporan}?status=${status}`,
        {headers},
      );
      setLaporanDetail(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

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
      case 'laporan kedaluwarsa':
        return '#3A3A3A';
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
      case 'laporan kedaluwarsa':
        return 'Laporan Kedaluwarsa';
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
      case 'laporan kedaluwarsa':
        return <IconKedaluwarsa />;
      default:
        return null;
    }
  };

  const formatDateTime = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <View
        key={laporanDetail?.id_laporan}
        style={[
          styles.statusLaporan,
          {backgroundColor: getStatusColor(laporanDetail?.status)},
        ]}>
        <Text style={styles.txtCardStatus}>
          {convertStatus(laporanDetail?.status)}
        </Text>
        <View>{getStatusIcon(laporanDetail?.status)}</View>
      </View>

      {laporanDetail && laporanDetail.status === 'laporan selesai' && (
        <View style={styles.detailLaporan}>
          <Text style={styles.txtCard}>Jenis Insiden</Text>
          <Text style={[styles.txtCard, {fontFamily: 'Poppins-Bold'}]}>
            {laporanDetail && laporanDetail.jenis_insiden}
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
        <Text style={styles.txtKey}>Nama Pasien</Text>
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
          </View>
        )}
        <Gap height={20} />
      </View>
    </ScrollView>
  );
};

export default DetailLaporan;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  container1: {
    padding: 20,
  },
  statusLaporan: {
    height: 91,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
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
  txtGrading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
    color: MyColor.Light,
    textTransform: 'capitalize',
  },
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
    borderRadius: 20,
  },
  img: {
    height: 350,
    aspectRatio: 1,
    // borderRadius: 20,
    resizeMode: 'contain',
    backgroundColor: 'black',
    alignSelf: 'center',
  },
});
