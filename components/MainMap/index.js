import './MainMap.module.css';
import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ZoomControl } from 'react-leaflet';
import voteOffices from "./datas.json";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import useSwr from "swr";
import CustomControls from './CustomControls';
import "leaflet-routing-machine";
import L from "leaflet";

// https://data.opendatasoft.com/api/records/1.0/search/?dataset=bureaux-vote-france-2017%40public&q=&facet=code_insee&facet=code_bureau_vote&facet=ouverture&facet=fermeture&facet=ville&facet=nom_bureau_vote&facet=departement&geofilter.distance=48.47186888804821%2C+2.700778971783497%2C1000
const fetcher = (...args) => fetch(...args).then(response => response.json());

function distance(p1, p2) {
  const dst = Math.sqrt(Math.pow(p1.lat - p2.fields.coordonnees[0], 2) + Math.pow(p1.lng - p2.fields.coordonnees[1], 2))
  return dst;
}

function MainMap() {
  // Set up a useState hook for our map instance:
  const [map, setMap] = useState(null);
  // State vars for our routing machine instance:
  const [routingMachine, setRoutingMachine] = useState(null);
  // Ref for our routing machine instace:
  const RoutingMachineRef = useRef(null)

  const homePosition = [48.46475702683352, 2.6968766862658895];
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [nearestOffice, setNearestOffice] = useState(null);
  const [mapCenter, setCenter] = useState([48.47186888804821, 2.700778971783497]);
  const [startPoint, setStartPoint] = useState(homePosition);
  const mapZoom = 16;

  const onClick = (center) => {
    setStartPoint(center);
    setNearestOffice(voteOffices.records.reduce((a, b) => distance(center, a) < distance(center, b) ? a : b));
    setSelectedOffice(null);
  }

  // Create the routing-machine instance:
  useEffect(() => {
    // Check For the map instance:
    if (!map) return
    if (map) {
      // Assign Control to React Ref:
      RoutingMachineRef.current = L.Routing.control({
        position: 'topleft', // Where to position control on map
        lineOptions: { // Options for the routing line
          styles: [{ color: "#EC6FA1", weight: 3 }]
        },
        show: true,
        waypoints: [startPoint, nearestOffice ?? selectedOffice], // Point A - Point B
        fitSelectedRoutes: false, routeWhileDragging: true,

      })
      // Save instance to state:
      setRoutingMachine(RoutingMachineRef.current)
    }
  }, [map])

  // change strating point of the route
  useEffect(() => {
    if (!routingMachine) return
    if (!nearestOffice && !selectedOffice) {
      return
    }
    let endPoint = nearestOffice ?? selectedOffice;
    if (endPoint.fields) {
      endPoint = endPoint.fields.coordonnees;
    }

    RoutingMachineRef.current && RoutingMachineRef.current.setWaypoints([startPoint, endPoint]);
  }, [startPoint, selectedOffice, nearestOffice, routingMachine])

  // Once routing machine instance is ready, add to map:
  useEffect(() => {
    if (!routingMachine) return
    if (routingMachine) {
      routingMachine.addTo(map)
    }
  }, [routingMachine])


  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={false}
      zoomControl={false}
      // Set the map instance to state when ready:
      whenCreated={map => setMap(map)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {voteOffices.records && voteOffices.records.map(voteOffice => (
        <Marker
          key={voteOffice.recordid}
          position={[
            voteOffice.fields.coordonnees[0],
            voteOffice.fields.coordonnees[1]
          ]}
          eventHandlers={{
            click: (e) => {
              setSelectedOffice(voteOffice);
              setNearestOffice(null);
            },
          }}
        />
      ))}

      {selectedOffice && (
        <Popup
          position={[
            selectedOffice.geometry.coordinates[1],
            selectedOffice.geometry.coordinates[0]
          ]}
          onClose={() => {
            //setSelectedOffice(null);
          }}
        >
          <div>
            <h2>{selectedOffice.fields.bureau_vote}</h2>
            <p>{selectedOffice.fields.nom_bureau_vote}</p>
          </div>
        </Popup>
      )}

      <Marker position={homePosition} draggable={false} key="home">
        <Popup>Hey ! I live here</Popup>
      </Marker>

      <Marker position={startPoint} draggable={true} animate={true} key="startPoint">

      </Marker>

      <CustomControls onClick={onClick} />
    </MapContainer>
  );
}

export default MainMap;
