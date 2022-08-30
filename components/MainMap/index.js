import './MainMap.module.css';
import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
//import spotsAvailables from "./datas.json";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import useSwr from "swr";
import CustomControls from './CustomControls';
import "leaflet-routing-machine";
import L from "leaflet";

const fetcher = (...args) => fetch(...args).then(response => response.json());

function euclideanDistance(p1, p2) {
  const distance = Math.sqrt(Math.pow(p1.lat - p2.fields.coordonnees[0], 2) + Math.pow(p1.lng - p2.fields.coordonnees[1], 2))
  return distance;
}

function MainMap() {
  // Set up a useState hook for our map instance:
  const [map, setMap] = useState(null);
  // State vars for our routing machine instance:
  const [routingMachine, setRoutingMachine] = useState(null);
  // Ref for our routing machine instace:
  const RoutingMachineRef = useRef(null)

  // some point of interests
  const homePosition = [48.46475702683352, 2.6968766862658895];
  const churchPosition = [48.47186888804821, 2.700778971783497];

  // selected and nearest spot
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [nearestSpot, setNearestSpot] = useState(null);

  // where we will open the map
  const [mapCenter, setCenter] = useState({ lat: churchPosition[0], lng: churchPosition[1] });
  // starting point for first path
  const [startPoint, setStartPoint] = useState({ lat: homePosition[0], lng: homePosition[1] });

  // zoom level for init the map
  const mapZoom = 15;
  // radius in metter to fetch datas to display spot on the map
  const [radius, setRadius] = useState(1500);

  // fetch data from the api
  const url = `https://data.opendatasoft.com/api/records/1.0/search/?dataset=bureaux-vote-france-2017%40public&facet=nom_bureau_vote&geofilter.distance=${startPoint.lat}%2C${startPoint.lng}%2C${radius}`;
  const { data, error, mutate } = useSwr(url, { fetcher });
  const spotsAvailables = data && !error ? data : [];

  // set spot list (not all the API response)
  const [filteredReults, setFilteredResults] = useState([]);
  // is the request to API pending ?
  const [isLoaded, setIsLoaded] = useState(false);
  // do we need to search a new path ?
  const [needPath, setNeedPath] = useState(true);

  // callback for when when click on the map
  const onClick = (center) => {
    // set the new start point in the map
    setStartPoint(center);
    // un select current spot
    setSelectedSpot(null);
    setIsLoaded(false);
    setNeedPath(true);
  }
  // after start point change
  useEffect(() => {
    // launch an API request to get spot near to the new start point
    mutate();
  }, [startPoint])

  // Create the routing-machine instance:
  useEffect(() => {
    // Check For the map instance:
    if (!map) return
    // Assign Control to React Ref:
    RoutingMachineRef.current = L.Routing.control({
      // Where to position control on map
      // (will be hidden by css)
      position: 'topleft',
      // Options for the routing line
      lineOptions: {
        styles: [{ color: "#00C7B1", weight: 3 }]
      },
      fitSelectedRoutes: false,
      routeWhileDragging: true,
      show: true,
      // starting and destination point for the routing path
      waypoints: [startPoint, nearestSpot ?? selectedSpot],
    })

    RoutingMachineRef.current.on('routesfound', function (e) {
      setNeedPath(false);
    });
    // Save instance to state:
    setRoutingMachine(RoutingMachineRef.current)
  }, [map])

  // Once routing machine instance is ready, add to map:
  useEffect(() => {
    if (!routingMachine) return
    routingMachine.addTo(map)
  }, [routingMachine])

  // after a reload of spots near start point
  useEffect(() => {
    if (!spotsAvailables.records) return;
    setFilteredResults(spotsAvailables.records);
    setIsLoaded(true);
    if (spotsAvailables.records.length == 0) return;
    // set the nearest spot
    const nearestSpot = spotsAvailables.records.reduce((a, b) => euclideanDistance(startPoint, a) < euclideanDistance(startPoint, b) ? a : b);
    setNearestSpot(nearestSpot);
    setSelectedSpot(nearestSpot);
  }, [spotsAvailables])

  // change strating point of the route
  useEffect(() => {
    if (!routingMachine || !RoutingMachineRef.current) return
    if (!nearestSpot && !selectedSpot) {
      return
    }
    let endPoint = nearestSpot ?? selectedSpot;
    if (endPoint.fields) {
      endPoint = endPoint.fields.coordonnees;
    }
    // set the new start and end points for the routing system
    RoutingMachineRef.current.setWaypoints([startPoint, endPoint]);
  }, [startPoint, selectedSpot, nearestSpot, routingMachine])



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
      {filteredReults.length && filteredReults.map(spot => (
        <Marker
          key={spot.recordid}
          position={spot.fields.coordonnees}
          eventHandlers={{
            click: (e) => {
              setSelectedSpot(spot);
              setNearestSpot(null);
            },
          }}
        />
      ))}

      {selectedSpot && (
        <Popup
          position={selectedSpot.fields.coordonnees}
        >
          <div>
            <h2>{selectedSpot.fields.bureau_vote}</h2>
            <p>{selectedSpot.fields.nom_bureau_vote}</p>
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
