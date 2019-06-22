import {databaseTracking} from './firebase-con';

const fakeData = {
    "barcode": "MK023948234",
    "from": {
        "address": "182 Le Dai Hanh, Phuong 15, Quan 11, HCM",
        "name": "Ha Nhat Cuong",
        "phone": "0169696969"
    },
    "status": false,
    "to": {
        "address": "69 Le Dai Hanh, Phuong 15, Quan 11, HCM",
        "name": "Pham Ba Cuong Quoc",
        "phone": "0169696969"
    }
}
const fakeDatas = [];
for(let i = 0; i <= 4; i++){
  fakeDatas.push(Object.assign({id : (i+1), status : (i%2)}, fakeData))
}
class DataModel {
	constructor(){
		this._listItems = fakeDatas;
		databaseTracking.on('value', (snapshot)=>{
			if(!snapshot || !snapshot.val) return;
			const item = snapshot.val();
			console.error('data tracking ', item)
		})
	}
	updateItem(item){

	}
	getItems(){
		return [...this._listItems];
	}
}

const instane = new DataModel();
export default instane;