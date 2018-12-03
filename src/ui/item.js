import React from 'react';
const Colors = [`#3498db`, '#e67e22', '#f39c12', '#f1c40f']

class JItem extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			imgSrc : props.imgSrc,
			name : props.name,
			creator : props.creator,
			price : props.price,
			color : Colors[Math.floor(Math.random() * Colors.length)],
			rank : Math.floor(Math.random() * 100 ) + 10 
		}
	}

	shouldComponentUpdate(nextProps, nextState){
		return false;
	}


	render(){

		return(
			<div className="item-container">
				<div className="item-image" style={{backgroundImage : `url("${this.state.imgSrc}")`}}>
				</div>
				<div className="item-info-container">
					<div>{this.state.name}</div>
					<div>{this.state.creator}</div>
					<div>{this.state.price}</div>
				</div>
				<div className="item-info-rank" style={{color:`${this.state.color}`}}>
				{this.state.rank}
				</div>
			</div>
		)
	}
}

export default JItem;