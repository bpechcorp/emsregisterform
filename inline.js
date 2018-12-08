
function crawl(){
// var fetch = require('node-fetch');
// const url = `https://www.teepublic.com/t-shirts?sort=popular`;
// const url = `https://www.teepublic.com/t-shirts?page=__$pageid$__&sort=popular`;
// var cheerio = require('cheerio');
// var fs = require('fs');
window._respData = []
window._respRankData = []
var outStream = {
	write : (data)=>{
	},
	end : ()=>{}
}
var respStream = {
	write : (data)=>{
		window._respData = window._respData || []
		window._respData.push(data);
	},
	end : ()=>{}
};
var respRankStream = {
	write : (data)=>{
		window._respRankData = window._respRankData || []
		window._respRankData.push(data);
	},
	end : ()=>{}
};
function fetchLiveContent(pageId){
	let rurl = `https://www.teepublic.com/t-shirts?page=${pageId}&sort=popular`
	return new Promise((resolve, reject)=>{
		let rq = new XMLHttpRequest();
		rq.open('GET', rurl);
		rq.onreadystatechange = ()=>{
			if(rq.readyState === 4){
				resolve(rq.responseText)
			}
		}
		rq.onerror = reject
		rq.onabort = reject
		rq.send()
	})
}


class RankItem{
	constructor(){}

	set date(val){this._date = val};
	get date(){return this._date};

	set rank(val){this._rank = val};
	get rank(){return this._rank};

	set updateTs(val){this._updateTs = val};
	get updateTs(){return this._updateTs};

	set id(val){this._id = val}
	get id(){return this._id}	

	pureObject(){
		return{
			id : this._id,
			date : this._date,
			rank : this._rank,
			updateTs : this._updateTs
		}
	}
}

class Item{
	constructor(){}

	set href(val){this._href = val};
	get href(){return this._href};

	set imgSrc(val){this._imgSrc = val};
	get imgSrc(){return this._imgSrc};

	set name(val){this._name = val};
	get name(){return this._name};	


	set creator(val){this._creator = val};
	get creator(){return this._creator};

	set price(val){this._price = val};
	get price(){return this._price};

	set id(val){this._id = val}
	get id(){return this._id}	

	pureObject(){
		return{
			href : this._href,
			imgSrc : this._imgSrc,
			name : this._name,
			creator : this._creator,
			price : this._price,
			id : this._id
		}
	}
}

function doWithContent(content){
	return new Promise((resolve, reject)=>{
		//outStream.write(content);
		//outStream.end();
		var parser = new DOMParser();
		let doc = parser.parseFromString(content, "text/html");
		// var $ = cheerio.load(content);
		// let allItems = $(".jsDesignContainer");
		let allItems = doc.querySelectorAll('.jsDesignContainer');
		console.error('found length', allItems.length);
		if(!allItems.length) return reject('not valid content');
		for(let i = 0; i < allItems.length; i++){
			let item = allItems[i];
			// let first = $(item).find('.m-tiles__preview').first();
			let first = item.querySelector('.m-tiles__preview');
			let imgSrc = first.querySelector('img').getAttribute('data-src');
			// console.error(item);
			let name = item.querySelector('h2.m-tiles__info').innerText.trim();
			// console.error(name);
			let creator = item.querySelector('div.m-tiles__info').innerText.trim();
			// console.error(creator);
			let price = item.querySelectorAll('div.m-tiles__info')[1].innerText.trim();
			// console.error(price);
			let obj = new Item();
			obj.href = first.href;
			obj.imgSrc = imgSrc;
			obj.name = name;
			obj.creator = creator;
			obj.price = price;
			obj.id  = obj.href;

			let rankObj = new RankItem();
			const now = Date.now();
			rankObj.id = obj.id;
			rankObj.date = Math.floor(now/ (1000 * 60* 60 *24))
			rankObj.rank = ++currentRank;
			rankObj.updateTs = now;

			// console.error($(item).html());
			console.error('item: ', obj.pureObject());
			console.error('rank: ', rankObj.pureObject());

			respStream.write(JSON.stringify(obj.pureObject()) + '\n') 

			respRankStream.write(JSON.stringify(rankObj.pureObject()) + '\n' );
		}		
		resolve()
	})
}

var pageId = 0;
var currentRank = 0;
const MAX_PAGE = 277;

function doEnd(err){
	console.error(pageId, err);
	respStream.end();
	respRankStream.end();
}
function run(){
	pageId++;
	if(pageId > MAX_PAGE){		
		doEnd('COMPLETED');
		return;
	}
	fetchLiveContent(pageId).then((content)=>{
		doWithContent(content).then(()=>{
			run()
		}).catch(doEnd)
	}).catch(doEnd)
}

run()
// fetchLiveContent().then(doWithContent).catch(console.error);
// readCacheContent().then(doWithContent).catch(console.error);
}