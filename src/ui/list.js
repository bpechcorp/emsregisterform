import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import JItem from 'ui/item';
import JData from 'data/item-data';


class JList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
	      listHeight: 300,
	      listRowHeight: 150,
	      overscanRowCount: 10,
	      rowCount: JData.length,
	      scrollToIndex: undefined,
	      showScrollingPlaceholder: false,
	      useDynamicRowHeight: false,
	    };
		this._getRowHeight = this._getRowHeight.bind(this);
	    this._noRowsRenderer = this._noRowsRenderer.bind(this);
	    this._onRowCountChange = this._onRowCountChange.bind(this);
	    this._rowRenderer = this._rowRenderer.bind(this);

	}
	_getRowHeight(){
		return 10;
	}
	_noRowsRenderer(){
		return 20;
	}
	_onRowCountChange(){}
	_rowRenderer({index, isScrolling, key, style}) {
		if(isScrolling && false){
			return (
				<div
				  className={""}
				  key={key}
				  style={style}>
				  Scrolling...
				</div>
			);	
		}else{
			return (<JItem key = {key} {...JData[index]}/>)
		}
		
	}

	shouldComponentUpdate(nextProps, nextState){
		return false;
	}

	render(){
		let { listHeight, rowCount, listRowHeight,
			scrollToIndex, overscanRowCount, useDynamicRowHeight } = this.state;
		return (
			<div className={"list"}>
	          <AutoSizer>
	            {({height, width}) => (
	              <List
	                ref="List"
	                height={height}
	                overscanRowCount={overscanRowCount}
	                noRowsRenderer={this._noRowsRenderer}
	                rowCount={rowCount}
	                rowHeight={
	                  useDynamicRowHeight ? this._getRowHeight : listRowHeight
	                }
	                rowRenderer={this._rowRenderer}
	                scrollToIndex={scrollToIndex}
	                width={width}
	              />
	            )}
	          </AutoSizer>
	        </div>
        )
	}
}

export default JList;