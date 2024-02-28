import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const numCol = 2;
const columnWidth = windowWidth / numCol;

export default function OrchidsView({ orchids }) {
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation();
    const [favouriteOrchids, setFavouriteOrchids] = useState([]);
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
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color='#36632c' />
            </View>
        )
    }
    return (
        <FlatList
            style={styles.container}
            data={orchids}
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
                        <TouchableOpacity onPress={() => toggleFavourite(item)} style={{ position: 'absolute', top: 10, right: 5 }}>
                            {favouriteOrchids.find(favouriteOrchid => favouriteOrchid.id === item.id) ?
                                <Icon name={"heart"} color='#36632c' size={20} /> :
                                <Icon name={"hearto"} color='#36632c' size={20} />}
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    column: {
        width: columnWidth,
        padding: 10,
    },
    image: {
        borderWidth: 1,
        width: columnWidth - 20,
        aspectRatio: 1,
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
});
