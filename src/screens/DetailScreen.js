import { View, Text, Image, StyleSheet, Dimensions, Linking, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign'
import Icon2 from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;

export default function DetailScreen() {
  const navigation = useNavigation()
  const route = useRoute();
  const { orchid } = route.params
  const [favouriteOrchids, setFavouriteOrchids] = useState([]);
  const [loading, setLoading] = useState(false)
  const toggleFavourite = async (orchid) => {
    const foundFavouriteOrchid = favouriteOrchids.find((favouriteOrchid) => favouriteOrchid.id === orchid.id);
    if (foundFavouriteOrchid) {
      console.log("remove", orchid.id)
      const newFavouriteOrchids = favouriteOrchids.filter(orchid => orchid.id !== foundFavouriteOrchid.id)
      setFavouriteOrchids(newFavouriteOrchids)
      AsyncStorage.setItem('@Favourite', JSON.stringify(newFavouriteOrchids))
    } else {
      console.log("add", orchid.id)
      const newFavouriteOrchids = [...favouriteOrchids, orchid]
      setFavouriteOrchids(newFavouriteOrchids)
      AsyncStorage.setItem('@Favourite', JSON.stringify(newFavouriteOrchids))
    }
  };
  async function getFavourites() {
    try {
      setLoading(true)
      const data = await AsyncStorage.getItem('@Favourite');
      if (data !== null) {
        setFavouriteOrchids(JSON.parse(data))
      } else {
        setFavouriteOrchids([]);
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
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#36632c' />
      </View>
    )
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
          <Icon2 name={"chevron-back"} color='#042a11' size={36} />
        </TouchableOpacity>
        <Text style={styles.toolbarTitle}>Chi tiết</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Root', { screen: 'Favourite' })} style={styles.button}>
          <Icon name={"heart"} color='#042a11' size={32} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Image source={{ uri: orchid.image }} style={styles.image} />
        <View style={{ alignSelf: 'center', marginLeft: 20 }}>
          <Text style={[styles.orchidSubTitle, { marginTop: 0 }]}>Nhiệt độ</Text>
          <Text style={styles.orchidSubDescription}>{orchid.minTemperature} - {orchid.maxTemperature} <Text style={styles.orchidSubUnit}>°C</Text></Text>
          <Text style={styles.orchidSubTitle}>Độ ẩm</Text>
          <Text style={styles.orchidSubDescription}>{orchid.minHumidity} - {orchid.maxHumidity} <Text style={styles.orchidSubUnit}>%</Text></Text>
          <Text style={styles.orchidSubTitle}>Chiều cao</Text>
          <Text style={styles.orchidSubDescription}>{orchid.minHeight} - {orchid.maxHeight} <Text style={styles.orchidSubUnit}>cm</Text></Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <Text style={styles.orchidTitle}>{orchid.name}</Text>
        <TouchableOpacity onPress={() => toggleFavourite(orchid)} style={styles.heart}>
          {favouriteOrchids?.find(favouriteOrchid => favouriteOrchid.id === orchid.id) ?
            <Icon name={"heart"} color='#36632c' size={28} /> :
            <Icon name={"hearto"} color='#36632c' size={28} />}
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>{orchid.description}</Text>
    </ScrollView >
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  image: {
    width: 250,
    height: 380,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    resizeMode: 'cover',
  },
  orchidTitle: {
    fontSize: 28,
    marginLeft: 20,
  },
  description: {
    fontSize: 16,
    marginLeft: 20,
    color: '#36632c',
    marginTop: 20,
    marginRight: 20,
  },
  orchidSubTitle: {
    fontSize: 18,
    marginTop: 50,
    color: '#042a11',
  },
  orchidSubDescription: {
    fontSize: 32,
    fontWeight: '400',
  },
  orchidSubUnit: {
    fontSize: 24,
    color: '#042a11',
  },
  heart: {
    marginRight: 20,
  },
  toolbar: {
    height: 65,
    paddingTop: 15,
    paddingBottom: 15,
    width: windowWidth,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  toolbarTitle: {
    fontSize: 24,
    textAlign: 'center'
  },
  button: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 20,
    borderRadius: 20,
  }
})