import React from 'react';
import ChartItem from 'ui/chart-item';
const Colors = ['#009688', '#607D8B', '#F44336', '#f1c40f']

class JItem extends React.Component{
	constructor(props){
		super(props);
		this.state = {}
		let bonus = (props.item.deltaRank > 0) ? '+': '';		
		Object.assign(this.state, props.item, {
			color : Colors[props.item.deltaRank > 0 ? 0 : props.item.deltaRank == 0 ? 1 : 2],
			deltaRank :  bonus + props.item.deltaRank,
			idxItem : props.item.currentRank
		});
		this._onClick = this._onClick.bind(this);
		
	}
	_onClick(){
		window.open(this.props.item.id);
	}

	shouldComponentUpdate(nextProps, nextState){
		return this.props.style !== nextProps.style
			|| typeof(this.props.item) != typeof(nextProps.item) 
			|| this.props.item.id !== nextProps.item.id;
	}	

	render(){
		// console.error('render ', this.state.idxItem);
		return(
			<div style={this.props.style}>
				<div className="item-container">
					<div className="item-index">{this.state.idxItem}</div>
					<div className="item-image" style={{backgroundImage : `url("${this.state.imgSrc}")`}}>
					</div>
					<div className="item-info-container" onClick = {this._onClick}>
						<div>{this.state.name}</div>
						<div>{this.state.creator}</div>
						<div>{this.state.price}</div>
					</div>
					<div className="item-info-rank" style={{color:`${this.state.color}`}}>
						{this.state.deltaRank}						
					</div>
					{/*<ChartItem item={this.props.item} />*/}
				</div>
			</div>
		)
	}
}

export default JItem;