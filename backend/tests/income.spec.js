const request = require('supertest')
const app = require('../src/index')

describe('Income test suite', (token, id, _id, second_id) => {
    it('tests posting a new employment POST method', async () => {
        const res = await request(app).post('/api/userAccounts').send({
            name: "Vlad The Impaler",
            email: "vladtheimpaler@gmail.com",
            password: "iamvladdracula" 
        })
        token = res.body.userAccount.tokens[0].token
        id = res.body.userAccount._id
        const response = await request(app).post('/api/income').send({
            "income_type": "FT",
            "monthly_income": 30000,
            "start_date": "2002-05-17",
            "end_date": "2002-07-17",
            "company": "Hudson River Trading"
        }).set('Authorization', 'Bearer '+token)
        expect(response.body).toHaveProperty('income_type')
        expect(response.body).toHaveProperty('monthly_income')
        expect(response.body).toHaveProperty('start_date')
        expect(response.body).toHaveProperty('end_date')
        expect(response.body).toHaveProperty('company')
        expect(response.body).toHaveProperty('income_owner')
        expect(response.body.income_owner).toBe(id)
        _id = response.body._id 
    })
    it('tests all employments for a user GET endpoint', async () => {
        const res = await request(app).post('/api/income').send({
            "income_type": "PT",
            "monthly_income": 20000,
            "start_date": "2002-05-17",
            "end_date": "2002-07-17",
            "company": "Tesla Motors"
        }).set('Authorization', 'Bearer '+token)
        const response = await request(app).get('/api/income').set('Authorization', 'Bearer '+token)
        expect(response.body).toHaveLength(2)
        expect(response.body[1].company).toBe('Tesla Motors')
        second_id = response.body[1]._id 
    })
    it('tests getting a specific employment for a user GET endpoint', async () => {
        const response = await request(app).get('/api/income/'+_id).set('Authorization', 'Bearer '+token)
        expect(response.body.company).toBe('Hudson River Trading')
    })
    it('tests deleting a specific employment for a user DELETE endpoint', async () => {
        await request(app).delete('/api/income/'+_id).set('Authorization', 'Bearer '+token)
        const response = await request(app).get('/api/income').set('Authorization', 'Bearer '+token)
        expect(response.body[0].company).toBe('Tesla Motors')

        //cleanup
        await request(app).delete('/api/income/'+second_id).set('Authorization', 'Bearer '+token)
        await request(app).delete('/api/userAccounts/me').set('Authorization', 'Bearer '+token)
    })
})
