import React, {Component} from 'react';
import s from './Dashboard.scss';
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

class EditText extends React.Component{
  constructor(props){
    super(props)
    this.getValue = this.getValue.bind(this);
  }
  getValue(){
    if(this.refs && this.refs.input){
      return this.refs.input.value || this.props.state[this.props.attrkey] || "";
    }
  }
  render(){
    if(this.props.edit){
      return (<input ref="input" type={this.props.type} className="form-control" 
              placeholder={this.props.state[this.props.attrkey]} />
            )  
    }
      return (<div>{this.props.state[this.props.attrkey]}</div>)
    
    
  }
}
class InfoUser extends React.Component{
	constructor(props){
		super(props);
    this.getValue = this.getValue.bind(this);
	}
  getValue(){
    const item = {...(this.props.state||{})};
    ['name', 'phone', 'address'].forEach(v=>{
      if(this.refs && this.refs[v] && this.refs[v].getValue){
        const vv = this.refs[v].getValue();
        item[v] = vv || "";
      }
    })
    return item;
  }
  render(){
    if(!this.props.state) return null;
    const item = this.props.state || {};
    return (<Table responsive borderless className={cx('mb-0', s.usersTable)}>
                    <thead>
                      <tr>
                        <th>Info</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {<td>Name</td>}
                        <td>                          
                          <EditText ref="name" edit={this.props.edit} type="name" state={item} attrkey="name"/>
                        </td>
                      </tr>
                      <tr>
                        <td>Phone</td>
                        <td>                          
                          <EditText ref="phone" edit={this.props.edit} type="name" state={item} attrkey="phone"/>
                        </td>
                      </tr>
                      <tr>
                        <td>Address</td>
                        <td>                          
                          <EditText ref="address" edit={this.props.edit} type="name" state={item} attrkey="address"/>
                        </td>
                      </tr>
                     </tbody>
                </Table>)
  }
}
export default InfoUser;