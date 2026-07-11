import request from 'supertest';
import app from '../app.js';

describe('Auth Endpoints', () => {
    const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User'
    };

    let token;

    test('POST /api/auth/register — should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe(testUser.email);
    });

    test('POST /api/auth/register — should fail with duplicate email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('POST /api/auth/login — should login and return token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('access_token');
        token = res.body.access_token;
    });

    test('POST /api/auth/login — should fail with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: 'wrongpassword' });
        expect(res.statusCode).toBe(401);
    });
});
