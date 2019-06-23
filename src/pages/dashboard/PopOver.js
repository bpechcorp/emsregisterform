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
import DataModelInstance from './dataPostInstance';

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
		this._edit2 = this._edit2.bind(this);
		this._edit1 = this._edit1.bind(this);
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
		const nItem = {...this.state.item} || {};
		if(this.state.edit1){
			if(this.refs.Sender && this.refs.Sender.getValue){
				const v = this.refs.Sender.getValue();
				if(v && typeof v === 'object'){
					nItem.from = v;
				}
			}
		}
		if(this.state.edit2){
			if(this.refs.Receiver && this.refs.Receiver.getValue){
				const v = this.refs.Receiver.getValue();
				if(v && typeof v === 'object'){
					nItem.to = v;
				}
			}
		}
		nItem.status = true;
		this.setState({
			item : nItem,
			edit1 : false,
			edit2 : false,
		})
		DataModelInstance.updateItem(nItem);


	}
	_clickClose(){
		this.setState({
			item : null
		})
	}
	_edit1(){
		this.setState({
			edit1 : true
		})
	}
	_edit2(){
		this.setState({
			edit2 : true
		})
	}

	render(){
		if(!this.state.item) return null;
		const item = this.state.item || {};
		const editable = !item.status;
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
		                    {editable ? <i onClick={this._edit1} className="fa fa-edit" style={{float:'right', cursor: 'pointer'}}/> : null}
		                  </h5>
		              }>
				      <InfoUser ref="Sender" state={this.state.item.from} edit={this.state.edit1}/>
		            </Widget>
		      	</Row>
		      	<Row>
		      		<Widget className="container-fluid"
		              title={
		                  <h5>
		                    <i className="fa fa-user mr-xs opacity-70" />{' '}
		                    Receiver
		                    {editable ? <i onClick={this._edit2} className="fa fa-edit" style={{float:'right', cursor: 'pointer'}}/> : null}
		                  </h5>
		              }>
				      <InfoUser ref="Receiver" state={this.state.item.to} edit={this.state.edit2}/>
		            </Widget>
		      	</Row>
		      </Col>
		      <Col sm={12} md={6} className="my-auto">
		      	<ModalImage
		      		style={{maxHeight : '510px',display:'block', margin: 'auto'}}
	      			small={item.url}
			  		large={item.url}
			  		hideDownload
				  	onClose={null} />
		      </Col>
        	</Row>
        	<Row sm={12} md={12} className="h-25 mt-4 pt-2">
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