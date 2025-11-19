import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import ticketService from '../../services/ticketService';

const TicketsScreen = () => {
  const navigation = useNavigation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const ticketsData = await ticketService.getUserTickets();
      setTickets(ticketsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return '#4CAF50';
      case 'Used':
        return '#FF9800';
      case 'Expired':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const renderTicketItem = ({ item }) => (
    <Card style={styles.ticketCard}>
      <Card.Content>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketTitle}>{item.route.name}</Text>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={{ color: 'white' }}
          >
            {item.status}
          </Chip>
        </View>
        
        <View style={styles.ticketDetails}>
          <View style={styles.location}>
            <Ionicons name="location" size={16} color="#4CAF50" />
            <Text style={styles.locationText}>From: {item.origin.name}</Text>
          </View>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#F44336" />
            <Text style={styles.locationText}>To: {item.destination.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="car" size={16} color="#3f51b5" />
            <Text style={styles.detailText}>Vehicle: {item.vehicle.plateNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="cash" size={16} color="#3f51b5" />
            <Text style={styles.detailText}>Fare: ${item.fare}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="card" size={16} color="#3f51b5" />
            <Text style={styles.detailText}>Payment: {item.paymentMethod}</Text>
          </View>
        </View>
        
        <View style={styles.ticketActions}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('TicketDetails', { ticketId: item._id })}
            style={styles.actionButton}
          >
            View Details
          </Button>
          {item.status === 'Active' && (
            <Button
              mode="contained"
              onPress={() => navigation.navigate('QRCode', { qrCode: item.qrCode })}
              style={styles.actionButton}
            >
              Show QR Code
            </Button>
          )}
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
    <View style={styles.container}>
      <FlatList
        data={tickets}
        renderItem={renderTicketItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No tickets found</Text>}
      />
    </View>
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
  listContainer: {
    padding: 20,
  },
  ticketCard: {
    marginBottom: 15,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    // backgroundColor will be set dynamically
  },
  ticketDetails: {
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  ticketActions: {
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

export default TicketsScreen;