class sessionRoute{
	constructor(pics = [], routes = []){
		this.pics = pics;
		this.routes = routes;
	}

	// add the location of the picture and GPS coordinates
	addPic(latitude, longitude, imageDir){
		this.pics.push({
			lat: latitude,
			lng: longitude,
			imagePath: imageDir
		});
	}

	addRoute(latitude, longitude){
		let latLong = new Object();
		latLong['lat'] = latitude;
		latLong['lng'] = longitude;
		this.routes.push(latLong);
	}

	// this is used for when saving the data to store.js
	export(){
		return JSON.stringify({
			pics: this.pics,
			routes: this.routes
		});
	}
}
