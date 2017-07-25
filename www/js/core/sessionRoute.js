class sessionRoute{
	constructor(pics = [], routes = []){
		this.pics = pics;
		this.routes = routes;
	}// END constructor(pics, routes)

	// add the GPS location of the picture and the path of the picture.
	addPic(latitude, longitude, imageDir){
		this.pics.push({
			lat: latitude,
			lng: longitude,
			imagePath: imageDir
		});
	}// END FUNCTION addPic(latitude, longitude, imageDir)

	// add GPS coordinates to the route array.
	// contains the path taken during the recording of the session
	addRoute(latitude, longitude){
		let latLong = new Object();
		latLong['lat'] = latitude;
		latLong['lng'] = longitude;
		this.routes.push(latLong);
	}// END FUNCTION addRoute(latitude, longitude)

	// convert the pics and routes array to JSON object and return it
	// used in long term storage by store.js
	export(){
		return JSON.stringify({
			pics: this.pics,
			routes: this.routes
		});
	}// END FUNCTION export()
}// END CLASS sessionRoute
