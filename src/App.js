import React from 'react';
import GoogleMapReact from 'google-map-react';
import './App.css';
import mqtt from 'mqtt';
import MyGreatPlace from './my_great_place.jsx';


// let client = mqtt.connect('mqtt://broker.mqttdashboard.com:8000/mqtt');
let lat = 26.444, lon = 91.691582;
let top = "semsLocation";
console.log('start');

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class App extends React.Component {
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


	render() {
		return (

			<div>
				<ul className="sidebar">
					<li>Track Cycle</li>
					<a href={
						'https://www.google.com/maps/search/?api=1&query='
						+ this.state.lat.toString() + ',' + this.state.lon.toString()}
						target='_blank' rel="noopener noreferrer"><li>Directions to my cycle</li></a>
					<li>Details</li>
					<li>Where to buy</li>
					<li>Contact</li>
					<li>About</li>
				</ul>

				<input type="checkbox" id="sidebar-btn" className="sidebar-btn" defaultChecked />
				<label htmlFor="sidebar-btn"></label>

				<div className="content">
					<LiveTracker lat={this.state.lat} lon={this.state.lon} />
				</div>
			</div >

		);
	}

}

class LiveTracker extends React.Component {

	render() {
		// console.log(lat, lon);
		return (
			<div style={{ height: '100vh', width: '100%' }}>

				<GoogleMapReact
					bootstrapURLKeys={{
						key: ['AIzaSyB2j - BLr1 - CgTgSEUjws060kE37S2N - A3A']
					}}
					defaultZoom={8}
					defaultCenter={
						{ lat: 26, lng: 91 }
					}
				>
					<MyGreatPlace
						lat={this.props.lat}
						lng={this.props.lon}
						text="CYCLE"
					/>

				</GoogleMapReact>
			</div>
		);
	}
}

export default App;