import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Text, Button, Avatar, Card } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => logout() },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar.Icon size={80} icon="account" style={styles.avatar} />
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <Card style={styles.card}>
        <List.Section>
          <List.Item
            title="Wallet"
            description="Manage your wallet balance"
            left={(props) => <List.Icon {...props} icon="wallet" />}
            onPress={() => navigation.navigate('Wallet')}
          />
          <List.Item
            title="Payment Methods"
            description="Add or remove payment methods"
            left={(props) => <List.Icon {...props} icon="credit-card" />}
            onPress={() => navigation.navigate('PaymentMethods')}
          />
          <List.Item
            title="Trip History"
            description="View your past trips"
            left={(props) => <List.Icon {...props} icon="history" />}
            onPress={() => navigation.navigate('TripHistory')}
          />
          <List.Item
            title="Saved Locations"
            description="Manage your saved places"
            left={(props) => <List.Icon {...props} icon="map-marker-multiple" />}
            onPress={() => navigation.navigate('SavedLocations')}
          />
          <List.Item
            title="Settings"
            description="App settings and preferences"
            left={(props) => <List.Icon {...props} icon="cog" />}
            onPress={() => navigation.navigate('Settings')}
          />
          <List.Item
            title="Help & Support"
            description="Get help with the app"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            onPress={() => navigation.navigate('Help')}
          />
        </List.Section>
      </Card>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor="#F44336"
      >
        Logout
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#3f51b5',
  },
  avatar: {
    backgroundColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  card: {
    margin: 20,
    elevation: 3,
  },
  logoutButton: {
    margin: 20,
    borderColor: '#F44336',
  },
});

export default ProfileScreen;