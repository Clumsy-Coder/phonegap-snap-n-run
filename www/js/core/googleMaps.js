// googleMaps class
// used as a utility in Snap-n-run phonegap application
// used in main.js for displaying the map and highliting the route taken
// used in sessionHistory for displaying the history of a particular session
// capable of loadingMaps, drawing routes and adding img markers on the map.

class googleMaps{
	// mapContainer : assuming it's retrieved by document.getElementById
	constructor(mapContainer){
		this.mapContainer = mapContainer;
		this.mapCanvas = null
		this.mainMarker = null;
	}// END constructor(mapContainer)

	get mapsCanvas(){
		return this.mapCanvas;
	}// END mapCanvas getter

	static get mapOpts(){
		return {
			center: new google.maps.LatLng(0,0),
			zoom: 18,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoomControl: false,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			rotateControl: true,
			fullscreenControl: true
		};
	}// END static getter mapOpts

	// called when there's a new GPS coordinates added to the routes array
	// or when displaying a session from history
	drawRoute(routes = []){
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
	}// END FUNCTION drawRoute(routes)

	// loads google maps. Doesn't add any routes to the map
	// used in main.js and sessionHistory
	// loadMarker is used in main.js
	// 		to make it more flexible in other context
	loadMaps(latitude = 0, longitude = 0, loadMarker = true){
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
		this.mapCanvas.panTo(latLong);
	}// END FUNCTION loadMaps(latitude, longitude, loadMarker)

	// adds the image marker once the image has been taken
	// must provide position, picture and imgMarkerOpts
	addImgMarker(position, picture, imgMarkerOpts){
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
	}// END FUNCTION addImgMarker(position, picture, imgMarkerOpts)
}// END CLASS googleMaps
