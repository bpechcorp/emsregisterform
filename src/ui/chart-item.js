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
					y : 10000 - v.rank
				}
			})
			console.log(_data);
			this._myChart = new Chart(this.refs.mcanvas, {
			    type: 'line',
			    data: {
			    	datasets: [{												
						data: _data,
						type: 'line',
						fill : false,											
						lineColor : 'red'
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
                            display: false,
                            ticks: {
                                beginAtZero: true,
                                steps: 10,
                                stepValue: 100,
                                max: 100
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