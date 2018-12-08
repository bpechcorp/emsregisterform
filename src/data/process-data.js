const fs = require('fs');
const output = fs.createWriteStream('./data.json', {encoding : "utf8"});
var allItems = {}
var dupSet = new Set();
{
	let content = fs.readFileSync('./data-items.json', {encoding : 'utf8'});
	content = JSON.parse(content);
	console.log('number of items ', content.length);
	content.forEach(obj=>{
		if(!obj) return;
		// let obj = JSON.parse(v);		
		allItems[obj.id] = obj;
		allItems[obj.id].ranks = allItems[obj.id].ranks || [];
	})
	console.log('number of items ', Object.keys(allItems).length);
}

for(let i = 17867; i <= 17873; i++){
	if(!fs.existsSync(`./rank-${i}.json`)) {
		console.error('not exist file ', i);
		continue;
	}
	let content = fs.readFileSync(`./rank-${i}.json`, {encoding : 'utf8'});
	content = content.trim().split('\n');
	content.forEach(v=>{
		if(!v) return;		
		let obj = JSON.parse(v);		
		if(obj.date != i){
			console.error('wrong date ' , obj.id, obj.date, obj);
			return;
		}
		if(allItems[obj.id]){
			let uniqueKey = obj.id + '_' + obj.date;
			if(!dupSet.has(uniqueKey)){
				allItems[obj.id].ranks.push({
					date : obj.date,
					rank : obj.rank
				})
				// if(obj.rank == 1){
				// 	console.error(obj);
				// 	console.error(allItems[obj.id], obj.date, obj.rank, i);
				// }
				dupSet.add(uniqueKey);
			}else{
				// console.error('dup ', obj.id, obj.date);
			}			
		}else{
			// console.error('dont have items ', obj.id);
		}
		
	})
}	

//trans to arrays
var finalRes = []
for(let k in allItems){
	if(!allItems[k] || !allItems[k].ranks.length) continue;
	{
		let r = allItems[k].ranks;
		// if(r[r.length - 1].date == 17873){
		// 	console.log('====================found========================')
		// 	console.log(r);
		// 	console.log('====================found========================')
		// }
	}
	finalRes.push(allItems[k])
}
console.log('number of items ', finalRes.length)
console.error(finalRes[0])
output.write(JSON.stringify(finalRes));
output.end();