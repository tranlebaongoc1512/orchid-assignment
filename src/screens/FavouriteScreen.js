import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const numCol = 2;
const columnWidth = windowWidth / numCol;

export default function FavouriteScreen() {
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation();
  const [favorites, setFavourites] = useState([]);
  const [checkMode, setCheckMode] = useState(false)
  const [checkList, setCheckList] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      getFavourites()
    }, [])
  );

  async function getFavourites() {
    try {
      setLoading(true)
      const data = await AsyncStorage.getItem('@Favourite');
      if (data !== null) {
        setFavourites(JSON.parse(data))
      } else {
        setFavourites([]);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      getFavourites()
    }, [])
  );
  const deleteFavourite = async (favorite) => {
    const newFavouriteOrchids = favorites.filter(orchid => orchid.id !== favorite.id)
    setFavourites(newFavouriteOrchids)
    const newCheckList = checkList.filter(orchid => orchid.id !== favorite.id)
    setCheckList(newCheckList)
    if (newFavouriteOrchids.length === 0) {
      setCheckMode(false)
    }
    AsyncStorage.setItem('@Favourite', JSON.stringify(newFavouriteOrchids))
  };

  const deleteAllFavourite = async () => {
    Alert.alert(
      'Bạn chắc chắn muốn xóa danh sách?',
      'Bạn không thể khôi phục thao tác này',
      [
        {
          text: 'Hủy',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            const newFavouriteOrchids = []
            setFavourites(newFavouriteOrchids)
            AsyncStorage.setItem('@Favourite', JSON.stringify(newFavouriteOrchids))
            setCheckMode(false)
            setCheckList([])
          },
        },
      ],
      { cancelable: false }
    );
  };

  const deleteCheckList = async () => {
    Alert.alert(
      'Bạn chắc chắn muốn xóa danh sách đã chọn?',
      'Bạn không thể khôi phục thao tác này',
      [
        {
          text: 'Hủy',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            const newFavouriteOrchids = favorites.filter(orchid => !checkList.some(item => item.id === orchid.id))
            setFavourites(newFavouriteOrchids)
            AsyncStorage.setItem('@Favourite', JSON.stringify(newFavouriteOrchids))
            setCheckMode(false)
            setCheckList([])
          },
        },
      ],
      { cancelable: false }
    );
  };

  const toggleCheckList = (orchid) => {
    const foundOrchid = checkList.find((check) => check.id === orchid.id);
    if (foundOrchid) {
      console.log("remove", orchid.id)
      const newCheckList = checkList.filter(orchid => orchid.id !== foundOrchid.id)
      setCheckList(newCheckList)
      AsyncStorage.setItem('@Favourite', JSON.stringify(newCheckList))
    } else {
      console.log("add", orchid.id)
      const newCheckList = [...checkList, orchid]
      setCheckList(newCheckList)
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>Danh sách yêu thích</Text>
        {favorites.length > 0 && (!checkMode ?
          <TouchableOpacity onPress={() => setCheckMode(true)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <Text style={styles.button}>Chọn</Text>
          </TouchableOpacity>
          :
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginRight: 10 }}>
            {checkList.length > 0 ?
              <TouchableOpacity onPress={deleteCheckList}>
                <Icon name={"delete"} color='#042a11' size={24} />
              </TouchableOpacity>
              : <TouchableOpacity onPress={deleteCheckList} disabled>
                <Icon name={"delete"} color='rgba(4,42,17,0.2)' size={24} />
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={deleteAllFavourite}>
              <Text style={styles.button}>Xóa hết</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setCheckMode(false)
              setCheckList([])
            }}>
              <Text style={styles.button}>Hủy</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {
        loading ?
          <ActivityIndicator style={{ marginTop: 65 }} size='large' color='#36632c' />
          : favorites.length === 0 ?
            <View style={{
              flex: 1,
              marginTop: 65,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white'
            }}>
              <Text style={styles.title}>
                Không có loại lan yêu thích nào
              </Text>
            </View>
            :
            <FlatList
              style={styles.flatList}
              data={favorites}
              keyExtractor={(item) => item.id}
              numColumns={numCol}
              renderItem={({ item }) => (
                <View style={styles.column}>
                  {!checkMode ?
                    <TouchableOpacity onPress={() => {
                      navigation.navigate('Detail', { orchid: item })
                    }}>
                      <Image source={{ uri: item.image }} style={styles.image} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => toggleCheckList(item)}>
                      <Image source={{ uri: item.image }} style={styles.image} />
                      {checkList.find(check => check.id === item.id) &&
                        <View style={styles.overlay}>
                          <Icon name={"checkcircle"} color='#fff' size={20} style={styles.checkIcon} />
                        </View>
                      }
                    </TouchableOpacity>
                  }
                  <View style={styles.actionView}>
                    <Text style={styles.orchidTitle}>{item.name}</Text>
                    <TouchableOpacity onPress={() => deleteFavourite(item)} style={{ position: 'absolute', top: 10, right: 5 }}>
                      <Icon name={"heart"} color='#36632c' size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
      }
    </View >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  flatList: {
    marginTop: 70,
  },
  toolbar: {
    paddingTop: 15,
    paddingBottom: 15,
    height: 65,
    width: windowWidth,
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    top: 0,
    justifyContent: 'space-between'
  },
  toolbarTitle: {
    fontSize: 24,
    paddingLeft: 10,
  },
  title: {
    fontSize: 24,
    marginTop: 10,
    textAlign: 'center',
  },
  column: {
    width: columnWidth,
    padding: 10,
  },
  image: {
    borderWidth: 1,
    width: columnWidth - 20,
    height: columnWidth - 20,
    resizeMode: 'cover',
    borderColor: '#36632c',
    borderRadius: 15,
  },
  overlay: {
    width: columnWidth - 20,
    height: columnWidth - 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    borderRadius: 15,
  },
  checkIcon: {
    position: 'absolute',
    right: 5,
    bottom: 5,
  },
  orchidTitle: {
    fontSize: 16,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 20,
  },
  actionView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    fontSize: 16,
    backgroundColor: "#86e172",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 15,
  },
})
