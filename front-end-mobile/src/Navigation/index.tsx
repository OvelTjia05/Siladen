import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import HomePage from '../screens/HomePage';
import History from '../screens/History';
import News from '../screens/News';
import Settings from '../screens/Settings';
import {
  IconHome,
  IconLaporan,
  IconRiwayat,
  IconSetting,
  iconNews,
} from '../assets/icons';
import {MyColor} from '../components/atoms/MyColor';
import RedirectPage from '../screens/RedirectPage';

const Tab = createBottomTabNavigator();

const CostumTab = ({children, onPress}: any) => (
  <TouchableOpacity
    style={{justifyContent: 'center', alignItems: 'center'}}
    onPress={onPress}>
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: MyColor.Primary,
      }}>
      {children}
    </View>
  </TouchableOpacity>
);

const Navigation = ({navigation, route}: any) => {
  const dataUser = route.params;
  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabContainer,
      }}>
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        // initialParams={dataUser}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View>
              <Image
                source={IconHome}
                resizeMode="contain"
                style={{
                  tintColor: focused ? MyColor.Primary : '#121212',
                  width: 35,
                  height: 35,
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        // initialParams={dataUser}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View>
              <Image
                source={IconRiwayat}
                resizeMode="contain"
                style={{
                  tintColor: focused ? MyColor.Primary : '#121212',
                  width: 35,
                  height: 35,
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Redirect"
        component={RedirectPage}
        initialParams={dataUser}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Image
              source={IconLaporan}
              resizeMode="contain"
              style={{
                tintColor: focused ? MyColor.Light : '#ffffff',
                width: 35,
                height: 35,
              }}
            />
          ),
          tabBarButton: props => <CostumTab {...props} />,
        }}
      />

      <Tab.Screen
        name="News"
        component={News}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View>
              <Image
                source={iconNews}
                resizeMode="contain"
                style={{
                  tintColor: focused ? MyColor.Primary : '#121212',
                  width: 50,
                  height: 50,
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View>
              <Image
                source={IconSetting}
                resizeMode="contain"
                style={{
                  tintColor: focused ? MyColor.Primary : '#121212',
                  width: 35,
                  height: 35,
                }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    height: 60,
    margin: 20,
    elevation: 5,
    position: 'absolute',
  },
});
