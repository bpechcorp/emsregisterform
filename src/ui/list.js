import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import JItem from 'ui/item';

const SORT_MODE = {
	DEFAULT : 1,
	BYDELTA : 2
}
class JList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
	      listHeight: 300,
	      listRowHeight: 150,
	      overscanRowCount: 10,
	      rowCount: props.data.length,
	      data : [...props.data],
	      scrollToIndex: undefined,
	      showScrollingPlaceholder: false,
	      useDynamicRowHeight: false,
	      sortMode : SORT_MODE.DEFAULT    
	    };
		this._getRowHeight = this._getRowHeight.bind(this);
	    this._rowRenderer = this._rowRenderer.bind(this);
	    this._sortByDelta = this._sortByDelta.bind(this);
	    this._sortByDefault = this._sortByDefault.bind(this);
	}
	_sortByDelta(){
		if(this.state.sortMode !== SORT_MODE.BYDELTA){
			let data = this.props.data;
			if(data && data.length ){
				data.sort((a,b)=>{
					if(b.deltaRank != a.deltaRank) return b.deltaRank - a.deltaRank;
					return a.currentRank - b.currentRank;
				});

				this.setState({
					data : [...data],
					sortMode : SORT_MODE.BYDELTA
				})
			}	
		}else{
			this._sortByDefault();
		}		
	}
	_sortByDefault(){
		if(this.state.sortMode !== SORT_MODE.DEFAULT){
			let data = this.props.data;
			if(data && data.length ){
				data.sort((a,b)=>{					
					return a.currentRank - b.currentRank;
				});

				this.setState({
					data : [...data],
					sortMode : SORT_MODE.DEFAULT
				})
			}	
		}		
	}

	_getRowHeight(){
		return 150;
	}	
	_rowRenderer({index, isScrolling, key, style}) {
		// console.error(index, key, style);
		return (<JItem key={this.state.data[index].id} style={style} idxItem={index} item={this.state.data[index]}/>)
	}

	shouldComponentUpdate(nextProps, nextState){
		return this.state.sortMode != nextState.sortMode;
	}

	render(){
		let { listHeight, rowCount, listRowHeight,
			scrollToIndex, overscanRowCount, useDynamicRowHeight } = this.state;
		return (
			<div className={"main"}>
				<div className="list-control">
					<div className = {"button btn-sort-delta " + (this.state.sortMode === SORT_MODE.BYDELTA ? 'active' : '') } onClick={this._sortByDelta}>Sort by Delta</div>
				</div>
				<div className={"list"}>
		          <AutoSizer>
		            {({height, width}) => (
		              <List
		                ref="List"
		                height={height}
		                sortBy={this.state.sortMode}
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
	        </div>
        )
	}
}

export default JList;