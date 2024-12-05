"use client";
import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { Loader } from "@googlemaps/js-api-loader";
interface MapProps {}

const Map: FunctionComponent<MapProps> = () => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [markerLat, setMarkerLat] = useState<any>();
  const [markerLng, setMarkerLng] = useState<any>();
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const clearMarker = () => {
    setMarker(null);
  };
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: "AIzaSyBJgUSMVr3U9Ss4j8u_sMNFi9RrZiyGYWM",
        version: "weekly",
      });
      const { Map } = await loader.importLibrary("maps");

      const position = {
        lat: 47.91859127510803,
        lng: 106.91776578658546,
      };
      const mapOption: google.maps.MapOptions = {
        center: position,
        zoom: 17,
        mapId: "test-map-next-js",
      };

      const map = new Map(mapRef.current as HTMLDivElement, mapOption);

      // const initialCircle = new google.maps.Circle({
      //   strokeColor: "#FF0000",
      //   strokeOpacity: 0.8,
      //   strokeWeight: 2,
      //   fillColor: "#FF0000",
      //   fillOpacity: 0.35,
      //   map: map,
      //   center: position,
      //   radius: 100, // Set the radius in meters
      // });
      // setCircle(initialCircle);

      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const clickedPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          setMarkerLat(clickedPosition.lat);
          setMarkerLng(clickedPosition.lng);
          console.log("Latitude:", clickedPosition.lat);
          console.log("Longitude:", clickedPosition.lng);

          if (marker) {
            marker.setPosition(clickedPosition);
          } else {
            const newMarker = new google.maps.Marker({
              map: map,
              position: clickedPosition,
            });
            // setMarker(newMarker);
            // const newCircle = new google.maps.Circle({
            //   strokeColor: "#FF0000",
            //   strokeOpacity: 0.8,
            //   strokeWeight: 2,
            //   fillColor: "#FF0000",
            //   fillOpacity: 0.35,
            //   map: map,
            //   center: event.latLng,
            //   radius: 100, // Set the radius in meters
            // });
            // setCircle(newCircle);
          }
        }
      });
    };

    initMap();
  }, [marker]);

  return (
    <div>
      <div className=" w-[1200px] h-[600px]" ref={mapRef}>
        Google map
      </div>
    </div>
  );
};

export default Map;
