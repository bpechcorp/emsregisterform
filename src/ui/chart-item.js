import React from 'react';
import Chart from 'chart.js';

class ChartItem extends React.Component{
	constructor(props){
		super(props);
		// this.state = {}	
		// Object.assign(this.state, props.item);				
	}	

	shouldComponentUpdate(nextProps, nextState){
		return typeof(this.props.item) != typeof(nextProps.item) 
			|| (typeof(this.props.item) === 'object' && this.props.item.id !== nextProps.item.id);
	}	
	componentDidMount(){
		if(this.refs.mcanvas && this.props.item && this.props.item.ranks && !this._myChart){
			let _data = this.props.item.ranks.map(v=>{
				return {
					x : v.date * 24*60*60*1000,
					y : v.rank
				}
			})
			let _max = _data[0].y;
			let _min = _data[0].y;
			_data.forEach(v=>{
				_max = Math.max(_max, v.y)
				_min = Math.min(_min, v.y)
			})
			let _rangMax = _max - _min + 10;
			let _stepRange = Math.floor(_rangMax/ 30);
			console.log(_data);
			this._myChart = new Chart(this.refs.mcanvas, {
			    type: 'line',
			    data: {
			    	datasets: [{												
						data: _data,
						type: 'line',
						fill : false,											
						borderColor : 'red'
					}]
			    },
			    options: {
			    	responsive: true,
			    	title : {display : false},
			    	legend: {
				        display: false
				    },
			        scales: {
			            xAxes: [{
			                type: 'time',			                
			                time: {
			                    unit: 'day'
			                },
			                gridLines: {
				                display:false
				            }
			            }],			            
                    yAxes: [{
                            display: true,
                            ticks: {
                                beginAtZero: false,
                                steps: 30,
                                stepValue: _stepRange,
                                max: _max + 5,
                                min : _min - 5
                            },
                            gridLines: {
				                display:false
				            }
                        }]                
			        }
			    }
			})
		}
	}
	render(){
		// console.error('render ', this.state.idxItem);
		return(
			<div className="chart-container">
				<canvas ref="mcanvas" width={600} height={200} style={{width: 'calc(100% - 20px)', height: 'calc(100% - 20px)'}}/>	
			</div>

		)
	}
}

export default ChartItem;