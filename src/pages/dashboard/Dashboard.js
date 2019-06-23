import React, {Component} from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
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


import Widget from '../../components/Widget';

import { fetchPosts } from '../../actions/posts';
import s from './Dashboard.scss';
import SendItem from './SendItem';
import PopOver, {getBindFunction} from './PopOver';
import DataModelInstance from './dataPostInstance';


const renderRowFromItem = (item)=>(<SendItem key={item.id} state={item} getOnClickFunc={getBindFunction}/>)
class Dashboard extends Component {
  /* eslint-disable */
  static propTypes = {
    posts: PropTypes.any,
    isFetching: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };
  /* eslint-enable */

  static defaultProps = {
    posts: [],
    isFetching: false,
  };

  state = {
    isDropdownOpened: false,
    ver : 0,
  };

  componentDidMount() {
    this.props.dispatch(fetchPosts());
    DataModelInstance.onChangeData(()=>{
      this.setState({
        ver : this.state.ver+1,
      })
    })
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpened: !prevState.isDropdownOpened,
    }));
  }

  render() {
    const items = DataModelInstance.getItems(0);
    const itemDone = DataModelInstance.getItems(1);
    return (
      <div className={s.root}>
        <PopOver />
        <Breadcrumb>
          <BreadcrumbItem>Tracking Order</BreadcrumbItem>
          <BreadcrumbItem active>Tracking</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-lg">Tracking</h1>
        <Row>
          <Col sm={12} md={12}>
            <Widget
              title={
                <div>
                  <div className="pull-right mt-n-xs">
                    <input
                      type="search"
                      placeholder="Search..."
                      className="form-control input-sm"
                    />
                  </div>
                  <h5 className="mt-0 mb-3">
                    <i className="fa fa-user mr-xs opacity-70" />{' '}
                    Waiting
                  </h5>
                </div>
              }
            >
              <Table responsive borderless className={cx('mb-0', s.usersTable)}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Barcode</th>
                    <th>SenderName</th>
                    <th>PhoneNumber</th>
                    <th>Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(v=>renderRowFromItem(v))}
                </tbody>
              </Table>
            </Widget>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12}>
            <Widget
              title={
                <div>
                  <div className="pull-right mt-n-xs">
                    <input
                      type="search"
                      placeholder="Search..."
                      className="form-control input-sm"
                    />
                  </div>
                  <h5 className="mt-0 mb-3">
                    <i className="fa fa-user mr-xs opacity-70" />{' '}
                    History
                  </h5>
                </div>
              }
            >
              <Table responsive borderless className={cx('mb-0', s.usersTable)}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Barcode</th>
                    <th>SenderName</th>
                    <th>PhoneNumber</th>
                    <th>Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {itemDone.map(v=>renderRowFromItem(v))}
                </tbody>
              </Table>
            </Widget>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    posts: state.posts.posts,
  };
}

export default connect(mapStateToProps)(withStyles(s)(Dashboard));
