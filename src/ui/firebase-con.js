var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
// require("firebase/firestore");
require("firebase/storage");
require("firebase/database");


var firebaseConfig = {
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
var database = firebase.database();
var storageRef = firebase.storage().ref();

class Firebase{
	constructor(){

	}
	uploadFile(file){
		return new Promise((resolve, reject)=>{
			let metaData = {};
			let fname = Date.now() + '_' + file.name;
			let refImage = storageRef.child(fname);
			refImage.put(file, metaData).then((snapshot)=>{
				console.log('Uploaded file', snapshot);
				refImage.getDownloadURL().then(function(url) {
					console.error('download url', url);
					resolve(url);
				}).catch(reject)
			}).catch(reject);
		})
		
	}

}
const instance = new Firebase();
export default instance;