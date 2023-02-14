const request = require('supertest');
const app = require('../src/index');


describe('User test suite', (token, id) => {
    it('tests signup users endpoint', async () => {
        const response = await request(app).post('/api/userAccounts').send({
            name: "Vlad The Impaler",
            email: "vladtheimpaler@gmail.com",
            password: "iamvladdracula" 
        })
        expect(response.statusCode).toBe(201)
        expect(response.body.userAccount).toHaveProperty('email')
        expect(response.body.userAccount).toHaveProperty('_id')
        expect(response.body.userAccount).toHaveProperty('tokens')
        expect(response.body.userAccount.tokens).toHaveLength(1)
        expect(response.body).toHaveProperty('token')
        id = response.body.userAccount._id
    })
    it('tests login user endpoint', async () => {
        const response = await request(app).post('/api/userAccounts/login').send({
            email: "vladtheimpaler@gmail.com",
            password: "iamvladdracula"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('user')
        expect(response.body.userAccount).toHaveProperty('tokens')
        expect(response.body.userAccount.tokens).toHaveLength(2)
        expect(response.body).toHaveProperty('token')
        token = response.body.token
        expect(response.body.userAccount.tokens).toHaveLength(2)
    })
    it ('tests get self user endpoint', async () => {
        const response = await request(app).get('/api/userAccounts/me').set('Authorization', 'Bearer '+token)
        expect(response.body).toHaveProperty('_id')
        expect(response.body._id).toBe(id)
    })
    it('tests delete user endpoint', async () => {
        const response = await request(app).delete('/api/userAccounts/me').set('Authorization', 'Bearer '+ token)
        expect(response.body).toHaveProperty('_id')
    })
})
