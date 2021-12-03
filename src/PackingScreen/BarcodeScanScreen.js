import React, { useState, useEffect } from 'react';
import { Image, Text, View, StyleSheet, Button, Alert, ScrollView, TouchableOpacity  } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';
import { Table, Row, Rows, TableWrapper, Col } from 'react-native-table-component';
import styled from 'styled-components/native'
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

const { width } = Dimensions.get('window');
const qrSize = width * 0.2;

export default function BarcodeScanScreen({ navigation }) {
  const [datas, setDatas] = useState();
  const [items, setItems] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraType, setCameraType] = useState(BarCodeScanner.Constants.Type.back);
  const [isBarcodeData, setIsBarcodeData] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(
      "바코드를 스캔했습니다.",
      data,
      [
        {
          text: "취소",
          onPress: () => setScanned(false),
          style: "cancel"
        },
        { text: "확인", 
          onPress: () => getData(data)
        }
      ]
    );
  };
  // const scannedBarcode = (data) => {
  //   setIsBarcodeData(true);
  //   setBarcode(data);
  // }
  const handlerClicked = (idx) => {
    console.log('before', datas)
    setItems(
      items.map((item) => {
        if (item.idx === idx) {
          return { ...item, checked: !item.checked }
        } else return { ...item }
      })
    )
  }

  const getData = async ( trackingNumber ) => {
    const url = `${apiUrl}/1/order/packing-box/`;
    const row = { trackingNumber: trackingNumber };
    
    const responseData = {
      "address": "전라남도 화순군 화순읍 오성로 558 (화순읍, 화순 3차 서라아파트) 301동 505호",
      "items":  [
         {
          "checked": false,
          "code": "100000-0176",
          "idx": 1,
          "image": 'https://www.malanghoney.com/web/product/big/202108/773bb4e7139421ad6d93c1e1de862635.jpg',
          "isFreebie": false,
          "isPrint": false,
          "name": "말랑하니 욕실 스티커북/라지",
          "quantity": 6
        },
         {
          "checked": false,
          "code": "100000-0380",
          "idx": 2,
          "image": 'https://www.malanghoney.com/web/product/big/202108/773bb4e7139421ad6d93c1e1de862635.jpg',
          "isFreebie": false,
          "isPrint": true,
          "name": "말랑하니 방 스티커북/미디움",
          "quantity": 3
        },
        {
          "checked": false,
          "code": "100000-0176",
          "idx": 3,
          "image": 'https://www.malanghoney.com/web/product/big/202108/773bb4e7139421ad6d93c1e1de862635.jpg',
          "isFreebie": true,
          "isPrint": false,
          "name": "말랑하니 엄마매트_내추럴아이보리/스몰",
          "quantity": 5
        },
         {
          "checked": false,
          "code": "100000-0380",
          "idx": 4,
          "image": 'https://www.malanghoney.com/web/product/medium/202108/be60a12722be48ddc9ec6fc8a9785ac1.jpg',
          "isFreebie": false,
          "isPrint": true,
          "name": "말랑하니 욕실매트_다크네이비/라지",
        },
        {
          "checked": false,
          "code": "100000-0176",
          "idx": 5,
          "image": 'https://www.malanghoney.com/web/product/medium/202109/9dbe2155c98c38816b76ee808528d90d.png',
          "isFreebie": true,
          "isPrint": false,
          "name": "말랑하니 아빠매트_다크네이비/미디움",
        },
         {
          "checked": false,
          "code": "100000-0380",
          "idx": 6,
          "image": 'https://www.malanghoney.com/web/product/medium/202108/be60a12722be48ddc9ec6fc8a9785ac1.jpg',
          "isFreebie": false,
          "isPrint": true,
          "name": "말랑하니 아들매트_다크네이비/스몰",
        },
        {
          "checked": false,
          "code": "100000-0380",
          "idx": 7,
          "image": 'https://www.malanghoney.com/web/product/medium/202108/be60a12722be48ddc9ec6fc8a9785ac1.jpg',
          "isFreebie": false,
          "isPrint": false,
          "name": "말랑하니 딸매트_화이트/스몰",
        },

      ],
      "message": "택배, 등기, 소포",
      "receiver": "김기현(김수지)",
      "trackingNumber": "421746116282",
    }
    setDatas(responseData);
    setItems(responseData.items);
    setIsBarcodeData(true);


    axios
      .post(url, row)
      .then((response) => {
        try {
          console.log(response)
          if (response.data.code === 200) {
            const responseData = response.data.result;
            console.log(responseData);
            
            setDatas(responseData);
            setItems(responseData.items);
            setIsBarcodeData(true);
          } else if (response.data.code === 204) {
            setIsBarcodeData(false);
            setScanned(false);
            alert('포장이 완료된 송장 번호입니다.');
            }
        } catch (err) {
          console.log(items)
          setIsBarcodeData(false);
          setScanned(false);
          alert('포장이 완료된 송장 번호입니다.');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const postData = async () => {
    const url = `${apiUrl}/1/order/completed/`;
    const body = { trackingNumber: datas.trackingNumber, packer: "권혁진" };

    axios
      .post(url, body)
      .then((response) => {
        try {
          if (response.status === 200) {
            const responseData = response.data.result;
            navigation.reset({routes: [{name: '패킹작업'}]});
            console.log(responseData)
            setIsBarcodeData(false);
          } else {
            alert('데이터를 등록해주세요');
          }
        } catch (err) {
          alert(err);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsBarcodeData(false);
        navigation.reset({routes: [{name: '패킹작업'}]});
        // alert('비밀번호 또는 이메일이 틀렸습니다.');
      });
  }
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
      aiTest(result.uri);
    }
  }
  const aiTest = async ( imagePath ) => {
    const url = `https://malang.miraecit.com/dlImageDisc`;

    const localUri = imagePath;
    const fileName = localUri.split('/').pop();

    const formData = new FormData();

    formData.append('factoryId', 'F21100500');
    formData.append('modelId', 'M21100500');
    formData.append('userId', 'admin');
    formData.append('file', { uri: localUri, name: fileName, type: 'image/jpeg' });

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      }
    };
    console.log('AI 검수하기');
    // console.log(body);
    const response = await axios.post(url, formData, config).then((res) => res.data.aiResult);
    console.log(response)
    try {
      if(response) {
        Alert.alert(
          'AI검수 결과',
          `${response}와(과) 같이 인식되었습니다.`,
          [
            { 
              text: "확인",
            }
          ]
        );

        setItems(
          items.map((item) => {
            if (item.name.search(response) !== -1) {
              return { ...item, checked: true }
            } else return { ...item }
          })
        )
      }
    } catch (err) {
      console.log(err)
    }

    // axios.post(url, formData, config).then((response) => {
    //   try {
    //     if(response) {
    //       console.log(response.data);
    //       Alert.alert(
    //         '테스트 결과',
    //         `${response.data.aiResult}와(과) 같이 인식되었습니다.`,
    //         [
    //           {
    //             text: "취소",
    //           },
    //           { 
    //             text: "확인",
    //           }
    //         ]
    //       );
    //     }
    //   } catch(err) {
    //     console.log(err);
    //   }
    // })
    // .catch((response) => {
    //   console.log(response);
    // });
  }
  
  if (hasPermission === null) {
    return <Text style={styles.permissionText}>권한을 요구하는 중입니다.</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.permissionText}>접근 가능한 카메라가 없습니다.</Text>;
  }

  return (
    <View
      style={{
      flex: 1,
      flexDirection: 'column',
      // justifyContent: 'flex-end',
    }}>
      {!isBarcodeData ? (<BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, styles.barcodeContainer]}
        type={cameraType}
      >
        <Text style={styles.description}>바코드를 스캔합니다.</Text>
        <Image
          style={styles.qr}
          source={require("../icons/scan_area.png")}
        />
        <Text onPress={() => navigation.reset({routes: [{name: '패킹작업'}]})} style={styles.cancel}>
          취소
        </Text>
        <Text 
          style={styles.cameraTypeButton}
          onPress={() => setCameraType(
          cameraType === BarCodeScanner.Constants.Type.back
            ? BarCodeScanner.Constants.Type.front
            : BarCodeScanner.Constants.Type.back
        )}>
          캠전환
        </Text>
      </BarCodeScanner>
      ) : (
      <View style={styles.pakingContainer}>
        <View style={styles.scrollContainer}>
          <ScrollView style={styles.scrollView} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {items &&
              items.map((item) => {
                return (
                  <ImageCard 
                    key={item.idx}
                    clicked={item.checked}
                    onPress={() => handlerClicked(item.idx)}
                  >
                    <Image
                      style={styles.optionImage}
                      source={{
                        uri: item.image
                      }}
                    />
                    {/* <Text style={styles.optionName} numberOfLines={1}>{item.name}</Text> */}
                    {item.isFreebie &&
                      <Text style={styles.freebieText}>사은품</Text>
                    }
                    {item.isPrint &&
                      <Text style={styles.printText}>전단지</Text>
                    }
                    {(!item.isFreebie && !item.isPrint) &&
                      <Text style={styles.mainItemText}>본품</Text>
                    }
                    <Text style={styles.nameText}>이름 : {item.name.split('/')[0]}</Text>
                    <Text style={styles.nameText}>옵션 : {item.name.split('/')[1]}</Text>
                    <Text style={styles.nameText}>수량 : {item.quantity}</Text>
                  </ImageCard>
                )
              })
            }
          </ScrollView>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', marginTop: -12 }}>
          <View style={{ flex: 0.5, flexDirection: 'column' }}>
            <Table style={styles.table} borderStyle={{ borderWidth: 1 }}>
              <TableWrapper style={styles.wrapper}>
                <Col data={['송장번호', '수령인']} style={styles.title} heightArr={[20,21]} textStyle={styles.text}/>
                <Rows 
                  data={[[datas.trackingNumber], [datas.receiver]]} 
                  style={styles.row} 
                  textStyle={styles.text}
                  flexArr={[1]}
                />
              </TableWrapper>
            </Table>
            <Table style={styles.table} borderStyle={{borderWidth: 1}}>
              <TableWrapper style={styles.wrapper}>
                <Col data={['배송 메시지']} style={styles.title} heightArr={[150]} textStyle={styles.importantText}/>
                <Rows 
                  data={[[datas.message]]} 
                  style={styles.importantTextRow} 
                  textStyle={styles.importantText}
                  flexArr={[1]}
                />
              </TableWrapper>
            </Table>
          </View>
          <View style={{marginLeft: 20, flex: 0.5, flexDirection: 'row', marginBottom: 15}}>
          <TouchableOpacity style={styles.aiButton} onPress={() => openCamera()}>
            <Text style={{fontSize: 20, color: 'white'}}>AI 검수하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.completeButton} onPress={() => postData()}>
            <Text style={{fontSize: 20, color: 'white'}}>완료</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
      )
      }
      
      {/* {scanned && (
        <View style={styles.againButton}>
          <Button title={'재시도'} onPress={() => setScanned(false)} />
        </View>
      )} */}
    </View>
  );
}
// const ImageCard = styled.TouchableOpacity`
//   margin-bottom: 20px;
//   margin-right: 20px;
//   border: ${(props) => (props.clicked ? '4px solid #228be6' : 'none')};
//   border-radius: 5px;
//   width: 150px;
//   height: 150px;
// `;
const ImageCard = styled.TouchableOpacity`
  margin-bottom: 20px;
  margin-right: 20px;
  border: ${(props) => (props.clicked ? '4px solid #228be6' : 'none')};
  border-radius: 5px;
  width: 100%;
  height: 150px;
  padding: ${(props) => (props.clicked ? '6px' : '10px')};
  background-color: rgba(0, 0, 0, 0.6);
`;
const styles = StyleSheet.create({
  barcodeContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    flexDirection: 'column'
  },
  pakingContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    flexDirection: 'row'
  },
  permissionText: {
    margin: 40,
    fontSize: 20
  },
  qr: {
    marginTop: '5%',
    width: qrSize,
    height: qrSize,
  },
  description: {
    fontSize: width * 0.04,
    marginTop: '2%',
    textAlign: 'center',
    width: '70%',
    color: 'white',
  },
  cancel: {
    marginTop: 60,
    fontSize: width * 0.02,
    textAlign: 'center',
    width: '70%',
    color: 'white',
  },
  againButton: {
    paddingLeft: 200,
    paddingRight: 200,
    marginTop: 400
  },
  cameraTypeButton: {
    marginTop: 10,
    fontSize: width * 0.02,
    textAlign: 'center',
    width: '85%',
    color: 'white',
  },
  table: {
    marginLeft: 20,
    width: '90%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    
    elevation: 24,
  },
  wrapper: { 
    flexDirection: 'row' 
  },
  title: { 
    flex: 0.5,
    backgroundColor: '#edf5ff' 
  },
  row: { 
    height: 20,
    backgroundColor: '#fff'
  },
  importantTextRow: {
    height: 150,
    backgroundColor: '#fff'
  },
  text: { 
    textAlign: 'center'
  },
  importantText: { 
    textAlign: 'center',
    fontWeight: 'bold'
  },
  scrollContainer: {
    width: '60%',
    backgroundColor: '#edf5ff',
    marginTop: -25,
    height: '100%',
    marginLeft: 10
  },
  scrollView: {
    display: 'flex',
    marginHorizontal: 30,
    marginVertical: 20,
    width: '90%',
  },
  scrollViewText: {
    fontSize: 40
  },
  optionImage: {
    width: 130,
    height: 130
  },
  // optionName: {
  //   marginTop: -29,
  //   height: 29,
  //   backgroundColor: 'rgba( 0, 0, 0, 0.5)',
  //   color: 'white',
  //   width: '100%',
  //   padding: 5,
  //   textAlign: 'center',
  // },
  nameText: {
    marginTop: 5,
    color: 'white',
    top: -130,
    left: 160,
    fontSize: 18,
    width: 340,
  },
  freebieText: {
    top: -130,
    left: 160,
    width: 50,
    color: 'white',
    backgroundColor: '#f99386',
    textAlign: 'center',
  },
  printText: {
    top: -130,
    left: 160,
    width: 50,
    color: 'white',
    backgroundColor: '#69ddb6',
    textAlign: 'center'
  },
  mainItemText: {
    top: -130,
    left: 160,
    width: 50,
    color: 'white',
    backgroundColor: '#228be6',
    textAlign: 'center'
  },

 
  // freebieText: {
  //   top: -135,
  //   left: 5,
  //   width: 50,
  //   color: 'white',
  //   backgroundColor: '#f99386',
  //   textAlign: 'center'
  // },
  // printText: {
  //   top: -135,
  //   left: 5,
  //   width: 50,
  //   color: 'white',
  //   backgroundColor: '#69ddb6',
  //   textAlign: 'center'
  // },
  imageCard: {
    marginBottom: 30,
    marginRight: 20,
  },
  aiButton: {
    flex: 1,
    justifyContent: 'center',
    width: '45%',
    marginRight: 20,
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#fd9f28',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  completeButton: {
    flex: 1,
    justifyContent: 'center',
    width: '45%',
    marginRight: 20,
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#228be6',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  }
});