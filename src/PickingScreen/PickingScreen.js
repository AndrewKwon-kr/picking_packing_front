import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Picker, ScrollView, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DataTable } from 'react-native-paper';
import axios from 'axios';
import getEnvVars from '../../environment';
const { apiUrl } = getEnvVars();

export default function PickingScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [selectedValue, setSelectedValue] = useState("am");
  const [pickingList, setPickingList] = useState([]);
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
    setPickingList([]);
    getData(itemValue);
  }
  const getData = async ( itemValue ) => {
    const selectedDate = date.toISOString().substring(0,10);
    const url = `${apiUrl}/1/order/quantity-check/`;
    const row = { selectedDate: selectedDate, selectTime: itemValue };
    setLoading(true);

    axios
      .post(url, row)
      .then((response) => {
        try {
          if (response.status === 200) {
            const responseData = response.data.result;
            setPickingList(responseData);
            setLoading(false);
            // navigation.reset({routes: [{name: 'Home'}]});
            console.log(responseData)
            // setErpLoading(false);
          } else {
            alert('데이터를 등록해주세요');
            setLoading(false);
            // setErpLoading(false);
          }
        } catch (err) {
          alert(err);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        // alert('비밀번호 또는 이메일이 틀렸습니다.');
        // setErpLoading(false);
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
          onValueChange={(itemValue) => postAM(itemValue)}
        >
          <Picker.Item label="오전" value="am" />
          <Picker.Item label="오후" value="pm" />
        </Picker>
      </View>
      <View style={styles.description}>
        <Text style={styles.descriptionText}>조별 피킹 목록</Text>
      </View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>물품명</DataTable.Title>
            <DataTable.Title>수량</DataTable.Title>
          </DataTable.Header>
          <ScrollView>
          {pickingList.length !== 0 ? pickingList.map((item) => (
            <DataTable.Row key={item.idx}>
              <DataTable.Cell>{item.name}</DataTable.Cell>
              <DataTable.Cell>{item.counts}</DataTable.Cell>
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
  description: {
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