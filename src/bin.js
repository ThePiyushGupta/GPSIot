import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import './App.css';
import mqtt from 'mqtt';

// let client = mqtt.connect('mqtt://broker.mqttdashboard.com:8000/mqtt');
let lat = 26.444,
    lon = 91.691582;
let top = "semsLocation";
console.log('start');


// client.on('message', function (topic, message) {
// 	// message is Buffer
// 	// console.log(topic, message.toString());
// 	if (topic === (top + '/lat'))
// 		// lat = parseFloat(message.toString());
// 		App.changeLat(parseFloat(message.toString()));
// 	else if (topic === (top + '/lng'))
// 		lon = parseFloat(message.toString());
// 	// App.changeLon(parseFloat(message.toString()));

// 	// console.log(lat, lon);
// });


const mapStyles = {
    width: '100%',
    height: '100%',
};

class LiveGmapPosition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: lat,
            lon: lon,
            client: mqtt.connect('mqtt://broker.mqttdashboard.com:8000/mqtt'),
        };
        this.state.client.on('connect', function () {
            console.log('mqtt connected');
            this.subscribe('semsLocation/#', function (err) {
                if (!err) {
                    console.log('subscribed');
                }
            })
        });
        this.abhidekhtehain = this.abhidekhtehain.bind(this);
        this.state.client.on('message', this.abhidekhtehain);
    }

    abhidekhtehain(topic, message) {
        // console.log(topic, message.toString());
        if (topic === (top + '/lat'))
            this.changeLat(parseFloat(message.toString()));
        else if (topic === (top + '/lng'))
            this.changeLon(parseFloat(message.toString()));
    }

    changeLat(newLat) {
        console.log(newLat)
        if (newLat !== this.state.lat) {
            console.log(newLat);
            this.setState({ lat: newLat });
        }
    }
    changeLon(newLat) {
        if (newLat !== this.state.lon) {
            console.log(newLat);
            this.setState({ lon: newLat });
        }
    }
    gmaps() {
        // console.log(lat, lon);
        return (<
            Map bootstrapURLKeys={
                {
                    key: ['AIzaSyB2j - BLr1 - CgTgSEUjws060kE37S2N - A3A']
                }
            }
            google={this.props.google}
            zoom={8}
            style={mapStyles}
            initialCenter={
                { lat: this.state.lat, lng: this.state.lon }
            }
            streetViewControl={true}
            mapTypeControl={true} >
            <
                Marker position={
                    { lat: this.state.lat, lng: this.state.lon }
                }
            />

            <
            /Map>
        );
    }
    render() {
        return ( <
            Map google={this.props.google}
                zoom={8}
                style={mapStyles}
                initialCenter={
                    { lat: this.state.lat, lng: this.state.lon }
                }
                streetViewControl={true}
                mapTypeControl={true} >
                <
                    Marker position={
                        { lat: this.state.lat, lng: this.state.lon }
                    }
                />

                <
            /Map>
            );
        }
    }
    
export default GoogleApiWrapper({
                    apiKey: 'AIzaSyB2j-BLr1-CgTgSEUjws060kE37S2N-A3A'
            })(LiveGmapPosition);
            
// export default App;