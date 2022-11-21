const request = require('supertest')
const app = require('../src/app')

describe('shorten url api test', ()=>{
	it('should throw error when the uuid is not initialized', async() => {
		const res = await request(app).get('/shorten_url/9fefc1f5-68d2-4025-b68d-467513cdf48c')
		expect(res.statusCode).toEqual(404)
		expect(res.body).toHaveProperty('errMsg')
		expect(res.body.errMsg).toBe('You haven\'t insert the url to the record yet')
	})

	it('should create new uuid as shorten url', async() => {
		const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i // uuid regex
		const res = await request(app).post('/shorten_url').send({
			"url" : "http://google.com"
		})
		expect(res.statusCode).toEqual(200)
		expect(res.body).toHaveProperty('payload')
		expect(regex.test(res.body.payload)).toBe(true)
	})

	it('should create new uuid as shorten url and redirect the user when the uuid is valid', async() => {
		const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i // uuid regex
		let res = await request(app).post('/shorten_url').send({
			"url" : "http://google.com"
		})
		expect(res.statusCode).toEqual(200)
		expect(res.body).toHaveProperty('payload')
		expect(regex.test(res.body.payload)).toBe(true)
		res = await request(app).get('/shorten_url/' + res.body.payload)
		expect(res.status).toEqual(301)
	})

	it('should throw error if the uuid that pass in is not in data store', async() => {
		const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i // uuid regex
		let res = await request(app).post('/shorten_url').send({
			"url" : "http://google.com"
		})
		expect(res.statusCode).toEqual(200)
		expect(res.body).toHaveProperty('payload')
		expect(regex.test(res.body.payload)).toBe(true)
		res = await request(app).get('/shorten_url/9fefc1f5-68d2-4025-b68d-467513cdf48c')
		expect(res.status).toEqual(404)
		expect(res.body).toHaveProperty('errMsg')
		expect(res.body.errMsg).toBe('Invalid uuid, please retry again')
	})


	it('should throw error when the url is not valid', async() => {
		const res = await request(app).post('/shorten_url').send({
			"url" : "www.google.com"
		})
		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errMsg')
		expect(res.body.errMsg).toBe('Expected an url but received isn\'t i.e. http://google.com, https://google.com')
	})

	it('should throw error when the post body is empty', async() => {
		const res = await request(app).post('/shorten_url').send({
			
		})
		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errMsg')
		expect(res.body.errMsg).toBe('Expected body of url but received none')
	})
})