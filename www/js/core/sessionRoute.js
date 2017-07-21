class sessionRoute{
	constructor(picsArray = [], routesArray = []){
		this.pics = picsArray;
		this.routes = routesArray;
	}

	// get routes(){
	// 	return this.routes;
	// }

	// add the location of the picture and GPS coordinates
	addPic(latitude, longitude, imageDir){
		this.pics.push({
			latitude: latitude,
			longitude: longitude,
			imagePath: imageDir
		});
	}

	addRoute(latitude, longitude){
		let latLong = new google.maps.LatLng(latitude, longitude);
		this.routes.push(latLong.toJSON());
		console.log(`coords added: ${latLong.lat()}`);
	}

	// this is used for when saving the data to store.js
	export(){
		return {
			pics: JSON.stringify(this.pics),
			routes: JSON.stringify(this.routes)
		};
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
