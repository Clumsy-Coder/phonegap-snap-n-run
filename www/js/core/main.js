// contains the main logic of the application
// used when recording the session.

let watchID = null;
let curSession = null;
let sessionMaps = null;
// const cameraOpts = {
// 	quality: 100,
// 	sourceType: Camera.PictureSourceType.CAMERA,
// 	encodingType: Camera.EncodingType.PNG,
// 	cameraDirection: Camera.Direction.FRONT,
// 	destinationType: Camera.DestinationType.FILE_URI
// };

const geoOpts = {
	enableHighAccuracy: true
};

window.onload = function(){
	// create the curSessions object
	// create the googleMaps object
	// get the current location
	// load the maps
	// listen for GPS changes and update the map

	// only execute if the page is record.html
	const filename = location.href.split("/").slice(-1);
	console.log(`filename: ${filename}`);
	init();
};

function init(){
	curSession = new sessionRoute();
	// sessionMaps = new googleMaps(document.getElementById("mapContainer"));
	sessionMaps = new googleMaps(document.getElementById("mapContainer"));

	navigator.geolocation.getCurrentPosition(
		(position) => {
			sessionMaps.loadMaps(position.coords.latitude, position.coords.longitude);
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
	for (var key in exportData) {
	  if (exportData.hasOwnProperty(key)) {
	    console.log(key + " -> " + exportData[key]);
	  }
	}

	store.set(new Date(), curSession.export());
	window.location.replace("index.html");
}

function onMapWatchSuccess(position){
	// console.log("-----start-----");
	const newCoords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

	const lastCoords = curSession.routes[curSession.routes.length - 1];
	const deltaLat = Math.abs(newCoords.lat() - lastCoords.lat);
	const deltaLng = Math.abs(newCoords.lng() - lastCoords.lng);
	// console.log(`newCoords: ${newCoords}`);
	// console.log(`lastCoords.lat: ${lastCoords.lat}`);
	// console.log(`lastCoords.lng: ${lastCoords.lng}`);
	// console.log(`delta.lat: ${deltaLat}`);
	// console.log(`delta.lng: ${deltaLng}`);

	const latPrecision = 0.00001;
	const lngPrecision = 0.00001;

	if(deltaLat > latPrecision || deltaLng > lngPrecision){
		sessionMaps.mainMarker.setPosition(newCoords);
		// main marker always on top
		sessionMaps.mainMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
		sessionMaps.mapCanvas.panTo(newCoords);

		// console.log(`adding newCoords to route`);
		curSession.addRoute(position.coords.latitude, position.coords.longitude);
		sessionMaps.drawRoute(curSession.routes);
	}

	// console.log("-----end-----");

}

function onMapWatchError(error){
	console.log(`code: ${error.code}
				 message: ${error.message}`);
}

function takePhoto(){
	// get the GPS location
	// get the picture
	// add the info to sessionRoute
	// add an image marker
	//		add an action listner to open the image when the marker is clicked

	// done using Promise

	let coordinates = null;
	let picture = null;

	// getLocation().then((position) => {
	// 	console.log(`img coordinates: ${position.coords.latitude} : ${position.coords.longitude}`);
	// 	coordinates = position;
	// }).catch((error) => {
	// 	console.log(`takePhoto() error: unable to get GPS coordinates\n${error}`);
	// 	navigator.notification.alert(`Error: unable to retrieve GPS coordinates for picture\n${error}`);
	// }).then(getPicture().then((imageData) => {
	// 	console.log(`img location: ${imageData}`);
	// 	picture = imageData;
	// 	curSession.addPic(coordinates.coords.latitude,
	// 					  coordinates.coords.longitude,
	// 				  	  picture);
	// 	addImgMarker(coordinates, picture);
	// }).catch((error) => {
	// 	console.log(`Error: unable to get picture
	// 	${error}`);
	// 	navigator.notification.alert(`Error: unable to get picture
	// 	${error}`)
	// }));

	// getLocation()
	// .then((position) => {
	// 	console.log(`img coordinates: ${position.coords.latitude} : ${position.coords.longitude}`);
	// 	coordinates = position;
	// }).catch(onGeoError)
	// .then(getPicture().then((imageData) => {
	// 	console.log(`img location: ${imageData}`);
	// 	picture = imageData;
	// 	curSession.addPic(coordinates.coords.latitude, coordinates.coords.longitude, picture);
	// 	addImgMarker(coordinates, picture);
	// })).catch(onCameraError);

	getLocation()
	.then((position) => {
		console.log(`img coordinates: ${position.coords.latitude} : ${position.coords.longitude}`);
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
	// return new Promise(function (resolve, reject){
	// 	const cameraOpts = {
	// 		quality: 100,
	// 		sourceType: Camera.PictureSourceType.CAMERA,
	// 		encodingType: Camera.EncodingType.PNG,
	// 		cameraDirection: Camera.Direction.FRONT,
	// 		destinationType: Camera.DestinationType.FILE_URI
	// 	};
	// 	navigator.camera.getPicture(resolve, reject, cameraOpts);
	// });
	const cameraOpts = {
		quality: 100,
		sourceType: Camera.PictureSourceType.CAMERA,
		encodingType: Camera.EncodingType.PNG,
		cameraDirection: Camera.Direction.FRONT,
		destinationType: Camera.DestinationType.FILE_URI
	};

	navigator.camera.getPicture((imageData) => {
		console.log(`img: ${imageData}`);
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

// function addImgMarker(position, picture, markerOpts = null){
// 	// console.log(`------addImgMarker start-------`);
// 	// console.log(`coords: ${position.coords.latitude} : ${position.coords.longitude}`);
// 	// console.log(`picture: ${picture}`);
//
// 	let imgMarkerOpts = null;
//
// 	if(markerOpts !== null){
// 		imgMarkerOpts = markerOpts;
// 	}
//
// 	else{
// 		imgMarkerOpts = {
// 			id: curSession.pics.length - 1,       //this will be used for getting the image in picArray
// 			map: sessionMaps.mapCanvas,
// 			animation: google.maps.Animation.DROP,
// 			position: {lat: position.coords.latitude, lng: position.coords.longitude},
// 			icon: {url: "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png"}
// 		};
// 	}
//
// 	// const imgMarkerOpts = {
// 	// 	id: curSession.pics.length - 1,       //this will be used for getting the image in picArray
// 	// 	map: sessionMaps.mapCanvas,
// 	// 	animation: google.maps.Animation.DROP,
// 	// 	position: {lat: position.coords.latitude, lng: position.coords.longitude},
// 	// 	icon: {url: "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png"}
// 	// };
//
// 	let imgMarker = new google.maps.Marker(imgMarkerOpts);
// 	// console.log(`imgMarker created`);
// 	imgMarker.addListener("click", function(){
//
// 		$("#viewImgModal").modal({
// 			dismissible: true,
// 			startingTop: "2%", // Starting top style attribute
// 			endingTop: "2%"}); // Ending top style attribute});
//
// 		$("#viewImg").attr("src", picture);
// 		$("#viewImg").width($("#viewImgModal").width() - 2*24);
// 		$("#viewImg").css("margin-right", "24px");
//
// 		const delta = $(window).height() - ($(window).height() * 0.02) - (1.5*24);
// 		$("#viewImgModal").css("max-height", delta);
// 		$("#viewImgModal").modal("open");
//
// 	});
// 	// console.log(`action listener added`);
// 	// console.log(`------addImgMarker end-------`);
// }

// function onGeoSuccess(position){
// 	// set the coordinates
// 	coordinates = position;
// }

// function onGeoError(error){
// 	console.log(`takePhoto() error: unable to get GPS coordinates`);
// 	navigator.alert(`Error: unable to retrieve GPS coordinates for picture
// 					${error}`)
// }

// function onCameraSuccess(imgData){
//
// }

// function onCameraError(error){
// 	console.log(`Error: unable to get picture
// 				 ${error}`)
// }
