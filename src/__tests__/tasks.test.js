import request from 'supertest';
import app from '../app.js';

describe('Task Endpoints', () => {
    let token;
    let taskId;

    beforeAll(async () => {
        const email = `tasktest${Date.now()}@example.com`;
        await request(app)
            .post('/api/auth/register')
            .send({ email, password: 'password123', name: 'Task Tester' });
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email, password: 'password123' });
        token = res.body.access_token;
    });

    test('POST /api/tasks — should create a task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Task',
                description: 'Test description',
                priority: 'high',
                dueDate: '2026-12-31'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Task');
        taskId = res.body.id;
    });

    test('GET /api/tasks — should return all tasks', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /api/tasks/:id — should return single task', async () => {
        const res = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(taskId);
    });

    test('PUT /api/tasks/:id — should update task status', async () => {
        const res = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'in-progress' });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('in-progress');
    });

    test('GET /api/tasks — should fail without token', async () => {
        const res = await request(app)
            .get('/api/tasks');
        expect(res.statusCode).toBe(401);
    });

    test('DELETE /api/tasks/:id — should delete task', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Task deleted successfully');
    });
});
