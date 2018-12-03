import React from 'react';

class JItem extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			imgSrc : props.imgSrc,
			name : props.name,
			creator : props.creator,
			price : props.price
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
			</div>
		)
	}
}

export default JItem;