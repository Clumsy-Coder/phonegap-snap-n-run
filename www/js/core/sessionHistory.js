let listMap = new Map();  // key, value map, NOT google maps object
let sessionMaps = null;
const startEndMarkerOpts = {
	// map: sessionMaps.mapCanvas,
	animation: google.maps.Animation.DROP,
	zIndex: -1
};

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

window.onload = function()
{
	console.log(`from sessionHistory.js`);
	const filename = location.href.split("/").slice(-1);
	console.log(`filename: ${filename}`);

    //generate the list
    generateList();

    $("#historyMenu").show();
    $("#historyList").show();
    $("#historyViewer").hide();

    // load the map
	var height = $("#historyViewer").height();
	$("#mapContainer").show();

    const totalHeight = $(window).height() - height - (1.6 * 18);
	$("#mapContainer").css("height", totalHeight + "px");
	sessionMaps = new googleMaps(document.getElementById("mapContainer"));
};

function generateList(){
	let tempArray = [];
	store.forEach(function(key, val){
		const curDate = new Date(key);
		tempArray.push(curDate);
	});

    // sort it by date in descending order
	tempArray = tempArray.sort().reverse();
	for(let i = 0, keyId = 0; i < tempArray.length; i++, keyId++)
    {
		const curDate = tempArray[i];
        // map an id to the date of the session
		listMap.set(keyId, curDate);
        // generate the html
		const listTag = "<a class='collection-item'" + " id='" + keyId++ + "' onclick='generateSession(this.id)'>" +
                    		curDate.toDateString() + " " + curDate.toLocaleTimeString() +
                        	"<i class='material-icons right'>keyboard_arrow_right</i>" +
                      	"</a>";
					  	$("#historyList").append(listTag);
	}
}

function clearAllHistory()
{
	store.clear();
	listMap.clear();
	$("#historyList").html("");
}

function goToHistoryMenu()
{
	$("#historyMenu").show();
	$("#historyList").show();
	// $("#mapContainer").hide();
	$("#historyViewer").hide();
	// map = null;
}

function generateSession(id){

    // get the saved data
    // convert it to parseable content
    // get the start and end of the routes
    // calculate the route bounds (to be able to display properly)
    // draw the route. update the total distance travelled
    // add the start/end and picture makers

	console.log(`session id: ${id}`);


	$("#historyMenu").hide();
	$("#historyList").hide();
	$("#historyViewer").show();

	let session = store.get(listMap.get(parseInt(id)));
	console.log(`session object: ${session}`);
	session = JSON.parse(session);

	sessionMaps.loadMaps(session.routes[0].lat, session.routes[0].lng, false);

	// for (var key in session) {
	//   if (session.hasOwnProperty(key)) {
	//     console.log(key + " -> " + session[key]);
	//   }
	// }

    // zoom to fit
	const bounds = new google.maps.LatLngBounds();
	for(const cur of session.routes){
		bounds.extend(new google.maps.LatLng(cur.lat, cur.lng));
	}

	sessionMaps.drawRoute(session.routes);
	sessionMaps.mapCanvas.fitBounds(bounds);
	addSessionMarkers(session);
}

// add start/end markers and picture markers
function addSessionMarkers(session){
	// add start and end markers
	// add picture markers

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
}
