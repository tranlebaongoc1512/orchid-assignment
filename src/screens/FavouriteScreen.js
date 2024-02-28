import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
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
    AsyncStorage.setItem('@Favourite', JSON.stringify(newFavouriteOrchids))
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>Danh sách yêu thích</Text>
      </View>
      {loading ?
        <ActivityIndicator style={{marginTop: 65}} size='large' color='#36632c' />
        : favorites.length === 0 ?
          <View style={{
            flex: 1,
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
                <TouchableOpacity onPress={() => {
                  navigation.navigate('Detail', { orchid: item })
                }}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                </TouchableOpacity>
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
    </View>
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
  },
  toolbarTitle: {
    fontSize: 24,
    width: windowWidth,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    marginTop: 10,
    textAlign: 'center'
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
  orchidTitle: {
    fontSize: 16,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 20,
  },
  actionView: {
    flexDirection: 'row',
    alignItems: 'center',
  }
})
