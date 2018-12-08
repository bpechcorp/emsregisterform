import React from 'react';
import ChartItem from 'ui/chart-item';
import JItem from 'ui/item';
class Modal extends React.Component{
	constructor(props){
		super(props)
		this._cancel = this._cancel.bind(this);
		this._keyDown = this._keyDown.bind(this);
	}
	shouldComponentUpdate(nextProps, nextState){
		return this.props.item !== nextProps.item;
	}
	componentDidMount(){
		window.addEventListener('keydown',this._keyDown)
	}
	componentWillUnmount(){
		window.removeEventListener('keydown',this._keyDown)
	}
	_keyDown(e){
		if(e.key === "Escape"){
			this._cancel();
			e.stopPropagation();
			e.preventDefault();
		}
	}
	_cancel(data){
		this.props.updateModalData(null)
	}
	render(){
		if(!this.props.item) return null;
		return (<div className="modal-container">
			<ChartItem item={this.props.item} />
			<div className="chart-info">
				<JItem 
					key={'item-info'} item={this.props.item}/>	
			</div>
			<div className = {"button modal-close-btn"} onClick={this._cancel}>BACK</div>
		</div>)
	}
}

export default Modal;