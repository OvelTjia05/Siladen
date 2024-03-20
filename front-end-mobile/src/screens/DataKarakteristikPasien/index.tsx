import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput as Input,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import React, {useState, useEffect, useCallback} from 'react';
import Title from '../../components/atoms/Title';
import Button from '../../components/atoms/Button';
import {MyColor} from '../../components/atoms/MyColor';
import {MyFont} from '../../components/atoms/MyFont';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Gap from '../../components/atoms/Gap';
import {useSelector, useDispatch} from 'react-redux';
import {
  saveNamePasienAction,
  saveNoMRAction,
  saveRuanganAction,
  saveAgeAction,
  saveAgeNoAction,
  saveSelectedAgeTypeAction,
  saveAsuransiAction,
  saveJenisKelaminAction,
  saveWaktuMendapatPelayananAction,
  saveWaktuInsidenAction,
  saveInsidenAction,
  saveKronologiInsidenAction,
  saveInsidenTerjadiPadaPasienAction,
  savePelaporPertamaAction,
  savePasienTerkaitAction,
  saveDampakInsidenAction,
  saveLokasiInsidenAction,
  saveProbabilitasAction,
  saveUnitTerkaitAction,
  saveTindakLanjutAction,
  saveTindakLanjutOlehAction,
  saveIsPernahTerjadiAction,
  saveDeskripsiPernahTerjadiAction,
  savePernahTerjadiAction,
  saveImageCameraAction,
  saveInsidenTerjadiPadaPasienOptionAction,
  saveInputPelaporPertamaAction,
  saveInputTindakLanjutOlehAction,
} from '../../../redux/action';
import {socket} from '../../../socket';
import {saveInputPelaporPertama} from '../../../redux/tipe';

const DataKarakteristikPasien = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const idUser = useSelector((data: any) => data.id_user);
  const namePasienSelector = useSelector((data: any) => data.namePasien);
  const noMRSelector = useSelector((data: any) => data.noMR);
  const ruanganSelector = useSelector((data: any) => data.ruangan);
  const ageSelector = useSelector((data: any) => data.age);
  const ageNoSelector = useSelector((data: any) => data.ageNo);
  const selectedAgeTypeSelector = useSelector(
    (data: any) => data.selectedAgeType,
  );
  const asuransiSelector = useSelector((data: any) => data.asuransi);
  const jenisKelaminSelector = useSelector((data: any) => data.jenisKelamin);
  const waktuMendapatPelayananSelector = useSelector(
    (data: any) => data.waktuMendapatPelayanan,
  );
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);

  const dataUser = {
    namePasien: namePasienSelector,
    noMR: noMRSelector,
    ruangan: ruanganSelector,
    age: ageSelector,
    ageNo: ageNoSelector,
    selectedAgeType: selectedAgeTypeSelector,
    asuransi: asuransiSelector,
    jenisKelamin: jenisKelaminSelector,
    waktuMendapatPelayanan: waktuMendapatPelayananSelector,
  };

  const [name, setName] = useState(dataUser.namePasien);
  const [nomorMR, setNomorMR] = useState(dataUser.noMR);
  const [ruangan, setRuangan] = useState(dataUser.ruangan);
  const [age, setAge] = useState(dataUser.age);
  const [ageNo, setAgeNo] = useState(dataUser.ageNo);
  const [selectedAgeType, setSelectedAgeType] = useState(
    dataUser.selectedAgeType,
  );
  const [insurance, setInsurance] = useState(dataUser.asuransi);
  const [gender, setGender] = useState(dataUser.jenisKelamin);
  const [waktuMendapatPelayanan, setWaktuMendapatPelayanan] = useState(
    new Date(dataUser.waktuMendapatPelayanan),
  );

  const isBulanDisabled = Number(ageNo) > 11;
  const isHariDisabled = Number(ageNo) > 30;
  useEffect(() => {
    if (isBulanDisabled || isHariDisabled) {
      setSelectedAgeType('');
    }
  }, [isBulanDisabled, isHariDisabled]);

  useEffect(() => {
    setAge(`${ageNo} ${selectedAgeType}`);
  }, [ageNo, selectedAgeType]);

  function validateForm() {
    return (
      name !== '' &&
      nomorMR !== '' &&
      ruangan !== '' &&
      age.length > 5 &&
      ageNo !== '' &&
      selectedAgeType !== '' &&
      insurance !== '' &&
      gender !== '' &&
      waktuMendapatPelayanan !== null
    );
  }

  const btnUmur = () => {
    const handleAge = (option: string) => {
      setSelectedAgeType(option);
    };

    return (
      <View style={{flexDirection: 'row', columnGap: 5}}>
        <TouchableOpacity
          style={[
            styles.button,
            {width: 79},
            selectedAgeType === 'hari' && styles.selectedButton,
            isHariDisabled && styles.disabledButton,
          ]}
          onPress={() => handleAge('hari')}
          disabled={isHariDisabled} // Menonaktifkan tombol "hari" jika umur > 30
        >
          <Text
            style={[
              styles.txtButton,
              selectedAgeType === 'hari' && styles.txtBtnActive,
            ]}>
            Hari
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {width: 79},
            selectedAgeType === 'bulan' && styles.selectedButton,
            isBulanDisabled && styles.disabledButton,
          ]}
          onPress={() => handleAge('bulan')}
          disabled={isBulanDisabled} // Menonaktifkan tombol "bulan" jika umur > 11
        >
          <Text
            style={[
              styles.txtButton,
              selectedAgeType === 'bulan' && styles.txtBtnActive,
            ]}>
            Bulan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {width: 79},
            selectedAgeType === 'tahun' && styles.selectedButton,
          ]}
          onPress={() => handleAge('tahun')}>
          <Text
            style={[
              styles.txtButton,
              selectedAgeType === 'tahun' && styles.txtBtnActive,
            ]}>
            Tahun
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const btnInsurance = () => {
    const handleInsurance = (option: string) => {
      setInsurance(option);
    };
    return (
      <View style={styles.containerBtn}>
        <TouchableOpacity
          style={[
            styles.button2,
            insurance === 'BPJS' && styles.selectedButton,
          ]}
          onPress={() => handleInsurance('BPJS')}>
          <Text
            style={[
              styles.txtButton,
              insurance === 'BPJS' && styles.txtBtnActive,
            ]}>
            BPJS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button2,
            insurance === 'Jamkesda' && styles.selectedButton,
          ]}
          onPress={() => handleInsurance('Jamkesda')}>
          <Text
            style={[
              styles.txtButton,
              insurance === 'Jamkesda' && styles.txtBtnActive,
            ]}>
            Jamkesda
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button2,
            insurance === 'Umum/Pribadi' && styles.selectedButton,
          ]}
          onPress={() => handleInsurance('Umum/Pribadi')}>
          <Text
            style={[
              styles.txtButton,
              insurance === 'Umum/Pribadi' && styles.txtBtnActive,
            ]}>
            Umum/Pribadi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button2,
            insurance === 'Asuransi Swasta' && styles.selectedButton,
          ]}
          onPress={() => handleInsurance('Asuransi Swasta')}>
          <Text
            style={[
              styles.txtButton,
              insurance === 'Asuransi Swasta' && styles.txtBtnActive,
            ]}>
            Asuransi Swasta
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button2,
            insurance === 'Pemerintah' && styles.selectedButton,
          ]}
          onPress={() => handleInsurance('Pemerintah')}>
          <Text
            style={[
              styles.txtButton,
              insurance === 'Pemerintah' && styles.txtBtnActive,
            ]}>
            Pemerintah
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button2,
            insurance === 'Perusahaan' && styles.selectedButton,
          ]}
          onPress={() => handleInsurance('Perusahaan')}>
          <Text
            style={[
              styles.txtButton,
              insurance === 'Perusahaan' && styles.txtBtnActive,
            ]}>
            Perusahaan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button2,
            insurance === 'Lain-lain' && styles.selectedButton,
          ]}
          onPress={() => handleInsurance('Lain-lain')}>
          <Text
            style={[
              styles.txtButton,
              insurance === 'Lain-lain' && styles.txtBtnActive,
            ]}>
            Lain-lain
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const btnGender = () => {
    const handleGender = (option: string) => {
      setGender(option);
    };

    return (
      <View
        style={{
          flexDirection: 'row',
          columnGap: 20,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={[
            styles.button,
            {flex: 1},
            gender === 'Laki-laki' && styles.selectedButton,
          ]}
          onPress={() => handleGender('Laki-laki')}>
          <Text
            style={[
              styles.txtButton,
              gender === 'Laki-laki' && styles.txtBtnActive,
            ]}>
            Laki-laki
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {flex: 1},
            gender === 'Perempuan' && styles.selectedButton,
          ]}
          onPress={() => handleGender('Perempuan')}>
          <Text
            style={[
              styles.txtButton,
              gender === 'Perempuan' && styles.txtBtnActive,
            ]}>
            Perempuan
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const datePick = () => {
    const showDateTimePicker = () => {
      setDateTimePickerVisible(true);
    };

    const hideDateTimePicker = () => {
      setDateTimePickerVisible(false);
    };

    const handleDateConfirm = (date: Date) => {
      setWaktuMendapatPelayanan(date);
      hideDateTimePicker();
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
      <View>
        <TouchableOpacity style={styles.button} onPress={showDateTimePicker}>
          <Text style={styles.txtButton}>
            {formatDateTime(waktuMendapatPelayanan)}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDateTimePickerVisible}
          mode="datetime"
          onConfirm={handleDateConfirm}
          onCancel={hideDateTimePicker}
        />
      </View>
    );
  };

  const resetForm = () => {
    dispatch(saveNamePasienAction(''));
    dispatch(saveNoMRAction(''));
    dispatch(saveRuanganAction(''));
    dispatch(saveAgeAction(''));
    dispatch(saveAgeNoAction(''));
    dispatch(saveSelectedAgeTypeAction(''));
    dispatch(saveAsuransiAction(''));
    dispatch(saveJenisKelaminAction(''));
    dispatch(saveWaktuMendapatPelayananAction(new Date().toString()));
    dispatch(saveWaktuInsidenAction(new Date().toString()));
    dispatch(saveInsidenAction(''));
    dispatch(saveKronologiInsidenAction(''));
    dispatch(saveInsidenTerjadiPadaPasienAction(''));
    dispatch(saveInsidenTerjadiPadaPasienOptionAction(''));
    dispatch(savePelaporPertamaAction(''));
    dispatch(saveInputPelaporPertamaAction(''));
    dispatch(savePasienTerkaitAction(0));
    dispatch(saveDampakInsidenAction(''));
    dispatch(saveLokasiInsidenAction(''));
    dispatch(saveProbabilitasAction(''));
    dispatch(saveUnitTerkaitAction(''));
    dispatch(saveTindakLanjutAction(''));
    dispatch(saveTindakLanjutOlehAction(''));
    dispatch(saveInputTindakLanjutOlehAction(''));
    dispatch(saveIsPernahTerjadiAction(false));
    dispatch(saveDeskripsiPernahTerjadiAction(''));
    dispatch(savePernahTerjadiAction(''));
    dispatch(saveImageCameraAction(null));
  };

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert(
          'Peringatan!',
          'Jika anda kembali maka semua perubahan anda akan dihapus',
          [
            {
              text: 'Batal',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                if (!idUser) {
                  if (socket) {
                    socket.off('message received');
                  }
                  resetForm();
                  navigation.navigate('WelcomePage');
                } else {
                  socket.off('message received');
                  resetForm();
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Navigation'}],
                    }),
                  );
                }
              },
            },
          ],
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

  useEffect(() => {
    validateDate();
  }, [waktuMendapatPelayanan]);

  const validateDate = () => {
    if (waktuMendapatPelayanan > new Date()) {
      Alert.alert('Waktu yang anda masukan tidak valid');
      setWaktuMendapatPelayanan(new Date());
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        <Title label="Data Karakteristik Pasien" />
        <Text style={styles.txtSection}>Nama Pasien</Text>
        <Input
          style={styles.inputBox}
          // placeholder="Nama anda"
          placeholderTextColor="#787878"
          onChangeText={setName}
          value={name}
        />
        <Text style={styles.txtSection}>Nomor MR</Text>
        <Input
          keyboardType="numeric"
          style={styles.inputBox}
          // placeholder="Nomor MR anda"
          placeholderTextColor="#787878"
          onChangeText={setNomorMR}
          value={nomorMR}
        />
        <Text style={styles.txtSection}>Ruangan</Text>
        <Input
          style={styles.inputBox}
          placeholder=""
          placeholderTextColor="#787878"
          onChangeText={setRuangan}
          value={ruangan}
        />
        <Text style={styles.txtSection}>Umur</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Input
            keyboardType="numeric"
            style={[styles.inputBox, {width: 63, textAlign: 'center'}]}
            placeholder="00"
            placeholderTextColor="#787878"
            onChangeText={value => {
              if (value.length <= 3) {
                setAgeNo(value);
              }
            }}
            maxLength={3}
            value={ageNo}
          />
          {btnUmur()}
        </View>
        <Text style={styles.txtSection}>Penanggung Biaya Pasien</Text>
        {btnInsurance()}
        <Text style={styles.txtSection}>Jenis Kelamin</Text>
        {btnGender()}
        <Text style={styles.txtSection}>Waktu Mendapatkan Pelayanan</Text>
        {datePick()}
        <Gap height={30} />
      </View>
      <View style={styles.footer}>
        {!idUser ? (
          <Button
            label="Kembali"
            backgroundColor={MyColor.Light}
            textColor={MyColor.Primary}
            width={126}
            onClick={() => {
              Alert.alert(
                'Peringatan!',
                'Jika anda kembali maka semua perubahan anda akan dihapus',
                [
                  {
                    text: 'Batal',
                    onPress: () => null,
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      if (socket) {
                        socket.off('message received');
                      }
                      resetForm();
                      navigation.navigate('WelcomePage');
                    },
                  },
                ],
              );
            }}
          />
        ) : (
          <Button
            label="Menu Utama"
            backgroundColor={MyColor.Light}
            textColor={MyColor.Primary}
            width={126}
            onClick={() => {
              Alert.alert(
                'Peringatan!',
                'Jika anda kembali maka semua perubahan anda akan dihapus',
                [
                  {
                    text: 'Batal',
                    onPress: () => null,
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      socket.off('message received');
                      resetForm();
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{name: 'Navigation'}],
                        }),
                      );
                    },
                  },
                ],
              );
            }}
          />
        )}
        <Button
          label="Selanjutnya"
          backgroundColor={MyColor.Primary}
          textColor={MyColor.Light}
          width={173}
          onClick={() => {
            if (validateForm()) {
              dispatch(saveNamePasienAction(name));
              dispatch(saveNoMRAction(nomorMR));
              dispatch(saveRuanganAction(ruangan));
              dispatch(saveAgeAction(age));
              dispatch(saveAgeNoAction(ageNo));
              dispatch(saveSelectedAgeTypeAction(selectedAgeType));
              dispatch(saveAsuransiAction(insurance));
              dispatch(saveJenisKelaminAction(gender));
              dispatch(
                saveWaktuMendapatPelayananAction(
                  String(waktuMendapatPelayanan),
                ),
              );
              navigation.navigate('RincianKejadian');
            } else {
              Alert.alert(
                'Data Tidak Lengkap',
                'Harap isi semua field dengan data yang benar sebelum melanjutkan ke langkah berikutnya',
              );
            }
          }}
        />
      </View>
    </ScrollView>
  );
};

export default DataKarakteristikPasien;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  txtSection: {
    fontFamily: MyFont.Primary,
    color: 'black',
    fontSize: 18,
    marginTop: 20,
  },
  txtButton: {
    fontFamily: MyFont.Primary,
    fontSize: 14,
    color: 'black',
  },
  txtBtnActive: {
    color: MyColor.Light,
  },
  inputBox: {
    paddingVertical: 0,
    height: 40,
    fontFamily: MyFont.Primary,
    fontSize: 16,
    color: 'black',
    backgroundColor: MyColor.Light,
    borderRadius: 10,
    marginBottom: 10,
  },
  containerBtn: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    maxWidth: 360,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  button: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    backgroundColor: MyColor.Light,
  },
  button2: {
    height: 52,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: MyColor.Light,
  },
  selectedButton: {
    backgroundColor: MyColor.Primary,
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  footer: {
    flex: 1,
    backgroundColor: MyColor.Light,
    flexDirection: 'row',
    columnGap: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'center',
  },
});
