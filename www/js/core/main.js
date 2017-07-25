// contains the main logic of the application
// used when recording the session.

let watchID = null;
let curSession = null;
let sessionMaps = null;

const geoOpts = {
	enableHighAccuracy: true
};

window.onload = function(){
	init();
};

function init(){
	curSession = new sessionRoute();
	sessionMaps = new googleMaps(document.getElementById("mapContainer"));

	navigator.geolocation.getCurrentPosition(
		(position) => {
			const height = $("#toolbar").height();
			const totalHeight = $(window).height() - height - (1.6 * 18);
			// loading spinner
			document.getElementById("spinner").style.width = $(window).width();
			document.getElementById("spinner").style.left = totalHeight;

			sessionMaps.mapContainer.style.height = totalHeight + "px";
			sessionMaps.loadMaps(position.coords.latitude, position.coords.longitude);
			document.getElementById("spinner").style.display = "none";

			curSession.addRoute(position.coords.latitude, position.coords.longitude);
			sessionMaps.drawRoute(curSession.routes);
		},
		(error) => console.log(`unable to get GPS location \n${error.code}\n${error.message}`),
		geoOpts
	);
	// watch for the GPS changes.
	watchID = navigator.geolocation.watchPosition(onMapWatchSuccess, onMapWatchError, geoOpts);
}

function stopRecording(){
	navigator.geolocation.clearWatch(watchID);
	const exportData = curSession.export();
	store.set(new Date(), curSession.export());
	window.location.replace("index.html");
}

function onMapWatchSuccess(position){
	const newCoords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

	const lastCoords = curSession.routes[curSession.routes.length - 1];
	const deltaLat = Math.abs(newCoords.lat() - lastCoords.lat);
	const deltaLng = Math.abs(newCoords.lng() - lastCoords.lng);

	const latPrecision = 0.00001;
	const lngPrecision = 0.00001;

	if(deltaLat > latPrecision || deltaLng > lngPrecision){
		sessionMaps.mainMarker.setPosition(newCoords);
		// main marker always on top
		sessionMaps.mainMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
		sessionMaps.mapCanvas.panTo(newCoords);

		curSession.addRoute(position.coords.latitude, position.coords.longitude);
		sessionMaps.drawRoute(curSession.routes);
	}
}

function onMapWatchError(error){
	console.log(`code: ${error.code}
				 message: ${error.message}`);
}

function takePhoto(){
	let coordinates = null;
	let picture = null;

	getLocation()
	.then((position) => {
		coordinates = position;
		getPicture(position);
	}).catch(onGeoError);
}

function getLocation(){
	return new Promise(function(resolve, reject){
		const geoOpts = {
			enableHighAccuracy: true
		};
		navigator.geolocation.getCurrentPosition(resolve, reject, geoOpts);
	});
}

function getPicture(coordinates){
	const cameraOpts = {
		quality: 100,
		sourceType: Camera.PictureSourceType.CAMERA,
		encodingType: Camera.EncodingType.PNG,
		cameraDirection: Camera.Direction.FRONT,
		destinationType: Camera.DestinationType.FILE_URI
	};

	navigator.camera.getPicture((imageData) => {
		curSession.addPic(coordinates.coords.latitude, coordinates.coords.longitude, imageData);
		const imgMarkerOpts = {
			id: curSession.pics.length - 1,       //this will be used for getting the image in picArray
			map: sessionMaps.mapCanvas,
			animation: google.maps.Animation.DROP,
			position: {lat: coordinates.coords.latitude, lng: coordinates.coords.longitude},
			icon: {url: "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png"}
		};
		sessionMaps.addImgMarker(coordinates, imageData, imgMarkerOpts);
	}, onCameraError, cameraOpts);
}

function onGeoError(error){
	console.log(`takePhoto() error: unable to get GPS coordinates\n${error}`);
	navigator.notification.alert(`Error: unable to retrieve GPS coordinates for picture\n${error}`);
}

function onCameraError(error){
	console.log(`Error: unable to get picture\n${error}`);
	navigator.notification.alert(`Error: unable to get picture\n${error}`)
}
