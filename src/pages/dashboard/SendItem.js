import React, {Component} from 'react';

class SendItem extends React.Component{
	constructor(props){
		super(props);
		this._clickItem = this._clickItem.bind(this);
	}

	_clickItem(){
		if(this.props.getOnClickFunc){
			const func = this.props.getOnClickFunc();
			if(func) func(this.props.state);
		}
	}

	render(){
		const item = this.props.state || {};
		item.from = item.from || {};
		item.to = item.to || {};
		return (<tr style={{cursor: 'pointer'}} onClick={this._clickItem}>
		      <td>{item.id}</td>
		      <td>{item.barcode}</td>
		      <td>{item.from.name}</td>
		      <td>{item.from.phone}</td>
		      <td>{item.from.address}</td>
		      <td>
		        <span className={`py-0 px-1 bg-${item.status ? "success": "warning"} rounded text-white`}>{item.status ? 'OK' : 'Waiting'}</span>
		      </td>
		    </tr>)
	}
}
export default SendItem;