import './MainMap.module.css';
import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
//import voteOffices from "./datas.json";
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
  const [startPoint, setStartPoint] = useState({ lat: homePosition[0], lng: homePosition[1] });
  const mapZoom = 15;

  const [radius, setRadius] = useState(1500);
  const url = `https://data.opendatasoft.com/api/records/1.0/search/?dataset=bureaux-vote-france-2017%40public&facet=nom_bureau_vote&geofilter.distance=${startPoint.lat}%2C${startPoint.lng}%2C${radius}`;
  const { data, error, mutate } = useSwr(url, { fetcher });
  const voteOffices = data && !error ? data : [];
  const [filteredReults, setFilteredResults] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [needPath, setNeedPath] = useState(true);

  const onClick = (center) => {
    setStartPoint(center);
    setSelectedOffice(null);
    setIsLoaded(false);
    setNeedPath(true);
  }
  // after start point change
  useEffect(() => {
    mutate();
  }, [startPoint])

  // Create the routing-machine instance:
  useEffect(() => {
    // Check For the map instance:
    if (!map) return
    if (map) {
      // Assign Control to React Ref:
      RoutingMachineRef.current = L.Routing.control({
        position: 'topleft', // Where to position control on map
        lineOptions: { // Options for the routing line
          styles: [{ color: "#00C7B1", weight: 3 }]
        },
        show: true,
        waypoints: [startPoint, nearestOffice ?? selectedOffice], // Point A - Point B
        fitSelectedRoutes: false,
        routeWhileDragging: true,
      })

      RoutingMachineRef.current.on('routesfound', function (e) {
        //console.log(e);
        setNeedPath(false);
      });
      // Save instance to state:
      setRoutingMachine(RoutingMachineRef.current)
    }
  }, [map])


  // after a reload of spot near center
  useEffect(() => {
    if (!voteOffices.records) return;
    setFilteredResults(voteOffices.records);
    setIsLoaded(true);
  }, [voteOffices])

  useEffect(() => {
    if (filteredReults.length == 0) return;
    const nearestOffice = filteredReults.reduce((a, b) => distance(startPoint, a) < distance(startPoint, b) ? a : b);
    setNearestOffice(nearestOffice);
    setSelectedOffice(nearestOffice);
  }, [filteredReults])

  // change strating point of the route
  useEffect(() => {
    if (!routingMachine || !RoutingMachineRef.current) return
    if (!nearestOffice && !selectedOffice) {
      return
    }
    let endPoint = nearestOffice ?? selectedOffice;
    if (endPoint.fields) {
      endPoint = endPoint.fields.coordonnees;
    }

    RoutingMachineRef.current.setWaypoints([startPoint, endPoint]);
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
      scrollWheelZoom={true}
      zoomControl={false}
      // Set the map instance to state when ready:
      whenCreated={map => setMap(map)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {filteredReults.length && filteredReults.map(voteOffice => (
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
        <Popup>Hey ! JosNo live here :P</Popup>
      </Marker>

      <Marker position={startPoint} draggable={true} animate={true} key="startPoint" />
      {!isLoaded && (<Circle center={startPoint} radius={radius} color="#00C7B1" weight={3} opacity={0.3} />)}
      {isLoaded && needPath && (<Circle center={startPoint} radius={radius} color="#EC6FA1" weight={3} opacity={0.3} />)}

      <CustomControls onClick={onClick} />
    </MapContainer>
  );
}

export default MainMap;
