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
	    this._rowRenderer = this._rowRenderer.bind(this);

	}
	_getRowHeight(){
		return 150;
	}
	_rowRenderer({index, isScrolling, key, style}) {
		console.error(index, key, style);
		return (<JItem key={JData[index].id} style={style} idxItem={index} item={JData[index]}/>)
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
	                rowCount={rowCount}
	                rowHeight={
	                  useDynamicRowHeight ? this._getRowHeight : listRowHeight
	                }
	                rowRenderer={this._rowRenderer}
	                width={width}
	              />
	            )}
	          </AutoSizer>
	        </div>
        )
	}
}

export default JList;