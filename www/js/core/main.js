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

	curSession = new sessionRoute();
	// sessionMaps = new googleMaps(document.getElementById("mapContainer"));
	sessionMaps = new googleMaps(document.getElementById("mapContainer"));

	navigator.geolocation.getCurrentPosition(
		(position) => sessionMaps.loadMaps(position.coords.latitude, position.coords.longitude),
		(error) => console.log(`unable to get GPS location \n${error.code}\n${error.message}`),
		geoOpts
	);
	// watch for the GPS changes.
	watchID = navigator.geolocation.watchPosition(onMapWatchSuccess, onMapWatchError, geoOpts);
};

function stopRecording(){
	navigator.geolocation.clearWatch(watchID);
	store.set(new Date(), curSession.export());
	window.location.replace("index.html");
}

function onMapWatchSuccess(position){
	console.log("inside onMapWatchSuccess");
	const newCoords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	console.log(`GPS coords: ${position.coords.latitude}\t${position.coords.longitude}`);
	console.log(`moving marker`);
	sessionMaps.mainMarker.setPosition(newCoords);
	// main marker always on top
	sessionMaps.mainMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
	console.log(`moving map location`);
	sessionMaps.mapCanvas.panTo(newCoords);

	console.log(`adding route to sessionRoute`);
	// const deltaLat = curSession.routes[curSession.routes.length - 1].lat - position.coords.latitude;
	// const deltaLong = curSession.routes[curSession.routes.length - 1].long - position.coords.latitude;
	// console.log(`delta coords: ${deltaLat}\t${deltaLong}`);
	console.log(curSession.routes);
	console.log(`routes length: ${curSession.routes.length}`);
	console.log("---------");

	console.log("---------");
	curSession.addRoute(position.coords.latitude, position.coords.longitude);
	console.log(`drawing the route`);
	sessionMaps.drawRoute(curSession.routes);

	if(curSession.routes.length > 0){
		const lastCoords = curSession.routes[curSession.routes.length - 1];
		// let lastCoords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		for(var key in lastCoords){
			if(lastCoords.hasOwnProperty(key)){
				var val = lastCoords[key];
				console.log(val);
			}
		}

		console.log(`lat: ${lastCoords.lat()}\nlong: ${lastCoords.lng()}`);
	}

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

	getLocation().then((position) => {
		coordinates = position;
	}).catch((error) => {
		console.log(`takePhoto() error: unable to get GPS coordinates
					${error}`);
		navigator.notification.alert(`Error: unable to retrieve GPS coordinates for picture
						${error}`);
	}).then(getPicture()).then((img) => {
		picture = img;
		curSession.addPic(coordinates.coords.latitude,
						  coordinates.coords.longitude,
					  	  picture);
		addImgMarker(coordinates, picture);
	}).catch((error) => {
		console.log(`Error: unable to get picture
		${error}`);
		navigator.notification.alert(`Error: unable to get picture
		${error}`)
	});

}

function getLocation(){
	return new Promise(function(resolve, reject){
		const geoOpts = {
			enableHighAccuracy: true
		};
		navigator.geolocation.getCurrentPosition(resolve, reject, geoOpts);
	});
}

function getPicture(){
	return new Promise(function (resolve, reject){
		const cameraOpts = {
			quality: 100,
			sourceType: Camera.PictureSourceType.CAMERA,
			encodingType: Camera.EncodingType.PNG,
			cameraDirection: Camera.Direction.FRONT,
			destinationType: Camera.DestinationType.FILE_URI
		};
		navigator.camera.getPicture(resolve, reject, cameraOpts);
	});
}

function addImgMarker(position, picture){
	const imgMarkerOpts = {
		id: curSession.pics.length - 1,       //this will be used for getting the image in picArray
		map: sessionMaps.map,
		animation: google.maps.Animation.DROP,
		position: {lat: position.coords.latitude, lng: position.coords.longitude},
		icon: {url: "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png"}
	};

	let imgMarker = new google.maps.Marker(imgMarkerOpts);
	imgMarker.addListener("click", function(){

		$("#viewImgModal").modal({
			dismissible: true,
			startingTop: "2%", // Starting top style attribute
			endingTop: "2%"}); // Ending top style attribute});

		$("#viewImg").attr("src", picture);
		$("#viewImg").width($("#viewImgModal").width() - 2*24);
		$("#viewImg").css("margin-right", "24px");

		const delta = $(window).height() - ($(window).height() * 0.02) - (1.5*24);
		$("#viewImgModal").css("max-height", delta);
		$("#viewImgModal").modal("open");

	});
}

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
