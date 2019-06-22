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

class InfoUser extends React.Component{
	constructor(props){
		super(props);
	}
  render(){
    const item = this.props.state;
    if(!item) return null;
    return (<Table responsive borderless className={cx('mb-0', s.usersTable)}>
                    <thead>
                      <tr>
                        <th>Info</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Name</td>
                        <td>{item.name}</td>
                      </tr>
                      <tr>
                        <td>Phone</td>
                        <td>{item.phone}</td>
                      </tr>
                      <tr>
                        <td>Address</td>
                        <td>{item.address}</td>
                      </tr>
                     </tbody>
                </Table>)
  }
}
export default InfoUser;