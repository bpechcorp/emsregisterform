class ItemObject{

	constructor({sender, receiver, barcode, status, id}){
		this.sender = sender || {};
		this.receiver = receiver || {};
		this.barcode = barcode;
		this.status = status;
		this.id = id;
	}
	toString(){
		return {
			barcode: this.barcode,
			sender : this.sender,
			receiver : this.receiver,
			status : this.status,
			id : this.id,
		}
	}
}

/*
{
    "barcode": "MK023948234",
    "from": {
        "address": "182 Le Dai Hanh, Phuong 15, Quan 11, HCM",
        "name": "Ha Nhat Cuong",
        "phone": "0169696969"
    },
    "status": true,
    "to": {
        "address": "69 Le Dai Hanh, Phuong 15, Quan 11, HCM",
        "name": "Pham Ba Cuong Quoc",
        "phone": "0169696969"
    }
}

*/

export default ItemObject;