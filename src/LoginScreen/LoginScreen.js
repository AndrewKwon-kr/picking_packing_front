import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Label } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isLogined, setIsLogined] = useState();
  // const isLogined = AsyncStorage.getItem('access_token', (err, result) => {
  //   return result;
  // });
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const handleEmail = (text) => {
    setEmail(text);
  };
 
  const handlePassword = (text) => {
    setPassword(text);
  };
  console.log(apiUrl)
  const login = async (email, pass) => {
    const url = `${apiUrl}/auth/jwt/create/`;
    const row = { email: email, password: pass };

    axios
      .post(url, row)
      .then((response) => {
        try {
          if (response.status === 200) {
            const accessToken = response.data.access;
            // const refreshToken = response.data.refresh;
            storeData(accessToken)
            navigation.reset({routes: [{name: 'Home'}]});

            // setErpLoading(false);
          } else {
            alert('데이터를 등록해주세요');
            // setErpLoading(false);
          }
        } catch (err) {
          alert(err);
        }
      })
      .catch(() => {
        alert('비밀번호 또는 이메일이 틀렸습니다.');
        // setErpLoading(false);
      });
  };
  const logout = async () => {
    try {
      AsyncStorage.removeItem('access_token');
      navigation.reset({routes: [{name: 'Home'}]});
    } catch(err) {
      alert(err)
    }
  }
  const storeData = async (value) => {
    try {
      console.log('storeData success')
      const jsonValue = JSON.stringify(value);
      console.log(jsonValue)
      await AsyncStorage.setItem('access_token', jsonValue)
    } catch (e) {
      alert(e)
      // saving error
    }
  }
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('access_token', (err, result) => {
        return result;
      });
      setIsLogined(value);
      if(value !== null) {
        // value previously stored
      }
    } catch(e) {
      // error reading value
    }
  }

  useEffect(() => {
    // setIsLogined(getData());
    getData();
  }, [isLogined]);

  return (
      <View style={styles.container}>
      <ImageBackground source={require("../icons/background.png")} style={styles.background} >
      <View style={styles.login}>
        {!isLogined ?
          <>
          <Image source={require("../icons/logo.png")} style={styles.logo}></Image>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Email"
            placeholderTextColor="#d1d1d1"
            autoCapitalize="none"
            onChangeText={handleEmail}
          />
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            placeholder="Password"
            placeholderTextColor="#d1d1d1"
            autoCapitalize="none"
            onChangeText={handlePassword}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => login(email, password)}
          >
            <Text style={styles.submitButtonText}>Sign in</Text>
          </TouchableOpacity>
          <View style={styles.checkboxWrapper}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={() => setToggleCheckBox(!toggleCheckBox)}
              tintColors={{ true : '#228be6', false: '#d1d1d1' }}
            />
            <TouchableOpacity onPress={() => setToggleCheckBox(!toggleCheckBox)}>
              <Text style={styles.checkboxText}>자동 로그인</Text>
            </TouchableOpacity>
          </View>
          </>
        : <TouchableOpacity
            style={styles.submitButton}
            onPress={() => logout()}
          >
            <Text style={styles.submitButtonText}>로그 아웃</Text>
          </TouchableOpacity>
        }
      </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
  },
  background: {
    width: '80%',
    height: '100%',
    color: '#fff',
  },
  login: {
    width: '35%',
    height: '100%',
    left: '80%',
    display: 'flex',
    color: '#000',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 150,
    height: 100,
    resizeMode: 'contain'
  },
  input: {
    margin: 5,
    paddingLeft: 10,
    height: 30,
    borderColor: "#d1d1d1",
    borderWidth: 1,
    width: '80%',
    borderRadius: 3
  },
  submitButton: {
    backgroundColor: "#228be6",
    borderRadius: 3,
    paddingLeft: 10,
    height: 30,
    margin: 5,
    width: '80%',
    justifyContent: 'center'
  },
  submitButtonText: {
    color: "white",
    textAlign: 'center'
  },
  imgWrapper: {
    width: 500,
    height: 500
  },
  imgStyle: {
    width: 100,
    height: 100
  },
  checkboxWrapper: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  checkboxText: {
    color: "#d1d1d1",
    paddingTop: 7,
    fontSize: 12
  }
});
