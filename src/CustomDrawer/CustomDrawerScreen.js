import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';

const CustomDrawer = ({ navigation }) => {
  return (
    <View>
      <Image
        style={styles.logo}
        source={require("../icons/logo.png")}
      />
      <View style={styles.button}>
        <Button
          title="Home"
          color="#228be6"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="피킹작업"
          color="#228be6"
          onPress={() => navigation.navigate('피킹작업')}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="패킹작업"
          color="#228be6"
          onPress={() => navigation.navigate('패킹작업')}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="AI 검수 테스트"
          color="#228be6"
          onPress={() => navigation.navigate('AI')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    margin: 30,
    width: 160, 
    height: 60
  },
  button: {
    marginBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#fff'
  }
})
export default CustomDrawer;