const Data = require('data/data.json');

//find current rank
let date = 17881;//Math.floor(Date.now()/ (1000*60*60*24));
var _data = Data;
console.log(_data.length, date,  _data.slice(0,10));
let def = _data.length + 10;

const incPointAbs = 10;
function jincpoint(arr){
	if(arr.length < 3) return 0;
	let s = 1;
	for(let i = 1; i < arr.length; i++){
		if(arr[i].rank + incPointAbs <= arr[i-1].rank) return 0;
		s *= Math.max(1, arr[i].rank - arr[i-1].rank);
	}
	return Number(Math.pow(Math.E, Math.log(s)/arr.length)).toFixed(2);
}
function jtrending(arr){
	if(arr.length < 2) return 0;
	if(arr.length > 7) arr = arr.slice(-7);
	let pre = arr[0];
	const b = 0.9;
	let ans = 0;
	for(let i =1; i < arr.length; i++){
		let disToNow = arr.length - i - 1;
		let mul = 1;
		if(disToNow < 2 && arr.length > 3){
			mul = Math.pow(10, 2- disToNow);
		}
		ans += (arr[i].rank - pre.rank)*mul/((arr[i].date - pre.date));
		// pre = curr;
	}
	ans/= (arr.length - 1);
	// console.error(arr, pre);
	ans = Number(ans).toFixed(2);
	return ans;
}
module.exports = _data.map(v=>{
	let ranks = v.ranks;
	ranks.forEach(v=>v.rank = Math.max(def - v.rank,1));
	v.deltaRank = 0;
	v.currentRank = 0;
	v.trendingPoint = 0;
	v.incpoint = 0;

	v.stt = def;
	if(ranks.length && ranks[ranks.length - 1].date == date){
		v.currentRank = ranks[ranks.length - 1].rank;
		v.stt = def - v.currentRank;
		v.incpoint = jincpoint(ranks);
		v.trendingPoint = jtrending(ranks);
		if(ranks.length > 1){
			v.deltaRank = v.currentRank - ranks[ranks.length - 2].rank;
		}
	}
	return v;
}).sort((a,b)=>{
	return b.currentRank - a.currentRank;
})