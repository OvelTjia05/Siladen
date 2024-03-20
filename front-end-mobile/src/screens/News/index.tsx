import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {MyColor} from '../../components/atoms/MyColor';
import Header from '../../components/molecules/Header';
import {MyFont} from '../../components/atoms/MyFont';
import Gap from '../../components/atoms/Gap';

const News = () => {
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <Header backgroundTransparent />
      <View
        style={{
          flex: 1,
          // alignItems: 'center',
          // justifyContent: 'center',
          padding: 30,
        }}>
        <View>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 20,
              color: MyColor.Primary,
            }}>
            Informasi & Berita Kesehatan
          </Text>
          <Gap height={20} />
          <Text
            style={{fontFamily: MyFont.Primary, fontSize: 17, color: 'gray'}}>
            Untuk saat ini belum ada informasi dan berita kesehatan, terima
            kasih.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default News;

const styles = StyleSheet.create({});
