require("static/css/main.css");
require("static/css/toaststr.css");
import React from 'react';
import ImageUpload from 'ui/image-upload';
import ToastStr from 'toastr';
// import {ToastsContainer, ToastsStore} from 'react-toasts';
// import JList from 'ui/list';
// import JData from 'data/jdata';
// import Modal from 'ui/modal';
// {this.state.modalData ? 
// 				<Modal 
// 					item = {this.state.modalData}
// 					updateModalData={this._updateModalData} />: null}
// 			<JList data = {JData} updateModalData={this._updateModalData}/>

class Main extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			modalData : null
		}
		this._updateModalData = this._updateModalData.bind(this);
		this._createToast = this._createToast.bind(this);
		this._clearToast = this._clearToast.bind(this);
		window.$this = this;
	}
	shouldComponentUpdate(nextProps, nextState){
		return this.state.modalData !== nextState.modalData;
	}
	_clearToast(){
		ToastStr.clear();
	}
	_createToast(msg, progress){
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
	_updateModalData(data){
		this.setState({
			modalData : data
		})
	}
	// <ToastsContainer store={ToastsStore}/>
	render(){
		return (<div style={{width: '100vw', height : '100vh'}}>
			<ImageUpload
				clearToast = {this._clearToast} 
				createToast={this._createToast}/>
			
		</div>)
	}
}

export default Main;