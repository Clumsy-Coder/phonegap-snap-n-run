class googleMaps{
	// mapContainer : assuming it's retrieved by document.getElementById
	constructor(mapContainer){
		this.mapContainer = mapContainer;
		this.mapCanvas = null
		this.mainMarker = null;
	}

	get mapsCanvas(){
		return this.mapCanvas;
	}

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
	}

	// called when there's a new GPS coordinates added to the routes array
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
	}

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
	}

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
	}
}
