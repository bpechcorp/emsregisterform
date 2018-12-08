require("static/css/main.css");
import React from 'react';
import JList from 'ui/list';
import JData from 'data/jdata';
import Modal from 'ui/modal';

class Main extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			modalData : null
		}
		this._updateModalData = this._updateModalData.bind(this);
	}
	shouldComponentUpdate(nextProps, nextState){
		return this.state.modalData !== nextState.modalData;
	}
	_updateModalData(data){
		this.setState({
			modalData : data
		})
	}
	render(){
		return (<div>
			{this.state.modalData ? 
				<Modal 
					item = {this.state.modalData}
					updateModalData={this._updateModalData} />: null}
			<JList data = {JData} updateModalData={this._updateModalData}/>
		</div>)
	}
}

export default Main;