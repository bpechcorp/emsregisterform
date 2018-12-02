import React from 'react';

class Main extends React.Component{
	constructor(props){
		super(props)
	}
	shouldComponentUpdate(nextProps, nextState){
		return false;
	}
	render(){
		return (<p>{this.props.message}</p>)
	}
}

export default Main;