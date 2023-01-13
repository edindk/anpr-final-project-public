import React, {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet'
import 'leaflet/dist/leaflet';
import '../../../assets/styling/style.css';
import {fetchLocations} from "../../../services/Data";

function AdminMap(props) {
    let mapElem = window.document.getElementById('map');
    const [locations, setLocations] = useState(null);
    const [map, setMap] = useState(null);

    fetchLocations().then(response => {
        if (locations === null) {
            setLocations(response);
        }
    });

    useEffect(() => {
        let icon = L.icon({
            iconUrl: require('../../../assets/images/icons8-parking.png'),

            iconSize: [30, 30], // size of the icon
            // iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
        });

        if (mapElem && locations) {
            if (map !== null) {
                map.off();
                map.remove();
            }
            let tempMap = L.map('map').setView([56.26392, 11.5], 6);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(tempMap);
            locations.forEach((item) => {
                L.marker([parseFloat(item.lat), parseFloat(item.lng)], {icon: icon}).addTo(tempMap).bindPopup(`Adresse: ${item.address} <br> By: ${item.zipCity.city} <br> Postnummer: ${item.zipCity.zip} <br> Antal parkeringspladser: ${item.numbOfParkingSpaces} <br> Antal ledige parkeringspladser: ${item.numbOfFreeParkingSpaces}`).on('click', () => {
                    // tempMap.setView([57.0356087, 9.9127319], 13)
                });
            })

            L.Control.ResetControl = L.Control.extend({
                onAdd: function (map) {
                    var el = L.DomUtil.create('button', 'control-reset');
                    L.DomEvent.addListener(el, 'click', () => {
                        tempMap.setView([56.26392, 11.5], 6);
                    });
                    el.innerHTML = 'Nulstil';

                    return el;
                },
            });

            L.control.resetControl = function (opts) {
                return new L.Control.ResetControl(opts);
            }

            L.control.resetControl({
                position: 'topright'
            }).addTo(tempMap);

            setMap(tempMap);
        }
    }, [mapElem, locations])
    return (
        <div style={{height: '600px'}} id="map"/>
    );
}

export default AdminMap;