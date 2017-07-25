// sessionHistory.js
// used for displaying the saved sessions.
// display a list of previous sessions
// display a session, draw the route and add any image markers on the google maps

let listMap = new Map();  		// key, value map, NOT google maps object
let sessionMaps = null;			// an instance of googleMaps
// main image marker object
// used for adding the start and end flags of the sessions
const startEndMarkerOpts = {
	animation: google.maps.Animation.DROP,
	zIndex: -1
};

// information on the icon of the start flag
const startFlagMarker = {
	// using font awesome icons, replace the marker icon with a custom icon
	// using https://github.com/nathan-muir/fontawesome-markers
	// stackoverflow post: https://stackoverflow.com/a/17310434/3053548
	path: fontawesome.markers.FLAG,
	scale: 0.5,
	strokeWeight: 0.2,
	strokeColor: "white",
	strokeOpacity: 1,
	fillColor: "green",
	fillOpacity: 0.7
};

// information on the icon for the end flag
const endFlagMarker = {
	// using font awesome icons, replace the marker icon with a custom icon
	// using https://github.com/nathan-muir/fontawesome-markers
	// stackoverflow post: https://stackoverflow.com/a/17310434/3053548
	path: fontawesome.markers.FLAG_CHECKERED,
	scale: 0.5,
	strokeWeight: 0.2,
	strokeColor: "black",
	strokeOpacity: 1,
	fillColor: "black",
	fillOpacity: 0.7
};

window.onload = function(){
    // generate the list
	// load the map
    generateList();

    $("#historyMenu").show();
    $("#historyList").show();
    $("#historyViewer").hide();

	$("#mapContainer").show();
	let height = $("#historyViewer").height();
    const totalHeight = $(window).height() - height - (1.6 * 18);
	$("#mapContainer").css("height", totalHeight + "px");
	sessionMaps = new googleMaps(document.getElementById("mapContainer"));
};// END FUNCTION window.onload

// render a list of sessions saved on store.js
// sort them by date in descending order.
// use a key, value map to represent which session was selected to get the
// 		proper data.
function generateList(){
	// use a temp array to store the date of each session
	// sort the array and reverse to set into descending order
	// go through each element in the array and generate html of the session.
	// 		display the date

	let tempArray = [];
	store.forEach(function(key, val){
		const curDate = new Date(key);
		tempArray.push(curDate);
	});
	tempArray = tempArray.sort().reverse();

	for(let i = 0, keyId = 0; i < tempArray.length; i++, keyId++)
    {
		const curDate = tempArray[i];
        // map an id to the date of the session
		// the id will be used in the rendered html
		listMap.set(keyId, curDate);

		const listTag = `<a class='collection-item' id=${keyId++} onclick='generateSession(this.id)'>
							${curDate.toDateString()}, ${curDate.toLocaleTimeString()}
							<i class='material-icons right'>keyboard_arrow_right</i>
						</a>`;
		$("#historyList").append(listTag);
	}
}// END FUNCTION generateList()

// clear all saved sessions
function clearAllHistory(){
	store.clear();
	listMap.clear();
	$("#historyList").html("");
}// END FUNCTION clearAllHistory()

// display the sessions list and hide everything else
function goToHistoryMenu(){
	$("#historyMenu").show();
	$("#historyList").show();
	$("#historyViewer").hide();
}// END FUNCTION goToHistoryMenu()

// generate the session based on the id recieved from the link
function generateSession(id){
	// show the google maps container and hide everything else
	// get the session based on the id and parse it
	// load the maps
	// fit the route on the google maps
	// draw the route
	// add the session markers

	$("#historyMenu").hide();
	$("#historyList").hide();
	$("#historyViewer").show();

	let session = store.get(listMap.get(parseInt(id)));
	session = JSON.parse(session);

	sessionMaps.loadMaps(session.routes[0].lat, session.routes[0].lng, false);

    // zoom to fit
	const bounds = new google.maps.LatLngBounds();
	for(const cur of session.routes){
		bounds.extend(new google.maps.LatLng(cur.lat, cur.lng));
	}

	sessionMaps.drawRoute(session.routes);
	sessionMaps.mapCanvas.fitBounds(bounds);
	addSessionMarkers(session);
}// END FUNCTION generateSession(id)

// add start/end and picture markers
function addSessionMarkers(session){
	// add the start/end markers on google maps
	// add image markers on google maps

	// start/end markers
	const start = new google.maps.LatLng(session.routes[0].lat,
	                                     session.routes[0].lng);
	const end = new google.maps.LatLng(session.routes[session.routes.length - 1].lat,
	                                   session.routes[session.routes.length - 1].lng);

	let startMarker = startEndMarkerOpts;
	startMarker.map = sessionMaps.mapCanvas;
	startMarker.position = start;
	startMarker.icon = startFlagMarker;
	new google.maps.Marker(startMarker);

	let endMarker = startEndMarkerOpts;
	endMarker.map = sessionMaps.mapCanvas;
	endMarker.position = end;
	endMarker.icon = endFlagMarker;
	new google.maps.Marker(endMarker);

	// image markers
	for(let i = 0; i < session.pics.length; i++){
		const imgMarkerOpts = {
			id: i,       //this will be used for getting the image in picArray
			map: sessionMaps.mapCanvas,
			animation: google.maps.Animation.DROP,
			position: {lat: session.pics[i].lat, lng: session.pics[i].lng},
			label: {
				fontFamily: "Material Icons",
				text: "camera_alt",
				color: "white",
				labelOrigin: new google.maps.Point(40,33)
			},
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(32,65),
		};

		const position = {
			lat: session.pics[i].lat,
			lng: session.pics[i].lng
		};
		sessionMaps.addImgMarker(position, session.pics[i].imagePath, imgMarkerOpts);
	}
}// END FUNCTION addSessionMarkers(session)
