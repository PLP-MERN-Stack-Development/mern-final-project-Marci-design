import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { Button, Card, Text, ActivityIndicator } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

import routeService from '../../services/routeService';
import trackingService from '../../services/trackingService';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapScreen = () => {
  const route = useRoute();
  const { routeId } = route.params || {};
  const mapRef = useRef(null);
  
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (routeId) {
      loadRouteDetails(routeId);
    } else {
      loadNearbyVehicles();
    }
  }, [routeId]);

  const loadRouteDetails = async (id) => {
    setLoading(true);
    try {
      const routeData = await routeService.getRouteById(id);
      setSelectedRoute(routeData);
      
      const vehicleData = await trackingService.getVehiclesOnRoute(id);
      setVehicles(vehicleData);

      // Set map to show the entire route
      if (routeData.origin && routeData.destination) {
        const midPoint = {
          latitude: (routeData.origin.coordinates.latitude + routeData.destination.coordinates.latitude) / 2,
          longitude: (routeData.origin.coordinates.longitude + routeData.destination.coordinates.longitude) / 2,
        };
        setRegion({
          ...midPoint,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      }
    } catch (error) {
      console.error('Failed to load route details:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyVehicles = async () => {
    setLoading(true);
    try {
      // In a real app, get user's current location
      const userLocation = { latitude: -1.2921, longitude: 36.8219 }; // Nairobi
      setRegion({
        ...userLocation,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      
      const nearbyVehicles = await trackingService.getNearbyVehicles(userLocation.latitude, userLocation.longitude);
      setVehicles(nearbyVehicles);
    } catch (error) {
      console.error('Failed to load nearby vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRoutePolyline = () => {
    if (!selectedRoute) return null;
    
    const coordinates = [
      selectedRoute.origin.coordinates,
      ...selectedRoute.waypoints.map(wp => wp.coordinates),
      selectedRoute.destination.coordinates,
    ];
    
    return (
      <Polyline
        coordinates={coordinates}
        strokeColor="#3f51b5"
        strokeWidth={3}
      />
    );
  };

  const renderMarkers = () => {
    const markers = [];

    // Add route markers
    if (selectedRoute) {
      markers.push(
        <Marker
          key="origin"
          coordinate={selectedRoute.origin.coordinates}
          title="Origin"
          description={selectedRoute.origin.name}
          pinColor="green"
        />,
        <Marker
          key="destination"
          coordinate={selectedRoute.destination.coordinates}
          title="Destination"
          description={selectedRoute.destination.name}
          pinColor="red"
        />
      );

      selectedRoute.waypoints.forEach((waypoint, index) => {
        markers.push(
          <Marker
            key={`waypoint-${index}`}
            coordinate={waypoint.coordinates}
            title={waypoint.name}
            pinColor="yellow"
          />
        );
      });
    }

    // Add vehicle markers
    vehicles.forEach((vehicle) => {
      if (vehicle.driver && vehicle.driver.currentLocation) {
        markers.push(
          <Marker
            key={vehicle._id}
            coordinate={vehicle.driver.currentLocation}
            title={`${vehicle.type} - ${vehicle.plateNumber}`}
            description={`Driver: ${vehicle.driver.name}`}
          />
        );
      }
    });

    return markers;
  };

  if (loading || !region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3f51b5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region}
      >
        {renderRoutePolyline()}
        {renderMarkers()}
      </MapView>
      
      {selectedRoute && (
        <Card style={styles.routeInfoCard}>
          <Card.Content>
            <Text style={styles.routeName}>{selectedRoute.name}</Text>
            <Text>Fare: ${selectedRoute.fare}</Text>
            <Text>Est. Duration: {selectedRoute.estimatedDuration} mins</Text>
            <Text>Vehicles on route: {vehicles.length}</Text>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeInfoCard: {
    width: '90%',
    marginBottom: 20,
    elevation: 4,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default MapScreen;