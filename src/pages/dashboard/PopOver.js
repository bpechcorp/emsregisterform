import React, {Component} from 'react';
import ModalImage,{Lightbox} from 'react-modal-image'
import s from './Dashboard.scss';
import InfoUser from './InfoUser';
import Widget from '../../components/Widget';
import cx from 'classnames';
import {
  Row,
  Col,
  Alert,
  Button,
  ButtonGroup,
  Breadcrumb,
  BreadcrumbItem,
  Progress,
  Badge,
  ListGroup,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Table
} from 'reactstrap';

let bindFunction= null;
const demoImage = 'https://b-f18-zpg.zdn.vn/7840656209396259228/f03727909cf878a621e9.jpg'
export const getBindFunction = ()=>bindFunction || (()=>{})
class PopOver extends React.Component{
	constructor(props){
		super(props);
		this.state= {
			item : null
		}
		this._clickClose = this._clickClose.bind(this);
		this._clickVerify = this._clickVerify.bind(this);
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
	_clickVerify(){
		const barcode = (this.state.item || {}).barcode;
		const Messenger = window.Messenger;
		if(Messenger && typeof Messenger === 'function'){
			Messenger().post({
			  message: `Verify item ${  barcode}`,
			  type: 'info',
			  showCloseButton: true
			});
		}
		
		const nItem = this.state.item || {};
		nItem.status = true;
		this.setState({
			item : nItem
		})

	}
	_clickClose(){
		this.setState({
			item : null
		})
	}

	render(){
		if(!this.state.item) return null;
		const item = this.state.item || {};
		return (<div style={{position: 'absolute', zIndex : '1000',
							background: '#cccbca', 
							width: '88vw', height: '80vh', padding: '10px'}}>
			<h1 style={{background: 'black', padding: '10px', borderRadius: '5px', color: 'white'}} className="mb-lg text-center text-bold">
				{`Tracking Details: ${item.barcode}`}
			</h1>
			<Row sm={12} md={12} className="h-75">
		      <Col sm={12} md={6} className="my-auto">
		      	<Row>
		      		<Widget className="container-fluid"
		              title={
		                  <h5>
		                    <i className="fa fa-user mr-xs opacity-70" />{' '}
		                    Sender
		                  </h5>
		              }>
				      <InfoUser state={this.state.item.from} />
		            </Widget>
		      	</Row>
		      	<Row>
		      		<Widget className="container-fluid"
		              title={
		                  <h5>
		                    <i className="fa fa-user mr-xs opacity-70" />{' '}
		                    Receiver
		                  </h5>
		              }>
				      <InfoUser state={this.state.item.to} />
		            </Widget>
		      	</Row>
		      </Col>
		      <Col sm={12} md={6} className="my-auto">
		      	<ModalImage
	      			small={demoImage}
			  		large={demoImage}
			  		hideDownload
				  	hideZoom
				  	onClose={null} />
		      </Col>
        	</Row>
        	<Row sm={12} md={12} className="h-25">
        		<Col><Button onClick={this._clickVerify} block disabled={!!item.status} className="m-auto p-3 w-50" color="success" tag="button">
        			<i className="fa fa-check text-info mr-xs mb-xs" style={{color: 'white !important'}} />{"Verify"}
        			</Button>
        		</Col>
        		<Col><Button onClick={this._clickClose} block className="m-auto p-3 w-50" color="inverse" tag="button">
        			<i className="fa fa-close text-info mr-xs mb-xs" style={{color: 'white !important'}} />{"Close"}
        			</Button>
        		</Col>
        	</Row>
		</div>)
	}
}
export default PopOver;