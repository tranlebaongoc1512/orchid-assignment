import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getCategories } from '../api/category'
import CategoryView from '../components/CategoryView';

const windowWidth = Dimensions.get('window').width;
export default function HomeScreen() {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([]);
    async function getAllCategories() {
        try {
            setLoading(true)
            const data = await getCategories();
            setCategories(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getAllCategories()
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.toolbar}>
                <Text style={styles.toolbarTitle}>Trang chủ</Text>
            </View>
            {loading ?
                <ActivityIndicator style={{marginTop: 65}} size='large' color='#36632c' />
                :
                <View style={{ marginTop: 70, flex: 1 }}>
                    <CategoryView categories={categories} />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
})