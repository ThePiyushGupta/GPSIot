import React from 'react';
import GoogleMapReact from 'google-map-react';
import './App.css';
import mqtt from 'mqtt';
import MyGreatPlace from './my_great_place.jsx';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";


// let client = mqtt.connect('mqtt://broker.mqttdashboard.com:8000/mqtt');
let lat = 26.444, lon = 91.691582;
let top = "semsLocation";
console.log('start');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gps: {
				lat: lat,
				lon: lon,
			},
			mar: {
				lat: lat,
				lon: lon,
			},
			rad: 0,
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
		this._onClick = this._onClick.bind(this);
		this.fetchmar = this.fetchmar.bind(this);
		this.radiuschanged = this.radiuschanged.bind(this);
	}

	abhidekhtehain(topic, message) {
		console.log(topic, message.toString());
		if (topic === (top + '/lat'))
			this.changeLat(parseFloat(message.toString()));
		else if (topic === (top + '/lng'))
			this.changeLon(parseFloat(message.toString()));
		else if (topic === (top + '/mar/lat')) {
			this.changeMarLat(parseFloat(message.toString()));
		}
		else if (topic === (top + '/mar/lon')) {
			this.changeMarLon(parseFloat(message.toString()));
		}
		// this.changeLon(parseFloat(message.toString()));
		else if (topic === (top + '/mar/rad'))
			this.setState({ rad: parseFloat(message.toString()) });

	}
	_onClick = ({ x, y, lat, lng, event }) => {
		this.setState({ mar: { lon: lng, lat: lat } })
		this.state.client.publish(top + "/mar/set/lon", lng.toString());
		this.state.client.publish(top + "/mar/set/lat", lat.toString());
	}
	radiuschanged(newrad) {
		this.state.client.publish(top + '/mar/set/rad', newrad.toString());
		this.setState({ rad: newrad });
	}

	changeMarLat(newLat) {
		if (newLat !== this.state.mar.lat) {
			console.log(newLat);
			this.setState({ mar: { lat: newLat, lon: this.state.mar.lon } });
		}
		console.log(this.state.mar);

	}


	changeMarLon(newLat) {
		if (newLat !== this.state.mar.lon) {
			console.log(newLat);
			this.setState({ mar: { lon: newLat, lat: this.state.mar.lat } });
		}
		console.log(this.state.mar);

	}

	changeLat(newLat) {
		if (newLat !== this.state.gps.lat) {
			console.log(newLat);
			this.setState({ gps: { lat: newLat, lon: this.state.gps.lon } });
		}
	}
	changeLon(newLat) {
		if (newLat !== this.state.gps.lon) {
			console.log(newLat);
			this.setState({ gps: { lon: newLat, lat: this.state.gps.lat } });
		}
	}

	fetchmar() {
		console.log('hehe');
		this.state.client.publish(top + '/mar/fetch', 'fetch');
	}

	render() {
		return (
			<Router>
				<div>
					<nav>
						<ul>
							<li>
								<a href={
									'https://www.google.com/maps/search/?api=1&query='
									+ this.state.gps.lat + ',' + this.state.gps.lon}
									target='_blank' rel="noopener noreferrer">Directions to my cycle</a>
							</li>
							<li>
								<Link to="/getMarkerLocation">Get Marker Location</Link>
							</li>
							<li>
								<Link to="/liveTracking">Live Tracking of Cycle</Link>
							</li>
						</ul>
					</nav>

					{/* A <Switch> looks through its children <Route>s and
			renders the first one that matches the current URL. */}

					<Switch>
						<Route path="/liveTracking">
							< LiveTracker lat={this.state.gps.lat} lon={this.state.gps.lon} />
						</Route>
						<Route path="/getMarkerLocation">
							< GetMarkerLocation lat={this.state.mar.lat}
								lon={this.state.mar.lon}
								_onClick={this._onClick}
								fetchmar={this.fetchmar}
								rad={this.state.rad}
								gpslat={this.state.gps.lat}
								gpslon={this.state.gps.lon}
								radiuschanged={this.radiuschanged} />
						</Route>
					</Switch>
				</div>
			</Router>
		);
	}
}


class LiveTracker extends React.Component {

	// _onClick = ({ x, y, lat, lng, event }) => console.log(x, y, lat, lng, event)
	render() {
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

class GetMarkerLocation extends React.Component {

	constructor(props) {
		super(props);
		this.props.fetchmar();
		// console.log(this.props);
		this.renderMarkers = this.renderMarkers.bind(this);
		this.changerad = this.changerad.bind(this);
	}

	componentDidUpdate(prevProps) {
		console.log(this.props);
		if (prevProps.lat !== this.props.lat || prevProps.lon !== this.props.lon) {
			if (this.state && this.state.circle)
				this.state.circle.setCenter({ lat: this.props.lat, lng: this.props.lon });
		}
		if (prevProps.rad !== this.props.rad && this.state.circle)
			this.state.circle.setRadius(this.props.rad);
	}

	changerad(e) {
		let rad = this.state.circle.getRadius();
		this.props.radiuschanged(rad);
	}

	renderMarkers(map, maps) {
		var latlng = {
			lat: this.props.lat,
			lng: this.props.lon,
		}
		var circle = new window.google.maps.Circle({
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.3,
			center: latlng,
			radius: 275,
			editable: true,
		});
		circle.setCenter(latlng);
		circle.setMap(map);
		this.setState({ circle: circle });
		this.state.circle.addListener('radius_changed', this.changerad);
	}

	render() {

		return (
			<div style={{ height: '100vh', width: '100%' }} >

				<GoogleMapReact
					bootstrapURLKeys={{
						key: ['AIzaSyB2j - BLr1 - CgTgSEUjws060kE37S2N - A3A']
					}}
					defaultZoom={8}
					defaultCenter={
						{ lat: 26, lng: 91 }
					}
					onClick={this.props._onClick}
					yesIWantToUseGoogleMapApiInternals={true}
					onGoogleApiLoaded={({ map, maps }) => this.renderMarkers(map, maps, this.props.lng)}
				>
					<MyGreatPlace
						lat={this.props.gpslat}
						lng={this.props.gpslon}
						text="CYCLE"
					/>

				</GoogleMapReact>
			</div >
		);
	}
}

export default App;