import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Image, Text, ActivityIndicator } from 'react-native';
import { getOrchidsByCategory } from '../api/orchid';
import OrchidsView from './OrchidsView'

export default function CategoryView({ categories }) {
  const [loading, setLoading] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [orchids, setOrchids] = useState([]);
  useEffect(() => { handleCategoryPress(categories[0]) }, [])

  const handleCategoryPress = async (category) => {
    try {
      setLoading(true)
      setSelectedCategoryId(category.id);
      const orchids = await getOrchidsByCategory(category.id);
      setOrchids(orchids);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listContainer}
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCategoryPress(item)} style={styles.category}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 5,
                marginTop: 5,
                width: 72,
                height: 72,
                borderStyle: 'solid',
                borderWidth: 2,
                borderRadius: 36,
                borderColor: selectedCategoryId === item.id ? '#003e17' : '#5ca34c',
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.categoryImage}
              />
            </View>
            <Text style={{
              fontWeight: selectedCategoryId === item.id ? '600' : '400',
              color: selectedCategoryId === item.id ? '#003e17' : '#5ca34c',
              textAlign: 'center'
            }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {loading
        ? <ActivityIndicator size='large' color='#36632c' />
        : <OrchidsView orchids={orchids} />
      }
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    maxHeight: 120,
    padding: 10
  },
  category: {
    width: 110,
    alignItems: 'center',
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  }
})
