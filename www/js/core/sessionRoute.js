class sessionRoute{
	constructor(pics = [], routes = []){
		this.pics = pics;
		this.routes = routes;
	}

	// get routes(){
	// 	return this.routes;
	// }

	// add the location of the picture and GPS coordinates
	addPic(latitude, longitude, imageDir){
		this.pics.push({
			lat: latitude,
			lng: longitude,
			imagePath: imageDir
		});
		// console.log(`img added to sessionRoute`);
	}

	addRoute(latitude, longitude){
		// let latLong = new google.maps.LatLng(latitude, longitude);
		// this.routes.push(latLong.toJSON());
		let latLong = new Object();
		latLong['lat'] = latitude;
		latLong['lng'] = longitude;
		this.routes.push(latLong);
		// console.log(`coords added: ${latLong}`);
		// console.log(`coords added: ${latLong.lat()}`);
	}

	// this is used for when saving the data to store.js
	export(){
		return JSON.stringify({
			// pics: JSON.stringify(this.pics),
			// routes: JSON.stringify(this.routes)
			pics: this.pics,
			routes: this.routes
		});
	}

	// get routes(){
	// 	return this.routes;
	// }
	//
	// get pics(){
	// 	return this.pics;
	// }
	//
	// set pics(value){
	// 	this.pics = value;
	// }
}
