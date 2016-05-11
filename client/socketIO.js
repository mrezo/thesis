import io from 'socket.io-client';
import { createUser } from './actions/map.js';
import { placeUserMarker, deleteUserMarker } from './actions/map';

export const socket = io();

export default function (store) {
  socket.on('createUser', (data) => {
    // =================================================
    // Gets the user coordinates
    // =================================================

    store.dispatch(createUser(data.title));

    const initialPosition = () => {
      let currentLocation;

      let showLocation = (position) => {
        currentLocation =
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      };

      const geoError = () => {
        console.log('Finding geolocation failed.');
      };

      const geoOptions = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      };

      const getWatchID = () => navigator.geolocation.getCurrentPosition(showLocation, geoError, geoOptions);

      const watchID = getWatchID();
      return { currentLocation, watchID };
    };

    const initCoords = initialPosition();
    console.log(initCoords);

    // update user with coords
    // socket.emit()

    // =================================================
    // Updates the user coordinates
    // =================================================

    const getUserLocationAndWatchID = (googleMap, title) => {
      let currentLocation = {};

      let showLocation = (position) => {
        console.log('Position', position);
        currentLocation =
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        // TODO: Pass Map as argument
        store.dispatch(deleteUserMarker(title));
        store.dispatch(placeUserMarker(googleMap, title, currentLocation));
        return currentLocation;
      };

      const geoError = () => {
        console.log('Finding geolocation failed.');
      };

      const geoOptions = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      };

      const getWatchID = () => navigator.geolocation.watchPosition(showLocation, geoError, geoOptions);

      const watchID = getWatchID();
      return { currentLocation, watchID };
    };

    store.dispatch(placeUserMarker(store.getState().mapReducer.map, data.title, coords.currentLocation));
    getUserLocationAndWatchID(store.getState().mapReducer.map, data.title);
  });
}
