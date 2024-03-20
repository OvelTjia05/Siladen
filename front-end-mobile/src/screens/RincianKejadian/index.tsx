import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput as Input,
  Pressable,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Title from '../../components/atoms/Title';
import {MyFont} from '../../components/atoms/MyFont';
import {MyColor} from '../../components/atoms/MyColor';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Gap from '../../components/atoms/Gap';
import Button from '../../components/atoms/Button';
import {IconDropDown, IconPanahKanan} from '../../assets/icons';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {
  saveWaktuInsidenAction,
  saveInsidenAction,
  saveKronologiInsidenAction,
  saveInsidenTerjadiPadaPasienAction,
  saveInsidenTerjadiPadaPasienOptionAction,
  savePelaporPertamaAction,
  saveInputPelaporPertamaAction,
  savePasienTerkaitAction,
  saveDampakInsidenAction,
  saveLokasiInsidenAction,
  saveProbabilitasAction,
  saveUnitTerkaitAction,
  saveTindakLanjutAction,
  saveTindakLanjutOlehAction,
  saveInputTindakLanjutOlehAction,
  saveIsPernahTerjadiAction,
  saveDeskripsiPernahTerjadiAction,
  savePernahTerjadiAction,
} from '../../../redux/action';
import {API_HOST} from '../../../config';

type JenisPasien = {
  id_jenis_pasien: number;
  nama_jenis_pasien: string;
};

const RincianKejadian = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const tokenSelector = useSelector((data: any) => data.token);
  const waktuInsidenSelector = useSelector((data: any) => data.waktuInsiden);
  const insidenSelector = useSelector((data: any) => data.insiden);
  const kronologiInsidenSelector = useSelector(
    (data: any) => data.kronologiInsiden,
  );
  const insidenTerjadiPadaPasienSelector = useSelector(
    (data: any) => data.insidenTerjadiPadaPasien,
  );
  const insidenTerjadiPadaPasienOptionSelector = useSelector(
    (data: any) => data.insidenTerjadiPadaPasienOption,
  );
  const pelaporPertamaSelector = useSelector(
    (data: any) => data.pelaporPertama,
  );
  const inputPelaporPertamaSelector = useSelector(
    (data: any) => data.inputPelaporPertama,
  );
  const pasienTerkaitSelector = useSelector((data: any) => data.pasienTerkait);
  const dampakInsidenSelector = useSelector((data: any) => data.dampakInsiden);
  const lokasiInsidenSelector = useSelector((data: any) => data.lokasiInsiden);
  const probabilitasSelector = useSelector((data: any) => data.probabilitas);
  const unitTerkaitSelector = useSelector((data: any) => data.unitTerkait);
  const tindakLanjutSelector = useSelector((data: any) => data.tindakLanjut);
  const tindakLanjutOlehSelector = useSelector(
    (data: any) => data.tindakLanjutOleh,
  );
  const inputTindakLanjutOlehSelector = useSelector(
    (data: any) => data.inputTindakLanjutOleh,
  );
  const isPernahTerjadiSelector = useSelector(
    (data: any) => data.isPernahTerjadi,
  );
  const deskripsiPernahTerjadiSelector = useSelector(
    (data: any) => data.deskripsiPernahTerjadi,
  );
  const pernahTerjadiSelector = useSelector((data: any) => data.pernahTerjadi);
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

  const dataUserCoba = {
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

  const dataUser = {
    token: tokenSelector,
    waktuInsiden: waktuInsidenSelector,
    insiden: insidenSelector,
    kronologiInsiden: kronologiInsidenSelector,
    insidenTerjadiPadaPasien: insidenTerjadiPadaPasienSelector,
    insidenTerjadiPadaPasienOption: insidenTerjadiPadaPasienOptionSelector,
    pelaporPertama: pelaporPertamaSelector,
    inputPelaporPertama: inputPelaporPertamaSelector,
    pasienTerkait: pasienTerkaitSelector,
    dampakInsiden: dampakInsidenSelector,
    lokasiInsiden: lokasiInsidenSelector,
    probabilitas: probabilitasSelector,
    unitTerkait: unitTerkaitSelector,
    tindakLanjut: tindakLanjutSelector,
    tindakLanjutOleh: tindakLanjutOlehSelector,
    inputTindakLanjutOleh: inputTindakLanjutOlehSelector,
    isPernahTerjadi: isPernahTerjadiSelector,
    deskripsiPernahTerjadi: deskripsiPernahTerjadiSelector,
    pernahTerjadi: pernahTerjadiSelector,
  };
  const [isLoading, setIsLoading] = useState(true);
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [waktuInsiden, setWaktuInsiden] = useState(
    new Date(dataUser.waktuInsiden),
  );
  const [insiden, setInsiden] = useState(dataUser.insiden);
  const [kronologiInsiden, setKronologiInsiden] = useState(
    dataUser.kronologiInsiden,
  );
  const [insidenTerjadiPadaPasienOption, setInsidenTerjadiPadaPasienOption] =
    useState(dataUser.insidenTerjadiPadaPasienOption);
  const [insidenTerjadiPadaPasien, setInsidenTerjadiPadaPasien] = useState(
    dataUser.insidenTerjadiPadaPasien,
  );
  const [pelaporPertama, setPelaporPertama] = useState(dataUser.pelaporPertama);
  const [inputPelaporPertama, setInputPelaporPertama] = useState(
    dataUser.inputPelaporPertama,
  );
  const [jenisPasien, setJenisPasien] = useState<JenisPasien[]>([]);
  const [pasienTerkait, setPasienTerkait] = useState(dataUser.pasienTerkait);
  const [dampakInsiden, setDampakInsiden] = useState(dataUser.dampakInsiden);
  const [lokasiInsiden, setLokasiInsiden] = useState(dataUser.lokasiInsiden);
  const [probabilitas, setProbabilitas] = useState(dataUser.probabilitas);
  const [unitTerkait, setUnitTerkait] = useState(dataUser.unitTerkait);
  const [tindakLanjut, setTindakLanjut] = useState(dataUser.tindakLanjut);
  const [tindakLanjutOleh, setTindakLanjutOleh] = useState(
    dataUser.tindakLanjutOleh,
  );
  const [inputTindakLanjutOleh, setInputTindakLanjutOleh] = useState(
    dataUser.inputTindakLanjutOleh,
  );
  const [isPernahTerjadi, setIsPernahTerjadi]: any = useState(
    dataUser.isPernahTerjadi,
  );
  const [deskripsiPernahTerjadi, setDeskripsiPernahTerjadi] = useState(
    dataUser.deskripsiPernahTerjadi,
  );
  const [pernahTerjadi, setPernahTerjadi] = useState(dataUser.pernahTerjadi);
  const [isModalVisible, setIsModalVisible] = useState(false);

  function validateForm() {
    return (
      waktuInsiden !== null &&
      insiden !== '' &&
      kronologiInsiden !== '' &&
      insidenTerjadiPadaPasien !== '' &&
      pelaporPertama !== '' &&
      pasienTerkait !== 0 &&
      dampakInsiden !== '' &&
      lokasiInsiden !== '' &&
      probabilitas !== '' &&
      unitTerkait !== '' &&
      tindakLanjut !== '' &&
      tindakLanjutOleh !== '' &&
      isPernahTerjadi !== undefined &&
      pernahTerjadi.length > 4
    );
  }

  const saveForm = () => {
    dispatch(saveWaktuInsidenAction(waktuInsiden.toString()));
    dispatch(saveInsidenAction(insiden));
    dispatch(saveKronologiInsidenAction(kronologiInsiden));
    dispatch(saveInsidenTerjadiPadaPasienAction(insidenTerjadiPadaPasien));
    dispatch(
      saveInsidenTerjadiPadaPasienOptionAction(insidenTerjadiPadaPasienOption),
    );
    dispatch(savePelaporPertamaAction(pelaporPertama));
    dispatch(saveInputPelaporPertamaAction(inputPelaporPertama));
    dispatch(savePasienTerkaitAction(pasienTerkait));
    dispatch(saveDampakInsidenAction(dampakInsiden));
    dispatch(saveLokasiInsidenAction(lokasiInsiden));
    dispatch(saveProbabilitasAction(probabilitas));
    dispatch(saveUnitTerkaitAction(unitTerkait));
    dispatch(saveTindakLanjutAction(tindakLanjut));
    dispatch(saveTindakLanjutOlehAction(tindakLanjutOleh));
    dispatch(saveInputTindakLanjutOlehAction(inputTindakLanjutOleh));
    dispatch(saveIsPernahTerjadiAction(isPernahTerjadi));
    dispatch(saveDeskripsiPernahTerjadiAction(deskripsiPernahTerjadi));
    dispatch(savePernahTerjadiAction(pernahTerjadi));
  };

  useEffect(() => {
    if (isPernahTerjadi === true) {
      setPernahTerjadi(`Ya, ${deskripsiPernahTerjadi}`);
    } else {
      setPernahTerjadi(`Tidak`);
    }
  }, [isPernahTerjadi, deskripsiPernahTerjadi]);

  useEffect(() => {
    getJenisPasien();
  }, []);

  useEffect(() => {
    if (waktuInsiden > new Date()) {
      Alert.alert('Waktu yang anda masukan tidak valid');
      setWaktuInsiden(new Date());
    }
  }, [waktuInsiden]);

  const datePick = () => {
    const showDateTimePicker = () => {
      setDateTimePickerVisible(true);
    };

    const hideDateTimePicker = () => {
      setDateTimePickerVisible(false);
    };

    const handleDateConfirm = (date: Date) => {
      setWaktuInsiden(date);
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
        <TouchableOpacity
          style={styles.timePicker}
          onPress={showDateTimePicker}>
          <Text style={styles.txtButton}>{formatDateTime(waktuInsiden)}</Text>
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

  const btnPelaporPertama = () => {
    const handlePelaporPertama = (option: string) => {
      if (option !== 'Lain-lain') {
        setPelaporPertama(option);
      } else {
        setPelaporPertama('');
      }
    };
    return (
      <View style={styles.containerBtn}>
        <TouchableOpacity
          style={[
            styles.button,
            pelaporPertama === 'Dokter' && styles.selectedButton,
          ]}
          onPress={() => handlePelaporPertama('Dokter')}>
          <Text
            style={[
              styles.txtButton,
              pelaporPertama === 'Dokter' && styles.txtBtnActive,
            ]}>
            Dokter
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            pelaporPertama === 'Perawat' && styles.selectedButton,
          ]}
          onPress={() => handlePelaporPertama('Perawat')}>
          <Text
            style={[
              styles.txtButton,
              pelaporPertama === 'Perawat' && styles.txtBtnActive,
            ]}>
            Perawat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            pelaporPertama === 'Petugas lainnya' && styles.selectedButton,
          ]}
          onPress={() => handlePelaporPertama('Petugas lainnya')}>
          <Text
            style={[
              styles.txtButton,
              pelaporPertama === 'Petugas lainnya' && styles.txtBtnActive,
            ]}>
            Petugas lainnya
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            pelaporPertama === 'Pasien' && styles.selectedButton,
          ]}
          onPress={() => handlePelaporPertama('Pasien')}>
          <Text
            style={[
              styles.txtButton,
              pelaporPertama === 'Pasien' && styles.txtBtnActive,
            ]}>
            Pasien
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            pelaporPertama === 'Keluarga / Pendamping' && styles.selectedButton,
          ]}
          onPress={() => handlePelaporPertama('Keluarga / Pendamping')}>
          <Text
            style={[
              styles.txtButton,
              pelaporPertama === 'Keluarga / Pendamping' && styles.txtBtnActive,
            ]}>
            Keluarga / Pendamping
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            pelaporPertama === 'Pengunjung' && styles.selectedButton,
          ]}
          onPress={() => handlePelaporPertama('Pengunjung')}>
          <Text
            style={[
              styles.txtButton,
              pelaporPertama === 'Pengunjung' && styles.txtBtnActive,
            ]}>
            Pengunjung
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            ![
              'Dokter',
              'Perawat',
              'Petugas lainnya',
              'Pasien',
              'Keluarga / Pendamping',
              'Pengunjung',
            ].includes(pelaporPertama) && styles.selectedButton,
          ]}
          onPress={() => handlePelaporPertama('Lain-lain')}>
          <Text
            style={[
              styles.txtButton,
              ![
                'Dokter',
                'Perawat',
                'Petugas lainnya',
                'Pasien',
                'Keluarga / Pendamping',
                'Pengunjung',
              ].includes(pelaporPertama) && styles.txtBtnActive,
            ]}>
            Lain-lain
          </Text>
        </TouchableOpacity>
        {![
          'Dokter',
          'Perawat',
          'Petugas lainnya',
          'Pasien',
          'Keluarga / Pendamping',
          'Pengunjung',
        ].includes(pelaporPertama) && (
          <Input
            style={{
              flex: 1,
              backgroundColor: MyColor.Primary,
              borderRadius: 10,
              color: MyColor.Light,
              paddingStart: 10,
            }}
            placeholder="(masukan disini...)"
            placeholderTextColor={MyColor.Light}
            onChangeText={setInputPelaporPertama}
            value={inputPelaporPertama}
            onEndEditing={() => {
              if (inputPelaporPertama !== '') {
                setPelaporPertama(inputPelaporPertama);
              } else {
                Alert.alert('Mohon mengisi keterangan untuk opsi Lain-lain');
              }
            }}
          />
        )}
      </View>
    );
  };

  const getJenisPasien = async () => {
    try {
      setIsLoading(true);
      const headers = {
        Authorization: `Bearer ${dataUser.token}`,
      };
      const response = await axios.get(`${API_HOST}/api/jenis_pasien`, {
        headers,
      });
      setIsLoading(false);
      setJenisPasien(response.data.data);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Terjadi kesalahan saat memuat data',
        'Pastikan anda telah terhubung ke internet lalu coba lagi atau restart aplikasi',
        [
          {
            text: 'Coba Lagi',
            onPress: () => {
              getJenisPasien();
            },
          },
        ],
      );
    }
  };

  const btnPasienTerkait = () => {
    const handlePasienTerkait = (option: number) => {
      setPasienTerkait(option);
    };

    return (
      <View style={styles.containerBtn}>
        {isLoading ? (
          <View style={{flex: 1}}>
            <ActivityIndicator size="large" color={MyColor.Primary} />
          </View>
        ) : (
          <>
            {jenisPasien?.map((item: any, index) => (
              <TouchableOpacity
                key={item.id_jenis_pasien}
                style={[
                  styles.button,
                  pasienTerkait === item.id_jenis_pasien &&
                    styles.selectedButton,
                ]}
                onPress={() => {
                  handlePasienTerkait(item.id_jenis_pasien);
                }}>
                <Text
                  style={[
                    styles.txtButton,
                    pasienTerkait === item.id_jenis_pasien &&
                      styles.txtBtnActive,
                  ]}>
                  {item.nama_jenis_pasien}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    );
  };

  const renderInsidenTerjadiPadaPasienOption = (option: string) => (
    <Pressable
      style={[
        styles.modalItems,
        {
          width:
            option === 'Lain-lain' &&
            insidenTerjadiPadaPasienOption !== 'Lain-lain'
              ? 'auto'
              : option == 'Lain-lain'
              ? 98
              : 128,
          backgroundColor:
            insidenTerjadiPadaPasienOption === option
              ? MyColor.Primary
              : MyColor.Light,
        },
      ]}
      onPress={() => {
        setInsidenTerjadiPadaPasienOption(option);
        if (option === 'Lain-lain') {
          setInsidenTerjadiPadaPasien('');
        }
      }}>
      <Text
        style={[
          styles.txtModal,
          {
            color:
              insidenTerjadiPadaPasienOption === option
                ? MyColor.Light
                : MyColor.Primary,
          },
        ]}>
        {option}
      </Text>
    </Pressable>
  );

  const handleInsidenTerjadiPadaPasien = () => {
    if (insidenTerjadiPadaPasienOption !== 'Lain-lain') {
      setIsModalVisible(false);
      setInsidenTerjadiPadaPasien(insidenTerjadiPadaPasienOption);
    } else {
      if (insidenTerjadiPadaPasien === '') {
        Alert.alert('Mohon isi keterangan untuk opsi Lain-lain!');
        setIsModalVisible(true);
      } else {
        setIsModalVisible(false);
      }
    }
  };

  const btnDampakInsiden = () => {
    const handleDampakInsiden = (option: string) => {
      setDampakInsiden(option);
    };
    return (
      <View style={styles.containerBtn}>
        <TouchableOpacity
          style={[
            styles.button,
            dampakInsiden === 'Kematian' && styles.selectedButton,
            {marginRight: 0},
          ]}
          onPress={() => handleDampakInsiden('Kematian')}>
          <Text
            style={[
              styles.txtButton,
              dampakInsiden === 'Kematian' && styles.txtBtnActive,
            ]}>
            Kematian
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            dampakInsiden === 'Cedera Irreversibel / Cedera Berat' &&
              styles.selectedButton,
            {marginRight: 0},
          ]}
          onPress={() =>
            handleDampakInsiden('Cedera Irreversibel / Cedera Berat')
          }>
          <Text
            style={[
              styles.txtButton,
              dampakInsiden === 'Cedera Irreversibel / Cedera Berat' &&
                styles.txtBtnActive,
            ]}>
            Cedera Berat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            dampakInsiden === 'Cedera Reversibel / Cedera Sedang' &&
              styles.selectedButton,
            {marginRight: 0},
          ]}
          onPress={() =>
            handleDampakInsiden('Cedera Reversibel / Cedera Sedang')
          }>
          <Text
            style={[
              styles.txtButton,
              dampakInsiden === 'Cedera Reversibel / Cedera Sedang' &&
                styles.txtBtnActive,
            ]}>
            Cedera Sedang
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            dampakInsiden === 'Cedera Ringan' && styles.selectedButton,
            {marginRight: 0},
          ]}
          onPress={() => handleDampakInsiden('Cedera Ringan')}>
          <Text
            style={[
              styles.txtButton,
              dampakInsiden === 'Cedera Ringan' && styles.txtBtnActive,
              {marginRight: 0},
            ]}>
            Cedera Ringan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            dampakInsiden === 'Tidak ada cedera' && styles.selectedButton,
            {marginRight: 0},
          ]}
          onPress={() => handleDampakInsiden('Tidak ada cedera')}>
          <Text
            style={[
              styles.txtButton,
              dampakInsiden === 'Tidak ada cedera' && styles.txtBtnActive,
            ]}>
            Tidak ada cedera
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const btnProbabilitas = () => {
    const handleProbabilitas = (option: string) => {
      setProbabilitas(option);
    };
    return (
      <View style={styles.containerBtn}>
        <TouchableOpacity
          style={[
            styles.button,
            probabilitas === 'Sangat jarang' && styles.selectedButton,
            {marginRight: 0},
          ]}
          onPress={() => handleProbabilitas('Sangat jarang')}>
          <Text
            style={[
              styles.txtButton,
              probabilitas === 'Sangat jarang' && styles.txtBtnActive,
            ]}>
            Sangat jarang
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            probabilitas === 'Jarang' && styles.selectedButton,
            {marginRight: 0},
          ]}
          onPress={() => handleProbabilitas('Jarang')}>
          <Text
            style={[
              styles.txtButton,
              probabilitas === 'Jarang' && styles.txtBtnActive,
            ]}>
            Jarang
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            probabilitas === 'Mungkin' && styles.selectedButton,
            {marginRight: 0},
          ]}
          onPress={() => handleProbabilitas('Mungkin')}>
          <Text
            style={[
              styles.txtButton,
              probabilitas === 'Mungkin' && styles.txtBtnActive,
            ]}>
            Mungkin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            probabilitas === 'Sering' && styles.selectedButton,
            {marginRight: 0},
          ]}
          onPress={() => handleProbabilitas('Sering')}>
          <Text
            style={[
              styles.txtButton,
              probabilitas === 'Sering' && styles.txtBtnActive,
              {marginRight: 0},
            ]}>
            Sering
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            probabilitas === 'Sangat sering' && styles.selectedButton,
            {marginRight: 0},
          ]}
          onPress={() => handleProbabilitas('Sangat sering')}>
          <Text
            style={[
              styles.txtButton,
              probabilitas === 'Sangat sering' && styles.txtBtnActive,
            ]}>
            Sangat sering
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const btnTindakLanjutOleh = () => {
    const handleTindakLanjutOleh = (option: string) => {
      if (option !== 'Lain-lain') {
        setTindakLanjutOleh(option);
      } else {
        setTindakLanjutOleh('');
      }
    };

    return (
      <View style={styles.containerBtn}>
        <TouchableOpacity
          style={[
            styles.button,
            tindakLanjutOleh === 'Tim' && styles.selectedButton,
          ]}
          onPress={() => handleTindakLanjutOleh('Tim')}>
          <Text
            style={[
              styles.txtButton,
              tindakLanjutOleh === 'Tim' && styles.txtBtnActive,
            ]}>
            Tim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            tindakLanjutOleh === 'Dokter' && styles.selectedButton,
          ]}
          onPress={() => handleTindakLanjutOleh('Dokter')}>
          <Text
            style={[
              styles.txtButton,
              tindakLanjutOleh === 'Dokter' && styles.txtBtnActive,
            ]}>
            Dokter
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            tindakLanjutOleh === 'Perawat' && styles.selectedButton,
          ]}
          onPress={() => handleTindakLanjutOleh('Perawat')}>
          <Text
            style={[
              styles.txtButton,
              tindakLanjutOleh === 'Perawat' && styles.txtBtnActive,
            ]}>
            Perawat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            !['Tim', 'Dokter', 'Perawat'].includes(tindakLanjutOleh) &&
              styles.selectedButton,
          ]}
          onPress={() => handleTindakLanjutOleh('Lain-lain')}>
          <Text
            style={[
              styles.txtButton,
              !['Tim', 'Dokter', 'Perawat'].includes(tindakLanjutOleh) &&
                styles.txtBtnActive,
            ]}>
            Lain-lain
          </Text>
        </TouchableOpacity>
        {!['Tim', 'Dokter', 'Perawat'].includes(tindakLanjutOleh) && (
          <Input
            style={{
              flex: 1,
              backgroundColor: MyColor.Primary,
              borderRadius: 10,
              color: MyColor.Light,
              paddingStart: 10,
            }}
            placeholder="(masukan disini...)"
            placeholderTextColor={MyColor.Light}
            onChangeText={setInputTindakLanjutOleh}
            value={inputTindakLanjutOleh}
            onEndEditing={() => {
              if (inputTindakLanjutOleh !== '') {
                setTindakLanjutOleh(inputTindakLanjutOleh);
              } else {
                Alert.alert('Mohon mengisi keterangan untuk opsi Lain-lain');
              }
            }}
          />
        )}
      </View>
    );
  };

  const handlePernahTerjadi = (option: boolean) => {
    setIsPernahTerjadi(option);
  };

  const btnPernahTerjadi = () => {
    return (
      <View>
        <View style={[styles.containerBtn, {columnGap: 20}]}>
          <TouchableOpacity
            style={[
              styles.button,
              {flex: 1},
              isPernahTerjadi === true && styles.selectedButton,
            ]}
            onPress={() => handlePernahTerjadi(true)}>
            <Text
              style={[
                styles.txtButton,
                isPernahTerjadi === true && styles.txtBtnActive,
              ]}>
              Ya
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {flex: 1},
              isPernahTerjadi === false && styles.selectedButton,
            ]}
            onPress={() => handlePernahTerjadi(false)}>
            <Text
              style={[
                styles.txtButton,
                isPernahTerjadi === false && styles.txtBtnActive,
              ]}>
              Tidak
            </Text>
          </TouchableOpacity>
        </View>
        <Gap height={20} />
        {isPernahTerjadi ? (
          <View
            style={{
              height: 263,
              backgroundColor: MyColor.Primary,
              borderRadius: 10,
              padding: 10,
              // display: 'none',
            }}>
            <Text style={[styles.txtDesc]}>
              Kapan? dan langkah / tindakan apa yang telah diambil pada unit
              kerja tersebut untuk mencegah terulangnya kejadian yang sama?
            </Text>
            <Input
              style={styles.inputBox2}
              // placeholder="Nama anda"
              placeholderTextColor="#787878"
              onChangeText={setDeskripsiPernahTerjadi}
              value={deskripsiPernahTerjadi}
              multiline={true}
            />
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        <Title label="Rincian Kejadian" />
        <Text style={styles.txtSection}>Waktu Insiden</Text>
        {datePick()}
        <Text style={styles.txtSection}>
          Insiden{' '}
          <Text style={styles.txtInfo}>
            (cth: pasien terjatuh, salah suntik, salah minum obat)
          </Text>
        </Text>
        <Input
          style={styles.inputBox}
          placeholderTextColor="#787878"
          onChangeText={setInsiden}
          value={insiden}
          multiline={true}
        />
        <Text style={styles.txtSection}>
          Kronologis Insiden{' '}
          <Text style={styles.txtInfo}>(cerita dari insiden yang terjadi)</Text>
        </Text>
        <Input
          style={styles.inputBox}
          placeholderTextColor="#787878"
          onChangeText={setKronologiInsiden}
          value={kronologiInsiden}
          multiline={true}
        />
        <Text style={styles.txtSection}>
          Insiden yang terjadi pada pasien{'\n'}
          <Text style={styles.txtInfo}>
            (sesuai kasus penyakit/spesialisasi)
          </Text>
        </Text>
        <Pressable
          style={[
            styles.InputContainer,
            {
              paddingHorizontal: 5,
              paddingVertical: 12,
              marginBottom: 20,
            },
          ]}
          onPress={() => setIsModalVisible(true)}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 16,
              width: '90%',
              marginBottom: 'auto',
              color: 'gray',
              paddingStart: 5,
            }}>
            {insidenTerjadiPadaPasienOption !== ''
              ? insidenTerjadiPadaPasien
              : '(Silahkan pilih yang sesuai...)'}
          </Text>
          <IconDropDown fill={'black'} />
        </Pressable>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modal}>
              <ScrollView style={styles.modalContent}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Bold',
                    fontSize: 18,
                    color: MyColor.Primary,
                    marginBottom: 10,
                  }}>
                  Insiden terjadi pada pasien{'\n'}
                  <Text
                    style={{
                      fontFamily: MyFont.Primary,
                      fontSize: 15,
                      color: 'gray',
                    }}>
                    dan Subspesialisasinya
                  </Text>
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}>
                  {renderInsidenTerjadiPadaPasienOption('Penyakit dalam')}
                  {renderInsidenTerjadiPadaPasienOption('Anak')}
                  {renderInsidenTerjadiPadaPasienOption('Bedah')}
                  {renderInsidenTerjadiPadaPasienOption('Obgyn')}
                  {renderInsidenTerjadiPadaPasienOption('THT')}
                  {renderInsidenTerjadiPadaPasienOption('Mata')}
                  {renderInsidenTerjadiPadaPasienOption('Saraf')}
                  {renderInsidenTerjadiPadaPasienOption('Anastesi')}
                  {renderInsidenTerjadiPadaPasienOption('Kulit & Kelamin')}
                  {renderInsidenTerjadiPadaPasienOption('Jantung')}
                  {renderInsidenTerjadiPadaPasienOption('Paru-paru')}
                  {renderInsidenTerjadiPadaPasienOption('Jiwa')}
                </View>
                <View
                  style={{
                    flexDirection:
                      insidenTerjadiPadaPasienOption === 'Lain-lain'
                        ? 'row'
                        : 'column',
                    justifyContent: 'space-between',
                  }}>
                  {renderInsidenTerjadiPadaPasienOption('Lain-lain')}
                  {insidenTerjadiPadaPasienOption === 'Lain-lain' && (
                    <View>
                      <Input
                        style={{
                          backgroundColor: MyColor.Primary,
                          borderRadius: 10,
                          color: MyColor.Light,
                          width: 160,
                          height: 35,
                        }}
                        placeholder="(masukan disini...)"
                        placeholderTextColor={MyColor.Light}
                        onChangeText={setInsidenTerjadiPadaPasien}
                        value={insidenTerjadiPadaPasien}
                      />
                    </View>
                  )}
                </View>
                <View style={{flexDirection: 'row', gap: 10}}>
                  <Pressable
                    style={styles.modalItems}
                    onPress={() => {
                      setIsModalVisible(false);
                      if (
                        insidenTerjadiPadaPasienOption !== 'Lain-lain' &&
                        insidenTerjadiPadaPasien !==
                          insidenTerjadiPadaPasienOption
                      ) {
                        if (
                          insidenTerjadiPadaPasienOption !== 'Lain-lain' &&
                          ![
                            'Penyakit dalam',
                            'Anak',
                            'Bedah',
                            'Obgyn',
                            'THT',
                            'Mata',
                            'Saraf',
                            'Anastesi',
                            'Kulit & Kelamin',
                            'Jantung',
                            'Paru-paru',
                            'Jiwa',
                          ].includes(insidenTerjadiPadaPasien)
                        ) {
                          setInsidenTerjadiPadaPasienOption('Lain-lain');
                        } else {
                          setInsidenTerjadiPadaPasienOption(
                            insidenTerjadiPadaPasien,
                          );
                        }
                      }
                    }}>
                    <Text style={[styles.txtModal, {fontSize: 18}]}>Batal</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalItems, {flex: 1}]}
                    onPress={handleInsidenTerjadiPadaPasien}>
                    <Text style={[styles.txtModal, {fontSize: 18}]}>OK</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Text style={styles.txtSection}>Dampak Insiden Terhadap Pasien</Text>
        {btnDampakInsiden()}
        <Text style={styles.txtSection}>Probabilitas</Text>
        {btnProbabilitas()}
        <Text style={styles.txtSection}>
          Orang Pertama Yang Melaporkan Insiden
        </Text>
        {btnPelaporPertama()}
        <Text style={styles.txtSection}>Insiden Menyangkut Pasien</Text>
        {btnPasienTerkait()}
        <Text style={styles.txtSection}>
          Tempat Insiden{' '}
          <Text style={styles.txtInfo}>
            (cth: lobby, kamar mandi, tempat tidur)
          </Text>
        </Text>
        <Input
          style={styles.inputBox}
          // placeholder="Nama anda"
          placeholderTextColor="#787878"
          onChangeText={setLokasiInsiden}
          value={lokasiInsiden}
          multiline={true}
        />
        <Text style={styles.txtSection}>
          Unit / Departemen terkait yang menyebabkan insiden{' '}
          <Text style={styles.txtInfo}>(cth: farmasi, lab, UGD)</Text>
        </Text>
        <Input
          style={styles.inputBox}
          // placeholder="Nama anda"
          placeholderTextColor="#787878"
          onChangeText={setUnitTerkait}
          value={unitTerkait}
          multiline={true}
        />

        <Text style={styles.txtSection}>
          Tindak lanjut yang dilakukan segera setelah kejadian, dan hasilnya
        </Text>
        <Input
          style={styles.inputBox}
          // placeholder="Nama anda"
          placeholderTextColor="#787878"
          onChangeText={setTindakLanjut}
          value={tindakLanjut}
          multiline={true}
          // blurOnSubmit={true}
        />
        <Text style={styles.txtSection}>
          Tindak lanjut setelah insiden, dilakukan oleh
        </Text>
        {btnTindakLanjutOleh()}
        <Text style={styles.txtSection}>
          Apakah kejadian yang sama pernah terjadi di Unit Kerja lain?
        </Text>
        {btnPernahTerjadi()}
      </View>
      <View style={styles.footer}>
        <Button
          label="Kembali"
          backgroundColor={MyColor.Light}
          textColor={MyColor.Primary}
          width={126}
          onClick={() => {
            saveForm();
            navigation.navigate('DataKarakteristikPasien');
          }}
        />
        <Button
          label="Lanjut"
          backgroundColor={MyColor.Primary}
          textColor={MyColor.Light}
          width={173}
          icons={<IconPanahKanan />}
          onClick={() => {
            if (validateForm()) {
              saveForm();
              navigation.navigate('FotoPendukung');
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

export default RincianKejadian;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  txtDesc: {
    flex: 1,
    fontFamily: MyFont.Primary,
    color: MyColor.Light,
    fontSize: 18,
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
    textAlign: 'center',
  },
  txtBtnActive: {
    color: MyColor.Light,
  },
  txtModal: {
    fontFamily: MyFont.Primary,
    fontSize: 13,
    textAlign: 'center',
    color: MyColor.Primary,
  },
  txtInfo: {
    color: 'gray',
    fontSize: 15,
  },
  inputBox: {
    paddingVertical: 0,
    minHeight: 40,
    fontFamily: MyFont.Primary,
    fontSize: 16,
    color: 'black',
    backgroundColor: MyColor.Light,
    borderRadius: 10,
    marginBottom: 10,
  },
  inputBox2: {
    textAlignVertical: 'top',
    padding: 10,
    height: 106,
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
    // backgroundColor: 'green',
    // justifyContent: 'space-between',
    // justifyContent: 'space-around',
  },
  button: {
    height: 52,
    minWidth: 100,
    maxWidth: 150,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: MyColor.Light,
  },
  InputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    width: '100%',
  },
  modal: {
    width: '90%',
    maxWidth: 350,
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: MyColor.Primary,
    backgroundColor: MyColor.Light,
    paddingHorizontal: 25,
    paddingVertical: 20,
    alignSelf: 'center',
  },
  modalContent: {
    maxWidth: 272,
    // backgroundColor: 'violet',
    alignSelf: 'center',
  },
  modalItems: {
    width: 128,
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MyColor.Primary,
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
  },
  timePicker: {
    width: '100%',
    // maxWidth: 380,
    backgroundColor: MyColor.Light,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: MyColor.Primary,
  },
  footer: {
    backgroundColor: MyColor.Light,
    flexDirection: 'row',
    columnGap: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
