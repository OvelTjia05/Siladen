import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import Header from '../../components/molecules/Header';
import {MyColor} from '../../components/atoms/MyColor';
import {
  IconCentang,
  IconDropDown,
  IconKedaluwarsa,
  IconPrint,
  IconSedangDitindak,
  IconWaktu,
} from '../../assets/icons';
import axios from 'axios';
import {MyFont} from '../../components/atoms/MyFont';
import Gap from '../../components/atoms/Gap';
import Line from '../../components/atoms/Line';
import RNPrint from 'react-native-print';
import {saveMonthAction, saveYearAction} from '../../../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import {API_HOST} from '../../../config';

type JumlahLaporan = {
  jumlah_keseluruhan: number;
  jumlah_laporan_dalam_antrian: number;
  jumlah_laporan_kedaluwarsa: number;
  jumlah_laporan_investigasi: number;
  jumlah_laporan_selesai: number;
};

const AdminHistoryItems = ({navigation, route}: any) => {
  const tokenSelector = useSelector((data: any) => data.token);
  const month = useSelector((data: any) => data.month);
  const year = useSelector((data: any) => data.year);
  const dispatch = useDispatch();
  const dataUser = {
    token: tokenSelector,
  };
  const [jumlahLaporan, setJumlahLaporan] = useState<JumlahLaporan | null>(
    null,
  );
  const today = new Date();
  const [isFilter, setIsFilter] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getJumlahLaporan();
    }, [month, year]),
  );

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'AdminHomepage'}],
          }),
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  const getJumlahLaporan = async () => {
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${dataUser.token}`,
      };

      const response = await axios.get(
        `${API_HOST}/api/laporan/amount?month=${
          selectedMonth + 1
        }&year=${selectedYear}`,
        {headers},
      );
      setIsLoading(false);
      setJumlahLaporan(response.data.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const printPDF = async () => {
    await RNPrint.print({
      html: `<h1>Halo</h1><h2>Heading 2</h2><h3>Heading 3</h3>`,
    });
  };

  const handleFilter = () => {
    dispatch(saveMonthAction(selectedMonth));
    dispatch(saveYearAction(selectedYear));
    setIsFilter(false);
  };

  const renderBulan = () => {
    const data = Array.from({length: 12}, (_, index) => index);

    return data.map(item => (
      <Pressable
        key={item}
        style={[
          styles.modalItems,
          {
            backgroundColor:
              selectedMonth === item ? MyColor.Primary : MyColor.Light,
          },
        ]}
        onPress={() => setSelectedMonth(item)}>
        <Text
          style={{
            color: selectedMonth === item ? MyColor.Light : MyColor.Primary,
            fontFamily: MyFont.Primary,
          }}>
          {formatBulan(item)}
        </Text>
      </Pressable>
    ));
  };

  const renderTahun = () => {
    const startYear = 2023;
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      {length: currentYear - startYear + 1},
      (_, index) => (startYear + index).toString(),
    );

    return (
      <View
        style={[
          styles.modalItemsContainer,
          {
            alignSelf: years.length < 3 ? 'flex-start' : 'center',
          },
        ]}>
        {years.map(year => (
          <Pressable
            key={year}
            style={[
              styles.modalItems,
              {
                backgroundColor:
                  selectedYear === year ? MyColor.Primary : MyColor.Light,
              },
            ]}
            onPress={() => setSelectedYear(year)}>
            <Text
              style={{
                color: selectedYear === year ? MyColor.Light : MyColor.Primary,
                fontFamily: MyFont.Primary,
              }}>
              {year}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const formatBulan = (data: any) => {
    switch (data) {
      case 0:
        return 'Jan';
      case 1:
        return 'Feb';
      case 2:
        return 'Mar';
      case 3:
        return 'Apr';
      case 4:
        return 'Mei';
      case 5:
        return 'Juni';
      case 6:
        return 'Juli';
      case 7:
        return 'Agu';
      case 8:
        return 'Sept';
      case 9:
        return 'Okt';
      case 10:
        return 'Nov';
      case 11:
        return 'Des';
      default:
        return getMonthName(today.getMonth());
    }
  };

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

  const handleNavigate = (options: string) => {
    navigation.navigate('AdminHistoryByStatus', {
      status: options,
      month: month,
      year: year,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header backgroundTransparent />
      <View style={styles.content}>
        <View
          style={{
            backgroundColor: MyColor.Light,
            borderRadius: 20,
            overflow: 'hidden',
          }}>
          <TouchableOpacity
            style={[
              styles.card,
              {
                paddingHorizontal: 40,
                backgroundColor: MyColor.Primary,
                justifyContent: 'flex-start',
              },
            ]}
            onPress={() => {
              setIsFilter(true);
            }}>
            <Text
              style={[
                styles.txtBold,
                {fontSize: 17, flex: 1, textAlign: 'center'},
              ]}>
              {getMonthName(month)} {selectedYear}
            </Text>
            <IconDropDown fill={`${MyColor.Light}`} />
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            visible={isFilter}
            onRequestClose={() => {
              setIsFilter(false);
            }}>
            <View style={styles.modalBackground}>
              <View style={styles.modal}>
                <View style={styles.modalContent}>
                  <Text style={styles.txtModal}>Bulan</Text>
                  <View style={styles.modalItemsContainer}>
                    {renderBulan()}
                  </View>
                  <Gap height={20} />
                  <Text style={styles.txtModal}>Tahun</Text>
                  {renderTahun()}
                  <Gap height={20} />
                  <View style={{flexDirection: 'row', gap: 10}}>
                    <Pressable
                      style={styles.modalItems}
                      onPress={() => {
                        setIsFilter(false),
                          setSelectedMonth(month),
                          setSelectedYear(year);
                      }}>
                      <Text
                        style={[styles.txtModal, {fontFamily: MyFont.Primary}]}>
                        Batal
                      </Text>
                    </Pressable>
                    {isLoading ? (
                      <ActivityIndicator size="large" color={MyColor.Primary} />
                    ) : (
                      <Pressable
                        style={[styles.modalItems, {flex: 1}]}
                        onPress={() => handleFilter()}>
                        <Text
                          style={[
                            styles.txtModal,
                            {fontFamily: MyFont.Primary},
                          ]}>
                          OK
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          <View style={{paddingHorizontal: 10}}>
            <TouchableOpacity
              style={[styles.card, {backgroundColor: MyColor.Primary}]}
              onPress={() => {
                handleNavigate('dalam antrian');
              }}>
              <View>
                <Text style={styles.txtBold}>Dalam Antrian</Text>
                <IconWaktu />
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.txtJumlah}>
                  {jumlahLaporan?.jumlah_laporan_dalam_antrian}
                </Text>
                <Text style={styles.txt}>Laporan</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.card, {backgroundColor: '#A37F00'}]}
              onPress={() => {
                handleNavigate('investigasi');
              }}>
              <View>
                <Text style={styles.txtBold}>Sedang Di Investigasi</Text>
                <IconSedangDitindak />
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.txtJumlah}>
                  {jumlahLaporan?.jumlah_laporan_investigasi}
                </Text>
                <Text style={styles.txt}>Laporan</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.card, {backgroundColor: '#008656'}]}
              onPress={() => {
                handleNavigate('laporan selesai');
              }}>
              <View>
                <Text style={styles.txtBold}>Laporan Selesai</Text>
                <IconCentang />
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.txtJumlah}>
                  {jumlahLaporan?.jumlah_laporan_selesai}
                </Text>
                <Text style={styles.txt}>Laporan</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.card, {backgroundColor: '#3A3A3A'}]}
              onPress={() => {
                handleNavigate('laporan kedaluwarsa');
              }}>
              <View>
                <Text style={styles.txtBold}>Laporan Kedaluwarsa</Text>
                <IconKedaluwarsa />
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.txtJumlah}>
                  {jumlahLaporan?.jumlah_laporan_kedaluwarsa}
                </Text>
                <Text style={styles.txt}>Laporan</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{padding: 20}}>
            <Line height={3} />
          </View>
          <View style={[styles.card, {flexDirection: 'column'}]}>
            <Text style={styles.txt2}>
              Total semua laporan ke RSUD Dr. Sam Ratulangi Tondano di bulan{' '}
              <Text style={{fontFamily: 'Poppins-Bold'}}>
                {getMonthName(month)} {year}
              </Text>
            </Text>
            <Text style={[styles.txtJumlah, {color: 'black'}]}>
              {jumlahLaporan?.jumlah_keseluruhan}
            </Text>
            <Text style={[styles.txt, {color: 'black'}]}>Laporan</Text>
          </View>
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Line height={3} />
          </View>
          {/* <View style={{padding: 10}}>
            <Pressable
              onPress={printPDF}
              style={[
                styles.card,
                {
                  backgroundColor: MyColor.Primary,
                  justifyContent: 'space-evenly',
                },
              ]}>
              <Text
                style={[
                  styles.txt,
                  {
                    fontSize: 16,
                    width: '70%',
                  },
                ]}>
                Cetak Laporan{' '}
                <Text style={{fontFamily: 'Poppins-Bold'}}>
                  Bulan {getMonthName(selectedMonth)} {selectedYear}
                </Text>{' '}
                ke PDF
              </Text>
              <IconPrint />
            </Pressable>
          </View> */}
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminHistoryItems;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 350,
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: MyColor.Primary,
    backgroundColor: MyColor.Light,
    padding: 20,
    alignSelf: 'center',
  },
  modalContent: {
    maxWidth: 272,
    alignSelf: 'center',
  },
  modalItemsContainer: {
    maxWidth: 272,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignSelf: `center`,
  },
  modalItems: {
    alignItems: 'center',
    width: 84,
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
  txt: {
    fontFamily: MyFont.Primary,
    fontSize: 14,
    color: MyColor.Light,
  },
  txt2: {
    textAlign: 'center',
    fontFamily: MyFont.Primary,
    fontSize: 17,
    color: 'black',
  },
  txtBold: {
    fontFamily: 'Poppins-Bold',
    color: MyColor.Light,
    fontSize: 14,
  },
  txtModal: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: MyColor.Primary,
  },
  txtJumlah: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: MyColor.Light,
    height: 40,
  },
});
