import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {MyFont} from '../../components/atoms/MyFont';
import Gap from '../../components/atoms/Gap';
import Button from '../../components/atoms/Button';
import {MyColor} from '../../components/atoms/MyColor';
import {
  IconCamera,
  IconGaleri,
  IconPanahKanan,
  IconX,
} from '../../assets/icons';
import {useSelector, useDispatch} from 'react-redux';
import {saveImageCameraAction} from '../../../redux/action';
import ImageResizer from '@bam.tech/react-native-image-resizer';

type ImageData = {
  height: number;
  width: number;
  uri: string;
  fileSize: number;
  fileName: string;
  type: string;
};

const FotoPendukung = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const imageCameraSelector = useSelector((data: any) => data.imageCamera);
  const dataUser = {imageCamera: imageCameraSelector};
  const [imageCamera, setImageCamera] = useState(dataUser.imageCamera);
  const [isLoading, setIsLoading] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //akses diterima
        } else {
          console.log('Izin kamera ditolak');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const compressImage = async (data: ImageData) => {
    setIsLoading(true);
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        data.uri,
        1024,
        1024,
        'JPEG',
        100,
        0,
        undefined,
        true,
      );
      setIsLoading(false);
      setImageCamera({
        uri: resizedImage.uri,
        fileSize: resizedImage.size,
        type: data.type,
        fileName: resizedImage.name,
        height: resizedImage.height,
        width: resizedImage.width,
      });
    } catch (error) {
      setIsLoading(false);
      console.error('Kesalahan saat mengompres gambar:', error);
    }
  };

  const openCamera = () => {
    const options: any = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: true,
    };

    launchCamera(options, (res: ImagePickerResponse) => {
      if (res.didCancel) {
        console.log('Cancel ambil gambar');
      } else if (res.errorCode) {
        console.log(res.errorMessage);
      } else {
        const data = res.assets?.[0] as ImageData;
        if (data.fileSize > 1024 * 1024) {
          compressImage(data);
        } else {
          setImageCamera(data);
        }
      }
    });
  };

  const openGallery = () => {
    const options: any = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (res: ImagePickerResponse) => {
      if (res.didCancel) {
        console.log('Cancel memilih gambar dari galeri');
      } else if (res.errorCode) {
        console.log(res.errorMessage);
      } else {
        const data = res.assets?.[0] as ImageData;
        if (data.fileSize > 1024 * 1024) {
          compressImage(data);
        } else {
          setImageCamera(data);
        }
      }
    });
  };

  requestCameraPermission();

  const submitFoto = () => {
    dispatch(saveImageCameraAction(imageCamera));
    if (imageCamera === null) {
      navigation.navigate('SubmitLaporan');
    } else {
      const fileSizeInMB = imageCamera.fileSize / (1024 * 1024);
      if (fileSizeInMB > 2) {
        Alert.alert('Ukuran foto melebihi batas maksimal (2MB)');
      } else {
        navigation.navigate('SubmitLaporan');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        <Text style={styles.txtTitle}>
          Foto Pendukung{' '}
          <Text style={{fontFamily: MyFont.Primary}}>(Opsional)</Text>
        </Text>
        <Text style={styles.txt}>
          Silahkan memasukkan foto yang bisa mendukung & berhubungan dengan
          pelaporan Anda
        </Text>
        <Gap height={40} />
        {isLoading ? (
          <View style={{height: 100}}>
            <ActivityIndicator size="large" color={MyColor.Primary} />
          </View>
        ) : (
          imageCamera &&
          Object.keys(imageCamera).length !== 0 && (
            <View style={styles.imageContainer}>
              <View
                style={{
                  backgroundColor: 'black',
                }}>
                <TouchableOpacity
                  style={styles.deleteImage}
                  onPress={() => setImageCamera(null)}>
                  <IconX />
                </TouchableOpacity>
                <Image source={{uri: imageCamera.uri}} style={styles.image} />
              </View>
              <Text style={[styles.txtBtnImage, {padding: 10}]}>
                Ukuran gambar:{' '}
                {(imageCamera.fileSize / (1024 * 1024)).toFixed(2)} MB
              </Text>
            </View>
          )
        )}
        <Gap height={10} />
        <TouchableOpacity style={styles.btnImage} onPress={openGallery}>
          <IconGaleri stroke={'black'} />
          <Text style={styles.txtBtnImage}>Ambil dari Galeri</Text>
        </TouchableOpacity>
        <Gap height={20} />
        <TouchableOpacity style={styles.btnImage} onPress={openCamera}>
          <IconCamera stroke={'black'} />
          <Text style={styles.txtBtnImage}>
            Ambil gambar{'\n'}dengan kamera
          </Text>
        </TouchableOpacity>
        <Gap height={20} />
        <Text style={{fontFamily: MyFont.Primary, color: 'gray'}}>
          Anda hanya bisa mengirimkan maksimal 1 foto dengan ukuran maksimal 2
          MB. Untuk saat ini Anda belum bisa memasukkan video dalam pelaporan.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button
          label="Kembali"
          width={126}
          backgroundColor={MyColor.Light}
          textColor={MyColor.Primary}
          onClick={() => {
            dispatch(saveImageCameraAction(imageCamera));
            navigation.navigate('RincianKejadian');
          }}
        />
        <Button
          label="Lanjut"
          width={173}
          backgroundColor={MyColor.Primary}
          textColor="#efefef"
          onClick={submitFoto}
          icons={<IconPanahKanan />}
        />
      </View>
    </ScrollView>
  );
};

export default FotoPendukung;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  txt: {
    fontFamily: MyFont.Primary,
    color: '#212121',
    fontSize: 18,
  },
  txtTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: MyColor.Primary,
  },
  txtBtnImage: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: 'black',
  },
  txtDeleteImage: {
    fontFamily: MyFont.Primary,
    color: MyColor.Primary,
  },
  btnImage: {
    height: 73,
    paddingHorizontal: 30,
    flexDirection: 'row',
    columnGap: 20,
    backgroundColor: MyColor.Light,
    borderRadius: 20,
    alignItems: 'center',
  },
  image: {
    height: 300,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  imageContainer: {
    backgroundColor: MyColor.Light,
    borderRadius: 20,
    overflow: 'hidden',
  },
  deleteImage: {
    height: 40,
    width: 40,
    position: 'absolute',
    alignSelf: 'flex-end',
    zIndex: 50,
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
