require("static/css/main.css");
import React from 'react';
import JList from 'ui/list';
import JData from 'data/jdata';

class Main extends React.Component{
	constructor(props){
		super(props)
	}
	shouldComponentUpdate(nextProps, nextState){
		return false;
	}
	render(){
		return (<div>
			<JList data = {JData}/>
		</div>)
	}
}

export default Main;