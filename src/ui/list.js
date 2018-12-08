import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import JItem from 'ui/item';

const SORT_MODE = {
	DEFAULT : 1,
	BYDELTA : 2,
	BYTRENDING: 3,
	BYINCONLY : 4,
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
	    this._sortByTrending = this._sortByTrending.bind(this);
	    this._sortByDefault = this._sortByDefault.bind(this);
	    this._sortByIncOnly = this._sortByIncOnly.bind(this);


	    this._sortByAttr = this._sortByAttr.bind(this);
	}
	_sortByAttr(type, attr, fallback = true){
		if(this.state.sortMode !== type){
			let data = this.props.data;
			if(data && data.length ){
				data.sort((a,b)=>{
					if(b[attr] != a[attr]) return b[attr] - a[attr];
					return b.currentRank - a.currentRank;
				});

				this.setState({
					data : [...data],
					sortMode : type
				})
			}	
		}else{
			if(fallback) this._sortByDefault();
		}
	}
	_sortByIncOnly(){
		this._sortByAttr(SORT_MODE.BYINCONLY, 'incpoint', true);
	}
	_sortByDelta(){
		this._sortByAttr(SORT_MODE.BYDELTA, 'deltaRank', true);	
	}
	_sortByTrending(){
		this._sortByAttr(SORT_MODE.BYTRENDING, 'trendingPoint', true);	
	}
	_sortByDefault(){
		this._sortByAttr(SORT_MODE.DEFAULT, 'currentRank', false);		
	}

	_getRowHeight(){
		return 150;
	}	
	_rowRenderer({index, isScrolling, key, style}) {
		// console.error(index, key, style);
		return (<JItem 
					key={this.state.data[index].id} style={style} 
					idxItem={index} item={this.state.data[index]}
					updateModalData={this.props.updateModalData}
				/>)
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
					<div className = {"button btn-sort-delta " + (this.state.sortMode === SORT_MODE.BYDELTA ? 'active' : '') } 
						onClick={this._sortByDelta}>Sort by Delta</div>
					<div className = {"button btn-sort-delta " + (this.state.sortMode === SORT_MODE.BYTRENDING ? 'active' : '') } 
						onClick={this._sortByTrending}>Sort by Trend</div>
					<div className = {"button btn-sort-delta " + (this.state.sortMode === SORT_MODE.BYINCONLY ? 'active' : '') } 
						onClick={this._sortByIncOnly}>Sort by Inc</div>
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