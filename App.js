import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginScreen from './src/LoginScreen/LoginScreen';
import PickingScreen from './src/PickingScreen/PickingScreen';
import PackingScreen from './src/PackingScreen/PackingScreen';
import BarcodeScanScreen from './src/PackingScreen/BarcodeScanScreen';
import CustomDrawer from './src/CustomDrawer/CustomDrawerScreen'
import Test from './src/PackingScreen/Test'
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName="Home" 
        drawerContent={(props) => <CustomDrawer {...props}/>}
      >
        <Drawer.Screen name="Home" component={LoginScreen} />
        <Drawer.Screen name="피킹작업" component={PickingScreen} />
        <Drawer.Screen name="패킹작업" component={PackingScreen} />
        <Drawer.Screen name="바코드스캔" component={BarcodeScanScreen} style={{display: 'none'}}
          options={{ drawerLabel: () => null, title: null, drawerIcon: () => null, hidden: true }}
        />
        <Drawer.Screen name="AI" component={Test} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerProfileIcon: {
    resizeMode: 'center',
    width: 150,
    height: 150,
    marginTop: 20,
  }
});
