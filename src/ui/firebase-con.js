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
var databaseRef = firebase.database().ref();
databaseRef = databaseRef.child('newEvents');
var storageRef = firebase.storage().ref();
function getOrientation(file) {
	return new Promise((resolve, reject)=>{
		var reader = new FileReader();
	    reader.onload = function(e) {
	        var view = new DataView(e.target.result);
	        if (view.getUint16(0, false) != 0xFFD8)
	        {
	            return resolve(-2);
	        }
	        var length = view.byteLength, offset = 2;
	        while (offset < length) 
	        {
	            if (view.getUint16(offset+2, false) <= 8) return resolve(-1);
	            var marker = view.getUint16(offset, false);
	            offset += 2;
	            if (marker == 0xFFE1) 
	            {
	                if (view.getUint32(offset += 2, false) != 0x45786966) 
	                {
	                    return resolve(-1);
	                }

	                var little = view.getUint16(offset += 6, false) == 0x4949;
	                offset += view.getUint32(offset + 4, little);
	                var tags = view.getUint16(offset, little);
	                offset += 2;
	                for (var i = 0; i < tags; i++)
	                {
	                    if (view.getUint16(offset + (i * 12), little) == 0x0112)
	                    {
	                        return resolve(view.getUint16(offset + (i * 12) + 8, little));
	                    }
	                }
	            }
	            else if ((marker & 0xFF00) != 0xFF00)
	            {
	                break;
	            }
	            else
	            { 
	                offset += view.getUint16(offset, false);
	            }
	        }
	        return resolve(-1);
	    };
	    reader.readAsArrayBuffer(file);
	})
}
function getFileUrl(file){
	return new Promise((resolve, reject)=>{
		var fr = new FileReader();
	    fr.onload = function () {
	        resolve(fr.result);
	    }
	    fr.readAsDataURL(file);
	})
	
}
function resetOrientation(srcImg, srcOrientation) {
	return new Promise((resolve, reject)=>{
		var img = new Image();	
		img.onerror = reject;
		img.onabort = reject;
		img.onload = function() {
	  		var width = img.width,
	    		height = img.height,
	        canvas = document.createElement('canvas'),
		  		ctx = canvas.getContext("2d");
			
	    // set proper canvas dimensions before transform & export
		if (4 < srcOrientation && srcOrientation < 9) {
	    	canvas.width = height;
	      canvas.height = width;
	    } else {
	    	canvas.width = width;
	      canvas.height = height;
	    }
		
	  	// transform context before drawing image
		switch (srcOrientation) {
	      case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
	      case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
	      case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
	      case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
	      case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
	      case 7: ctx.transform(0, -1, -1, 0, height , width); break;
	      case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
	      default: break;
	    }

			// draw image
	    ctx.drawImage(img, 0, 0);
		// export base64
		canvas.toBlob((blob)=>{
			if(!blob) return reject('invalid blob');
			resolve(blob);
		});
	  };
	  img.src = srcImg;
	})
	
}
class Firebase{
	constructor(){

	}
	fixFile(file){
		return new Promise((resolve, reject)=>{
			getOrientation(file).then((orientation)=>{
				console.error('orientation', orientation);
				if(orientation <= 1) return resolve(file);
				getFileUrl(file).then((url)=>{
					resetOrientation(url, orientation).then((blob)=>{
						console.error('resetOrientation new blob');
						resolve(blob);
					}).catch(reject);
				}).catch(reject);
			}).catch(reject);
		})
	}
	uploadFile(file){
		return new Promise((resolve, reject)=>{
			this.fixFile(file).then((nfile)=>{
				resolve(this._uploadFile(nfile));
			}).catch(reject);
		})
	}
	_uploadFile(file){
		return new Promise((resolve, reject)=>{
			let metaData = {};
			let fname = Date.now() + '_' + file.name;
			let refImage = storageRef.child(fname);
			refImage.put(file, metaData).then((snapshot)=>{
				console.log('Uploaded file', snapshot);
				refImage.getDownloadURL().then(function(url) {
					console.error('download url', url);
					setTimeout(()=>{
						let key = databaseRef.push().key;
						databaseRef.child(key).update({
							key : key,
							url : url
						}, (error)=>{
							if(error) console.error('update error: ', error);
							if(error) return reject(error);
							resolve(url);
						})
					},0)
				}).catch(reject)
			}).catch(reject);
		})
		
	}

}
const instance = new Firebase();
export default instance;