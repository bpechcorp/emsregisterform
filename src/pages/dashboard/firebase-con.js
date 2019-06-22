const firebase = require("firebase/app");
const axios = require('axios');
// Add the Firebase products that you want to use
require("firebase/auth");
// require("firebase/firestore");
require("firebase/storage");
require("firebase/database");


const firebaseConfig = {
    apiKey: "AIzaSyAOew38a3cmVkrClA3TfIeJwgP-xEBIhdE",
    authDomain: "vnpost-6d57e.firebaseapp.com",
    databaseURL: "https://vnpost-6d57e.firebaseio.com",
    projectId: "vnpost-6d57e",
    storageBucket: "vnpost-6d57e.appspot.com",
    messagingSenderId: "419665295516",
    appId: "1:419665295516:web:7e3ec35c1c4e7514"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Create a root reference
var storageRef = firebase.storage().ref();

// // Create a reference to 'mountains.jpg'
// var mountainsRef = storageRef.child('mountains.jpg');

// // Create a reference to 'images/mountains.jpg'
// var mountainImagesRef = storageRef.child('images/mountains.jpg');

// // While the file names are the same, the references point to different files
// mountainsRef.name === mountainImagesRef.name            // true
// mountainsRef.fullPath === mountainImagesRef.fullPath    // false

// Get a reference to the database service
const databaseBase = firebase.database().ref();
export const databaseRef = databaseBase.child('newEvents');
export const databaseTracking = databaseBase.child('tracking');
var storageRef = firebase.storage().ref();

class Firebase{
	constructor(){
		this._runData = this._runData.bind(this);
		this._isRunning = false;
		this._currentValue = null;
		this._success = {};
		// databaseRef.on('value', (snapshot)=>{
		// 	if(!snapshot || !snapshot.val) return;
		// 	let item = snapshot.val();
		// 	this._currentValue = item;
		// 	this._runData();
		// 	console.error('data events ', item)
		// })
	}
	_getDataFromServerML(item){
		return new Promise((resolve, reject)=>{
			axios.post('http://183.91.11.38:30033/upload', {
			    url: item.url
			  })
			  .then((response)=>{
			    console.log(response);
			  })
			  .catch((error)=>{
			    console.log(error);
			  });
		})
	}
	_runData(){
		if(!this._currentValue) return;
		if(this._isRunning) return;
		this._isRunning = true;
		const runItems = this._currentValue;
		console.error('_runData ', runItems);
		this._currentValue = null;
		if(runItems){
			let numtask = 0;
			for(const k in runItems){
				const item = runItems[k];
				if(!item || !item.key || this._success[item.key]) continue;
				numtask++;
				this._getDataFromServerML(item)
					.then(()=>{
						databaseTracking.child(item.key).set(item, (err)=>{
							numtask--;
							if(err){
								console.error('add err ', err);
							}else{
								this._success[item.key] = true;
								databaseRef.child(item.key).remove();
							}
							if(numtask <= 0){
								this._isRunning = false;
								setTimeout(this._runData,0);
							}
						});
					}).catch((err)=>{
						console.error('get from server error', err);
						numtask--;
						if(numtask <= 0){
							this._isRunning = false;
							setTimeout(this._runData,0);
						}
					})
				
			}
			if(numtask <= 0){
				this._isRunning = false;
			}
		}else{
			this._isRunning = false;
		}


	}
	// uploadFile(file){
	// 	return new Promise((resolve, reject)=>{
	// 		let metaData = {};
	// 		let fname = Date.now() + '_' + file.name;
	// 		let refImage = storageRef.child(fname);
	// 		refImage.put(file, metaData).then((snapshot)=>{
	// 			console.log('Uploaded file', snapshot);
	// 			refImage.getDownloadURL().then(function(url) {
	// 				console.error('download url', url);
	// 				setTimeout(()=>{
	// 					let key = databaseRef.push().key;
	// 					databaseRef.child(key).update({
	// 						key : key,
	// 						url : url
	// 					}, (error)=>{
	// 						if(error) console.error('update error: ', error);
	// 						if(error) return reject(error);
	// 						resolve(url);
	// 					})
	// 				},0)
	// 			}).catch(reject)
	// 		}).catch(reject);
	// 	})
		
	// }

}
const instance = new Firebase();
export default instance;
window.$fbcon = instance;