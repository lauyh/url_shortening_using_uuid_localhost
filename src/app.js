const express = require('express')
const { uuid } = require('uuidv4');
const URL = require("url").URL;

const app = express()

var map_of_uuid_to_url = []
/**
 * obj design
 * {
 * 	id : uuid,
 *  url : url
 * }
 **/

app.use(express.json())
app.post('/shorten_url', (req, res)=>{
	const url = req.body.url

	console.log('[INFO]\t-\turl\t->\t' + url)
	if(!url){
		res.status(400).json({'errMsg': 'Expected body of url but received none'})
	}
	if(!isValidUrlStr(url)){
		res.status(400).json({'errMsg': 'Expected an url but received isn\'t i.e. http://google.com, https://google.com'})
	}

	if(map_of_uuid_to_url.some( x => x['url'] == url)){
		console.log('[INFO]\t-\tgetting id from cache')
		res.status(200).json({'payload' : map_of_uuid_to_url.find(x => x['url'] == url).id})
	}
	
	if(map_of_uuid_to_url.length == 0 || !map_of_uuid_to_url.some( x => x['url'] == url)){
		const id = uuid()
		map_of_uuid_to_url.push({id : id, url : url})
		res.status(200).json({'payload' : id})
	}

	
})

app.get('/shorten_url/:key', (req, res)=>{
	const id = req.params.key
	const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i // uuid regex
	if(!id){
		res.status(400).json({'errMsg': 'Expected uuid from get url but received none'})
	}
	if(!regex.test(id)){
		res.status(400).json({'errMsg': 'Expected uuid but received isn\'t'})
	}
	if(map_of_uuid_to_url.length == 0){
		res.status(404).json({'errMsg': 'You haven\'t insert the url to the record yet' })
	}
	if(!map_of_uuid_to_url.some( x => x['id'] == id)){
		console.log('[INFO]\t-\tgetting id from cache')
		res.status(404).json({'errMsg': 'Invalid uuid, please retry again' })
	}else{
		res.redirect(301, map_of_uuid_to_url.find(x => x['id'] == id).url)
	}
})

const isValidUrlStr= (s) => {
	try {
	  new URL(s);
	  return true;
	} catch (err) {
	  return false;
	}
};


module.exports = app