require("static/css/main.css");
import React from 'react';
import ImageUpload from 'ui/image-upload';
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
	}
	shouldComponentUpdate(nextProps, nextState){
		return this.state.modalData !== nextState.modalData;
	}
	_createToast(msg){
		// ToastsStore.success("Hey, you just clicked!")
	}
	_updateModalData(data){
		this.setState({
			modalData : data
		})
	}
	// <ToastsContainer store={ToastsStore}/>
	render(){
		return (<div style={{width: '100vw', height : '100vh'}}>
			<ImageUpload createToast={this._createToast}/>
			
		</div>)
	}
}

export default Main;