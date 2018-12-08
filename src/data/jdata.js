const Data = require('data/data.json');

//find current rank

let date = Math.floor(Date.now()/ (1000*60*60*24));
var _data = Data;
console.log(_data.length, date,  _data.slice(0,10));
let def = _data.length + 10;
module.exports = _data.map(v=>{
	let ranks = v.ranks;
	v.deltaRank = 0;
	v.currentRank = def;
	if(ranks.length && ranks[ranks.length - 1].date == date){
		v.currentRank = ranks[ranks.length - 1].rank;

		if(ranks.length > 1){
			v.deltaRank = ranks[ranks.length - 2].rank - v.currentRank;
		}
	}
	return v;
}).sort((a,b)=>{
	return a.currentRank - b.currentRank;
})