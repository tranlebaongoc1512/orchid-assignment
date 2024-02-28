import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from "@react-navigation/native"

export default function WelcomeScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => navigation.navigate('Root', { screen: 'Home' }), 2500)
    }, [])
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/orchidBackground.jpg')} style={styles.background}>
                <View style={styles.overlay}>
                    <StatusBar style='light' />
                    <View style={{
                        width: 350,
                        height: 350,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: 1000,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <View style={{
                            width: 260,
                            height: 260,
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            borderRadius: 1000,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Image source={require('../../assets/images/orchid.png')} style={styles.logo} />
                        </View>
                    </View>
                    <Text style={styles.title}>Phong Lan</Text>
                </View>
            </ImageBackground>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    overlay: {
        backgroundColor: 'rgba(4,42,17,0.8)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 180,
        height: 180,
    },
    title: {
        fontWeight: '600',
        fontSize: 42,
        color: 'white',
        marginTop: 40,
    },
})