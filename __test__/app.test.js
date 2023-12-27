// __tests__/app.test.js

const request = require('supertest');
const app = require('../app');

jest.mock('../utils/fixedIncomeAdd', () => jest.fn());

describe('Express App', () => {
    it('responds with 200 for GET /test', async () => {
        const response = await request(app).get('/test');
        expect(response.status).toBe(200);
    });

    it('responds with 404 for unknown routes', async () => {
        const response = await request(app).get('/unknown');
        expect(response.status).toBe(404);
    });

    // Add more tests for other routes and middleware if needed
});
