import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Picker, ScrollView, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DataTable } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

const Stack = createStackNavigator();

export default function PackingScreen({ navigation }) {
  const [packingList, setPackingList] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [selectedValue, setSelectedValue] = useState("am");
  const [loading, setLoading] = useState(false);


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const postAM = (itemValue) => {
    setSelectedValue(itemValue);
    setPackingList([]);
    getData(itemValue);
  }
  const getData = async ( itemValue ) => {
    const url = `${apiUrl}/1/order/packed/`;
    const selectedDate = date.toISOString().substring(0,10);
    const row = { selectedDate: selectedDate, selectTime: itemValue };
    setLoading(true);

    axios
      .post(url, row)
      .then((response) => {
        try {
          if (response.status === 200) {
            const responseData = response.data.result;
            setPackingList(responseData.list);
            // navigation.reset({routes: [{name: 'Home'}]});
            console.log(responseData);
            setLoading(false);
          } else {
            alert('데이터를 등록해주세요');
            setLoading(false);
          }
        } catch (err) {
          alert(err);
        }
      })
      .catch((err) => {
        console.log(err)
        // alert('비밀번호 또는 이메일이 틀렸습니다.');
        setLoading(false);
      });
  };
  useEffect(() => {
    getData(selectedValue);
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.selectedDate}>
        <Button style={{ width: 20, height: 20 }} onPress={showDatepicker} title={date.toISOString().substring(0,10)} />
      </View>
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedValue}
          style={{ width: 120, height: 40, borderWidth: 1}}
          onValueChange={(itemValue, itemIndex) => postAM(itemValue)}
        >
          <Picker.Item label="오전" value="am" />
          <Picker.Item label="오후" value="pm" />
        </Picker>
      </View>
      <View style={styles.barcode}>
        <Button title="바코드 스캔" onPress={() => navigation.navigate('바코드스캔')}></Button>
      </View>
      <View style={styles.description}>
        <Text style={styles.descriptionText}>포장 완료된 송장 내역</Text>
      </View>
      
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>송장번호</DataTable.Title>
            <DataTable.Title>받는 사람</DataTable.Title>
            <DataTable.Title>포장일시</DataTable.Title>
            <DataTable.Title>담당자</DataTable.Title>
          </DataTable.Header>
          <ScrollView>
          {packingList.length !== 0 ? packingList.map((item) => (
            <DataTable.Row key={item.idx}>
              <DataTable.Cell>{item.trackingNumber}</DataTable.Cell>
              <DataTable.Cell>{item.receiver}</DataTable.Cell>
              <DataTable.Cell>{item.trackingAt.substring(0,16)}</DataTable.Cell>
              <DataTable.Cell>{item.packer}</DataTable.Cell>
            </DataTable.Row>
          ))
            : <View style={styles.indicator}>
            <ActivityIndicator size="large" color="#228be6" animating={loading}/>
            {loading ? <Text>로딩 중입니다...</Text> : <Text>해당 날짜에 자료가 없습니다.</Text>}
          </View>
        }
          </ScrollView>
        </DataTable>
      
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flex: 1
  },
  selectedDate: {
    position: 'relative',
    marginTop: 40,
    marginLeft: 20,
    width: 200,
    height: 20
  },
  picker: {
    position: 'relative',
    // marginTop: 20,
    marginLeft: 240,
    top: -20,
    width: 120,
    height: 40,
    borderWidth: 1
  },
  barcode: {
    position: 'relative',
    marginLeft: 700,
    top: -60,
    width: 160

  },
  description: {
    marginTop: -30,
    marginLeft: 20,
  },
  descriptionText: {
    fontSize: 20,
    fontWeight: 'bold'
  }, 
  indicator: {
    width: '100%',
    padding: 20
  }
})