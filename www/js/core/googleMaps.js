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
		console.log(`googleMaps object created`);
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
	}

	loadMaps(latitude = 0, longitude = 0){
		console.log(`inside loadMaps: ${latitude}\t${longitude}`);
		// setting the map container dimensions.
		// used for displaying the map on screen.
		const height = $("#toolbar").height();
		const totalHeight = $(window).height() - height - (1.6 * 18);
		this.mapContainer.style.height = totalHeight + "px";
		this.mapCanvas = new google.maps.Map(this.mapContainer, googleMaps.mapOpts);
		const latLong = new google.maps.LatLng(latitude, longitude);
		const markerOpts =
		{
			animation: google.maps.Animation.DROP,
			position: latLong,
			map: this.mapCanvas,
		};
		this.mainMarker = new google.maps.Marker(markerOpts);

		this.mainMarker.setMap(this.mapCanvas);
		// map.setZoom(20);
		// this.mapCanvas.setCenter(this.mainMarker.getPosition());
		this.mapCanvas.panTo(latLong);
	}
}
