const fs = require('fs');
const output = fs.createWriteStream('./data-items.json', {encoding : "utf8"});
var allItems = []
var dupSet = new Set();
var itemsFiles = ['17868', '17873', '17874', '17879', '17880'];
for(let i = 0; i < itemsFiles.length; i++)
{
	let content = fs.readFileSync(`./item-${itemsFiles[i]}.json`, {encoding : 'utf8'});
	content = content.split('\n');
	console.log('number of lines ', content.length);
	let c = 0;
	content.forEach(v=>{
		if(!v) return;
		let obj = JSON.parse(v);		
		if(dupSet.has(obj.id)){
			// console.error('dup ', obj.id);
			return;
		}
		c++;
		dupSet.add(obj.id);
		allItems.push(obj);		
	})
	console.log('number of items ', c);	
	console.log('number of dup ', content.length - c);
}

output.write(JSON.stringify(allItems));
output.end();