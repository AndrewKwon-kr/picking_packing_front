import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function Test() {
  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState('');
  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    if (!result.cancelled) {
      setPickedImagePath(result.uri);
    }
  }

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    console.log(result);


    if (!result.cancelled) {
      setPickedImagePath(result.uri);
    }
  }
  const aiTest = async () => {
    const url = `https://malang.miraecit.com/dlImageDisc`;

    const localUri = pickedImagePath;
    const fileName = localUri.split('/').pop();

    const formData = new FormData();

    formData.append('factoryId', 'F21100500');
    formData.append('modelId', 'M21100500');
    formData.append('userId', 'mirae');
    formData.append('file', { uri: localUri, name: fileName, type: 'image/jpeg' });

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      }
    };
    console.log('AI 검수하기');
    // console.log(body);

    axios.post(url, formData, config).then((response) => {
      try {
        if(response) {
          console.log(response.data);
          Alert.alert(
            '테스트 결과',
            `${response.data.aiResult}와(과) 같이 인식되었습니다.`,
            [
              {
                text: "취소",
              },
              { 
                text: "확인",
              }
            ]
          );
        }
      } catch(err) {
        console.log(err);
      }
    })
    .catch((response) => {
      console.log(response);
    });
  }
  const handlerImage = () => {
    Alert.alert(
      "사진을 삭제 하시겠습니까?",
      '',
      [
        {
          text: "취소",
          style: "cancel"
        },
        { 
          text: "확인", 
          onPress: () => setPickedImagePath('')
        }
      ]
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.buttonContainer}>
        <Button onPress={showImagePicker} title="Select an image" />
        <Button onPress={openCamera} title="Open camera" />
        <Button onPress={aiTest} title="API 테스트" />
      </View>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => handlerImage()}>
        {pickedImagePath !== '' && 
          <Image source={{ uri: pickedImagePath }} style={styles.image} />
        }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 600,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  imageContainer: {
    padding: 30
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover'
  }
});