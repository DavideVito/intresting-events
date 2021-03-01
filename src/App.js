import React, { Suspense } from 'react';
import { useState } from 'react';
import "./App.css"
import MapGL, {
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl, GeolocateControl,

} from 'react-map-gl';





import MyNavbar from "./Nabar"

import { FirebaseAppProvider } from "reactfire"
import "firebase/firestore"
import "firebase/storage"
import Pins from './pins';
import EventsInfo from './events-info';




const positionOptions = { enableHighAccuracy: true };


const TOKEN = 'pk.eyJ1IjoiZGF2aWRldml0byIsImEiOiJja2xudThhZmwwbWwyMm5sNmJ2em5rcGJpIn0.rbxs4mL5xdIMEQZ-x6xE1A'; // Set your mapbox token here

const firebaseConfig = {
  apiKey: "AIzaSyAjljL1SE8qU2IJwhx1qcJ6RFL0UlA2Km8",
  authDomain: "intresting-2cfb2.firebaseapp.com",
  projectId: "intresting-2cfb2",
  storageBucket: "intresting-2cfb2.appspot.com",
  messagingSenderId: "23725437785",
  appId: "1:23725437785:web:d6a185f65db213ccd19248",
  measurementId: "G-G7L5C254VX"
}

const geolocateStyle = {
  top: 0,
  left: 0,
  padding: '10px'
};

const fullscreenControlStyle = {
  top: 36,
  left: 0,
  padding: '10px'
};

const navStyle = {
  top: 72,
  left: 0,
  padding: '10px'
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: '10px'
};

export default function App() {
  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3.5,
    bearing: 0,
    pitch: 0
  });
  const [popupInfo, setPopupInfo] = useState(null);




  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>



      <MyNavbar appearance="subtle" />

      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={setViewport}
        mapboxApiAccessToken={TOKEN}
      >
        <Suspense fallback={<div>Loading Events</div>}>
          <Pins onClick={setPopupInfo} />
        </Suspense>


        {popupInfo && (
          <Popup
            tipSize={5}
            anchor="top"
            longitude={popupInfo.location.longitude}
            latitude={popupInfo.location.latitude}
            closeOnClick={false}
            onClose={setPopupInfo}
          >
            <EventsInfo info={popupInfo} />
          </Popup>
        )}

        <GeolocateControl style={geolocateStyle} />
        <FullscreenControl style={fullscreenControlStyle} />
        <NavigationControl style={navStyle} />
        <ScaleControl style={scaleControlStyle} />

        <GeolocateControl
          style={geolocateStyle}
          positionOptions={positionOptions}
          trackUserLocation
          auto
          onGeolocate={console.log}
        />
      </MapGL>

    </FirebaseAppProvider>
  );
}