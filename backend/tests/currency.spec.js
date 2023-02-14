const request = require('supertest')
const app = require('../src/index')

describe('Income test suite', (token, id, _id, second_id) => {
    it('tests posting a new currency pair POST method', async () => {
        const res = await request(app).post('/api/users').send({
            name: "Vlad The Impaler",
            email: "vladtheimpaler@gmail.com",
            password: "iamvladdracula" 
        })
        token = res.body.user.tokens[0].token
        id = res.body.user._id
        const response = await request(app).post('/api/currencies').send({
            "currency_from": "SGD",
            "currency_to": "USD"
        }).set('Authorization', 'Bearer '+token)
        expect(response.body).toHaveProperty('currency_from')
        expect(response.body).toHaveProperty('currency_to')
        expect(response.body.currency_owner).toBe(id)
        _id = response.body._id 
    })
    it('tests getting all currency pairs tracked by user', async () => {
        const res = await request(app).post('/api/currencies').send({
            "currency_from": "GBP",
            "currency_to": "EUR"
        }).set('Authorization', 'Bearer '+token)
        const response = await request(app).get('/api/currencies').set('Authorization', 'Bearer '+token)
        expect(response.body).toHaveLength(2)
        expect(response.body[1].currency_from).toBe('GBP')
        second_id = response.body[1]._id 
    })
    it('tests getting a specific currency pair for a user GET endpoint', async () => {
        const response = await request(app).get('/api/currencies/'+_id).set('Authorization', 'Bearer '+token)
        expect(response.body.currency_from).toBe('SGD')
    })
    it('tests deleting a specific currency pair for a user DELETE endpoint', async () => {
        await request(app).delete('/api/currencies/'+_id).set('Authorization', 'Bearer '+token)
        const response = await request(app).get('/api/currencies').set('Authorization', 'Bearer '+token)
        expect(response.body[0].currency_from).toBe('GBP')

        //cleanup
        await request(app).delete('/api/currencies/'+second_id).set('Authorization', 'Bearer '+token)
        await request(app).delete('/api/users/me').set('Authorization', 'Bearer '+token)
    })
})