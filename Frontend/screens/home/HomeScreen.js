import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button, Searchbar, ActivityIndicator, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import routeService from '../../services/routeService';
import ticketService from '../../services/ticketService';
import paymentService from '../../services/paymentService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [routes, setRoutes] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const routesData = await routeService.getRoutes();
      setRoutes(routesData);

      const balanceData = await paymentService.getWalletBalance();
      setWalletBalance(balanceData.balance);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTicket = async (route) => {
    try {
      const ticket = await ticketService.purchaseTicket({
        routeId: route._id,
        vehicleId: route.vehicles[0]?._id, // Select first available vehicle
        origin: route.origin,
        destination: route.destination,
        paymentMethod: 'In-App Wallet',
      });
      Alert.alert('Success', 'Ticket purchased successfully!');
      navigation.navigate('Tickets');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to purchase ticket');
    }
  };

  const renderRouteItem = ({ item }) => (
    <Card style={styles.routeCard}>
      <Card.Content>
        <View style={styles.routeHeader}>
          <Text style={styles.routeName}>{item.name}</Text>
          <Chip icon="cash" style={styles.fareChip}>
            ${item.fare}
          </Chip>
        </View>
        <View style={styles.routeDetails}>
          <View style={styles.location}>
            <Ionicons name="location" size={16} color="#4CAF50" />
            <Text style={styles.locationText}>From: {item.origin.name}</Text>
          </View>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#F44336" />
            <Text style={styles.locationText}>To: {item.destination.name}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Map', { routeId: item._id })}
            style={styles.actionButton}
          >
            View on Map
          </Button>
          <Button
            mode="contained"
            onPress={() => handleQuickTicket(item)}
            style={styles.actionButton}
            disabled={!item.vehicles || item.vehicles.length === 0}
          >
            Quick Ticket
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3f51b5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to TransitFlow</Text>
        <Card style={styles.walletCard}>
          <Card.Content>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletBalance}>${walletBalance.toFixed(2)}</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Profile', { screen: 'WalletTopUp' })}
            >
              Top Up
            </Button>
          </Card.Content>
        </Card>
      </View>

      <Searchbar
        placeholder="Search for routes..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <Text style={styles.sectionTitle}>Popular Routes</Text>
      <FlatList
        data={routes.filter(route => 
          route.name.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderRouteItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No routes found</Text>}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  walletCard: {
    elevation: 3,
  },
  walletLabel: {
    fontSize: 16,
    color: '#666',
  },
  walletBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3f51b5',
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  routeCard: {
    marginBottom: 15,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  fareChip: {
    backgroundColor: '#E8F5E9',
  },
  routeDetails: {
    marginBottom: 15,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default HomeScreen;