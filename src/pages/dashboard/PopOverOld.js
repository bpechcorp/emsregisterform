import React, {Component} from 'react';
import ModalImage,{Lightbox} from 'react-modal-image'

let bindFunction= null;
const demoImage = 'https://b-f18-zpg.zdn.vn/7840656209396259228/f03727909cf878a621e9.jpg'
export const getBindFunction = ()=>bindFunction || (()=>{})
class PopOver extends React.Component{
	constructor(props){
		super(props);
		this.state= {
			item : null
		}
	}
	componentDidUpdate(){
		bindFunction = (item)=>{
			this.setState({
				item
			})
		}
	}
	componentWillUnmount(){
		bindFunction = null;
	}
	_clickItem(){
		
	}

	render(){
		if(!this.state.item) return null;
		return (<Lightbox
		  small={demoImage}
		  large={demoImage}
		  hideZoom
		  onClose={()=>{this.setState({item: null})}}
		/>)
	}
}
export default PopOver;