require("static/css/main.css");
import React from 'react';
import JList from 'ui/list';

class Main extends React.Component{
	constructor(props){
		super(props)
	}
	shouldComponentUpdate(nextProps, nextState){
		return false;
	}
	render(){
		return (<div className={"main"}>
			<JList />
		</div>)
	}
}

export default Main;