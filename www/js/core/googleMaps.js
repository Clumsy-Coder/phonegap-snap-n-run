class googleMaps{
	// mapContainer : assuming it's retrieved by document.getElementById
	constructor(mapContainer){
		this.mapContainer = mapContainer;
		// this.mapCanvas = new google.maps.Map(mapContainer, this.mapOpts);
		// this.mapCanvas = new google.maps.Map(document.getElementById("mapContainer"), googleMaps.mapOpts);
		this.mapCanvas = null
		this.mainMarker = null;
		// console.log(this.mapContainer);
		// console.log(this.map);
		// console.log(`googleMaps object created`);
	}

	get mapsCanvas(){
		return this.mapCanvas;
	}

	static get mapOpts(){
		return {
			center: new google.maps.LatLng(0,0),
			zoom: 18,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			// disableDefaultUI: true,
			zoomControl: false,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			rotateControl: true,
			fullscreenControl: true
		};
	}

	// called when there's a new GPS coordinates added to the routes array
	drawRoute(routes = []){
		// console.log(`-------draw route start-------`);
		// console.log(`routes:\n${routes}`);
		const path = new google.maps.Polyline({
			path: routes,
			geodesic: true,
			strokeColor: "#2196f3",
			strokeOpacity: 1.0,
			strokeWeight: 10
		});
		path.setMap(this.mapCanvas);
		//display the updated the distance
		const lengthInMeters = google.maps.geometry.spherical.computeLength(path.getPath());
		const distanceInKiloMeter = lengthInMeters / 1000;
		$("#totalDistance").html(distanceInKiloMeter.toFixed(2) + " km");

		// console.log(`-------draw route end-------`);
	}

	loadMaps(latitude = 0, longitude = 0, loadMarker = true){
		// console.log(`inside loadMaps: ${latitude}\t${longitude}`);
		// setting the map container dimensions.
		// used for displaying the map on screen.
		// const height = $("#toolbar").height();
		// const totalHeight = $(window).height() - height - (1.6 * 18);
		// this.mapContainer.style.height = totalHeight + "px";
		this.mapCanvas = new google.maps.Map(this.mapContainer, googleMaps.mapOpts);
		const latLong = new google.maps.LatLng(latitude, longitude);
		const markerOpts =
		{
			animation: google.maps.Animation.DROP,
			position: latLong,
			map: this.mapCanvas,
		};

		if(loadMarker){
			this.mainMarker = new google.maps.Marker(markerOpts);

			this.mainMarker.setMap(this.mapCanvas);
		}
		// map.setZoom(20);
		// this.mapCanvas.setCenter(this.mainMarker.getPosition());
		this.mapCanvas.panTo(latLong);
	}

	addImgMarker(position, picture, imgMarkerOpts){
		// console.log(`------addImgMarker start-------`);
		// console.log(`coords: ${position.coords.latitude} : ${position.coords.longitude}`);
		// console.log(`picture: ${picture}`);

		// let imgMarkerOpts = null;
		//
		// if(markerOpts !== null){
		// 	imgMarkerOpts = markerOpts;
		// }
		//
		// else{
		// 	imgMarkerOpts = {
		// 		id: curSession.pics.length - 1,       //this will be used for getting the image in picArray
		// 		map: this.mapCanvas,
		// 		animation: google.maps.Animation.DROP,
		// 		position: {lat: position.coords.latitude, lng: position.coords.longitude},
		// 		icon: {url: "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png"}
		// 	};
		// }

		// const imgMarkerOpts = {
		// 	id: curSession.pics.length - 1,       //this will be used for getting the image in picArray
		// 	map: sessionMaps.mapCanvas,
		// 	animation: google.maps.Animation.DROP,
		// 	position: {lat: position.coords.latitude, lng: position.coords.longitude},
		// 	icon: {url: "https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png"}
		// };

		let imgMarker = new google.maps.Marker(imgMarkerOpts);
		// console.log(`imgMarker created`);
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
		// console.log(`action listener added`);
		// console.log(`------addImgMarker end-------`);
	}
}
