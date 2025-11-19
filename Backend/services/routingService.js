const Route = require('../models/Route');
const { calculateDistance } = require('./trackingService');

// Find optimal route between two points
const findOptimalRoute = async (origin, destination) => {
  try {
    // Parse origin and destination coordinates
    const originCoords = typeof origin === 'string' ? JSON.parse(origin) : origin;
    const destCoords = typeof destination === 'string' ? JSON.parse(destination) : destination;
    
    // Get all active routes
    const routes = await Route.find({ isActive: true })
      .populate('vehicles');
    
    // Find routes that pass near the origin and destination
    const matchingRoutes = routes.filter(route => {
      const originDistance = calculateDistance(
        originCoords.latitude,
        originCoords.longitude,
        route.origin.coordinates.latitude,
        route.origin.coordinates.longitude
      );
      
      const destDistance = calculateDistance(
        destCoords.latitude,
        destCoords.longitude,
        route.destination.coordinates.latitude,
        route.destination.coordinates.longitude
      );
      
      // Consider routes within 500m of origin and destination
      return originDistance <= 500 && destDistance <= 500;
    });
    
    // If no direct routes found, try to find routes with waypoints
    if (matchingRoutes.length === 0) {
      const routesWithWaypoints = routes.filter(route => {
        // Check if any waypoint is near the origin
        const originWaypoint = route.waypoints.find(waypoint => {
          const distance = calculateDistance(
            originCoords.latitude,
            originCoords.longitude,
            waypoint.coordinates.latitude,
            waypoint.coordinates.longitude
          );
          return distance <= 500;
        });
        
        // Check if any waypoint is near the destination
        const destWaypoint = route.waypoints.find(waypoint => {
          const distance = calculateDistance(
            destCoords.latitude,
            destCoords.longitude,
            waypoint.coordinates.latitude,
            waypoint.coordinates.longitude
          );
          return distance <= 500;
        });
        
        return originWaypoint && destWaypoint;
      });
      
      matchingRoutes.push(...routesWithWaypoints);
    }
    
    // Sort routes by fare (in a real app, you might consider other factors like travel time)
    matchingRoutes.sort((a, b) => a.fare - b.fare);
    
    // If still no routes found, return the closest routes to origin and destination
    if (matchingRoutes.length === 0) {
      const closestToOrigin = [...routes].sort((a, b) => {
        const distA = calculateDistance(
          originCoords.latitude,
          originCoords.longitude,
          a.origin.coordinates.latitude,
          a.origin.coordinates.longitude
        );
        
        const distB = calculateDistance(
          originCoords.latitude,
          originCoords.longitude,
          b.origin.coordinates.latitude,
          b.origin.coordinates.longitude
        );
        
        return distA - distB;
      }).slice(0, 3);
      
      const closestToDest = [...routes].sort((a, b) => {
        const distA = calculateDistance(
          destCoords.latitude,
          destCoords.longitude,
          a.destination.coordinates.latitude,
          a.destination.coordinates.longitude
        );
        
        const distB = calculateDistance(
          destCoords.latitude,
          destCoords.longitude,
          b.destination.coordinates.latitude,
          b.destination.coordinates.longitude
        );
        
        return distA - distB;
      }).slice(0, 3);
      
      // Combine and deduplicate
      const combinedRoutes = [...closestToOrigin, ...closestToDest];
      const uniqueRoutes = Array.from(new Set(combinedRoutes.map(route => route._id)))
        .map(id => combinedRoutes.find(route => route._id === id));
      
      matchingRoutes.push(...uniqueRoutes);
    }
    
    // Format the response
    const formattedRoutes = matchingRoutes.map(route => {
      // Calculate walking distance to route start
      const walkingDistanceToStart = calculateDistance(
        originCoords.latitude,
        originCoords.longitude,
        route.origin.coordinates.latitude,
        route.origin.coordinates.longitude
      );
      
      // Calculate walking distance from route end to destination
      const walkingDistanceToEnd = calculateDistance(
        destCoords.latitude,
        destCoords.longitude,
        route.destination.coordinates.latitude,
        route.destination.coordinates.longitude
      );
      
      return {
        ...route.toObject(),
        walkingDistanceToStart,
        walkingDistanceToEnd,
        totalWalkingDistance: walkingDistanceToStart + walkingDistanceToEnd
      };
    });
    
    return {
      success: true,
      routes: formattedRoutes
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Get directions for a specific route
const getDirections = async (routeId, origin, destination) => {
  try {
    const route = await Route.findById(routeId);
    
    if (!route) {
      return {
        success: false,
        message: 'Route not found'
      };
    }
    
    // Parse origin and destination coordinates
    const originCoords = typeof origin === 'string' ? JSON.parse(origin) : origin;
    const destCoords = typeof destination === 'string' ? JSON.parse(destination) : destination;
    
    // Find the nearest waypoint to the origin
    let nearestWaypointToOrigin = route.origin;
    let minDistanceToOrigin = calculateDistance(
      originCoords.latitude,
      originCoords.longitude,
      route.origin.coordinates.latitude,
      route.origin.coordinates.longitude
    );
    
    for (const waypoint of route.waypoints) {
      const distance = calculateDistance(
        originCoords.latitude,
        originCoords.longitude,
        waypoint.coordinates.latitude,
        waypoint.coordinates.longitude
      );
      
      if (distance < minDistanceToOrigin) {
        minDistanceToOrigin = distance;
        nearestWaypointToOrigin = waypoint;
      }
    }
    
    // Find the nearest waypoint to the destination
    let nearestWaypointToDest = route.destination;
    let minDistanceToDest = calculateDistance(
      destCoords.latitude,
      destCoords.longitude,
      route.destination.coordinates.latitude,
      route.destination.coordinates.longitude
    );
    
    for (const waypoint of route.waypoints) {
      const distance = calculateDistance(
        destCoords.latitude,
        destCoords.longitude,
        waypoint.coordinates.latitude,
        waypoint.coordinates.longitude
      );
      
      if (distance < minDistanceToDest) {
        minDistanceToDest = distance;
        nearestWaypointToDest = waypoint;
      }
    }
    
    // Get the index of these waypoints in the route
    const originIndex = nearestWaypointToOrigin === route.origin ? 0 : 
      route.waypoints.findIndex(wp => wp._id.toString() === nearestWaypointToOrigin._id.toString()) + 1;
    
    const destIndex = nearestWaypointToDest === route.destination ? route.waypoints.length + 1 :
      route.waypoints.findIndex(wp => wp._id.toString() === nearestWaypointToDest._id.toString()) + 1;
    
    // Create the route segment
    const routeSegment = [];
    
    if (originIndex <= destIndex) {
      // Normal direction
      if (originIndex === 0) {
        routeSegment.push(route.origin);
      } else {
        routeSegment.push(nearestWaypointToOrigin);
      }
      
      for (let i = originIndex; i < destIndex; i++) {
        if (i === 0) {
          routeSegment.push(route.origin);
        } else if (i <= route.waypoints.length) {
          routeSegment.push(route.waypoints[i - 1]);
        }
      }
      
      if (destIndex === route.waypoints.length + 1) {
        routeSegment.push(route.destination);
      } else {
        routeSegment.push(nearestWaypointToDest);
      }
    } else {
      // Reverse direction (in case the route is bidirectional)
      if (originIndex === route.waypoints.length + 1) {
        routeSegment.push(route.destination);
      } else {
        routeSegment.push(nearestWaypointToOrigin);
      }
      
      for (let i = originIndex; i > destIndex; i--) {
        if (i === route.waypoints.length + 1) {
          routeSegment.push(route.destination);
        } else if (i > 0) {
          routeSegment.push(route.waypoints[i - 1]);
        }
      }
      
      if (destIndex === 0) {
        routeSegment.push(route.origin);
      } else {
        routeSegment.push(nearestWaypointToDest);
      }
    }
    
    return {
      success: true,
      directions: {
        walkingToRoute: {
          from: originCoords,
          to: nearestWaypointToOrigin.coordinates,
          distance: minDistanceToOrigin
        },
        routeSegment,
        walkingFromRoute: {
          from: nearestWaypointToDest.coordinates,
          to: destCoords,
          distance: minDistanceToDest
        },
        totalDistance: minDistanceToOrigin + minDistanceToDest,
        estimatedDuration: route.estimatedDuration
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

module.exports = {
  findOptimalRoute,
  getDirections
};