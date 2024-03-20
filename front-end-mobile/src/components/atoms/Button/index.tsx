import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {IconPanahKanan} from '../../../assets/icons';
import {MyFont} from '../MyFont';

const Button = ({
  label,
  backgroundColor,
  textColor,
  width,
  onClick,
  icons,
}: any) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onClick}
        style={[
          styles.button,
          {
            flexDirection: 'row',
            columnGap: 10,
            backgroundColor: `${backgroundColor}`,
            width: width,
          },
        ]}>
        <Text style={[styles.label, {color: `${textColor}`}]}>{label}</Text>
        {icons && icons}
      </TouchableOpacity>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    alignSelf: 'center',
    borderRadius: 37,
    borderColor: '#007FA4',
    borderWidth: 2,
  },
  label: {
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});
