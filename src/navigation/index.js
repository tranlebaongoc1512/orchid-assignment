import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Entypo'
import FavouriteScreen from '../screens/FavouriteScreen'
import HomeScreen from '../screens/HomeScreen'
import WelcomeScreen from '../screens/WelcomeScreen'
import DetailScreen from '../screens/DetailScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Welcome' component={WelcomeScreen} />
                <Stack.Screen name='Detail' component={DetailScreen} />
                <Stack.Screen
                    name="Root"
                    component={BottomTabNavigator}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
const BottomTabNavigator = () => {

    const activeColor = "#5ca34c"
    const inactiveColor = "#fff"

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabNavigator,
                tabBarInactiveTintColor: inactiveColor,
                tabBarActiveTintColor: activeColor,
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <Icon name={"home"} color={focused ? activeColor : inactiveColor} size={28} />
                    },
                    tabBarLabel: 'Trang Chủ',
                }} />
            <Tab.Screen name="Favourite" component={FavouriteScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <Icon name={"heart"} color={focused ? activeColor : inactiveColor} size={28} />
                    },
                    tabBarLabel: 'Yêu thích',
                }} />
        </Tab.Navigator>
    )
}
const styles = StyleSheet.create({
    tabIcon: {
        width: 24,
        height: 24,
    },
    tabNavigator: {
        paddingTop: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: '#042a11'
    }
});