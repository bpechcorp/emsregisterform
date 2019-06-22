import {databaseTracking} from './firebase-con';
// import ToastStr from 'toastr';
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
// for(let i = 0; i <= 4; i++){
  // fakeDatas.push(Object.assign({id : (i+1), status : (i%2)}, fakeData))
// }
class DataModel {
	constructor(){
		this._listItems = fakeDatas;
		this.updateList = this.updateList.bind(this);
		databaseTracking.on('value', (snapshot)=>{
			if(!snapshot || !snapshot.val) return;
			const item = snapshot.val();
			this.updateList(item);
			console.error('data tracking ', item)
		})
		this.updateItem = this.updateItem.bind(this);
		this.createToast = this.createToast.bind(this);
		this.diffItem = this.diffItem.bind(this);
		this.cbWhenChangeData = null;
	}
	onChangeData(cbWhenChangeData){
		this.cbWhenChangeData = cbWhenChangeData;
	}
	diffItem(u1, u2){
		let change = false;
		['name', 'phone', 'address'].forEach(v=>{
			if(u1 && u2 && u1[v] != u2[v]){
				change = true;
				
			}
		})
		return change;
	}
	updateList(newItems){
		const oldSet = {};
		this._listItems.forEach(v=>{
			if(v) oldSet[v.id] = v;
		})
		const newList = [];
		let change = false;
		for(const k in newItems){
			const item = newItems[k];
			if(!item || !item.id) continue;
			if(oldSet[item.id]){
				if(oldSet[item.id].status != item.status || this.diffItem(oldSet[item.id].from, item.from)
					|| this.diffItem(oldSet[item.id].to, item.to)){
					change = true;
				}
			}else{
				const user_name = item.from.name;
				setTimeout(()=>{
					this.createToast(`You just have new Order from ${  user_name}`);
				}, 0);
			}
			newList.push(item);
		}
		if(newList.length != this._listItems.length){
			change = true;
		}
		this._listItems = newList;
		if(change) setTimeout(()=>{
			if(this.cbWhenChangeData) this.cbWhenChangeData();
		},0)
	}
	updateItem(newItem){
		if(!newItem) return;
		const items = [...this._listItems];
		items.forEach(v=>{
			if(v && v.id == newItem.id){
				databaseTracking.child(newItem.id).set(newItem);
			}
		})
		this.createToast(`Updating status of Item ${newItem.barcode}!`, true);
	}
	createToast(msg){
		try{
			if(window.Messenger && typeof window.Messenger === 'function'){
				Messenger.options = {
			      extraClasses: 'messenger-fixed messenger-on-top',
			      theme: 'air',
			    };
				Messenger().post({
				  message: msg,
				  type: 'info',
				  showCloseButton: true
				});
			}
		}catch(err){
			console.error(err);
		}
		
		// Messenger().post({
		//   message: 'There was an explosion while processing your request.',
		//   type: 'error',
		//   showCloseButton: true
		// });
	}
	createToast2(msg, progress, tag = 'error'){
		// ToastsStore.success("Hey, you just clicked!")
		let options = {}
		if(progress){
			options = {
			  "closeButton": false,
			  "debug": false,
			  "newestOnTop": false,
			  "progressBar": true,
			  "positionClass": "toast-top-center",
			  "preventDuplicates": false,
			  "onclick": null,
			  "showDuration": "300000",
			  "hideDuration": "100000",
			  "timeOut": "500000",
			  "extendedTimeOut": "100000",
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut"
			}
			ToastStr.options = Object.assign(ToastStr.options, options);
			ToastStr.info(msg);
		} else {
			options = {
			  "closeButton": false,
			  "debug": false,
			  "newestOnTop": false,
			  "progressBar": false,
			  "positionClass": "toast-top-center",
			  "preventDuplicates": false,
			  "onclick": null,
			  "showDuration": "3000",
			  "hideDuration": "1000",
			  "timeOut": "5000",
			  "extendedTimeOut": "1000",
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut"
			}
			ToastStr.options = Object.assign(ToastStr.options, options);
			ToastStr.error(msg);
		}
		
	}
	getItems(){
		return [...this._listItems];
	}
}

const instane = new DataModel();
export default instane;