import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const parsed = new URL(process.env.DATABASE_URL);

const adapter = new PrismaPg({
    host: parsed.hostname,
    port: parseInt(parsed.port),
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.slice(1).split('?')[0],
    ssl: { rejectUnauthorized: false }
});

const prisma = new PrismaClient({ adapter });

// CREATE TASK
export async function createTask(req, res) {
    try {
        const { title, description, priority, dueDate } = req.body;
        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority || 'medium',
                dueDate: dueDate ? new Date(dueDate) : null,
                userId: req.userId
            }
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// GET ALL TASKS
export async function getTasks(req, res) {
    try {
        const { status, priority } = req.query;

        const where = { userId: req.userId };
        if (status) where.status = status;
        if (priority) where.priority = priority;

        const tasks = await prisma.task.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// GET SINGLE TASK
export async function getTask(req, res) {
    try {
        const task = await prisma.task.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!task) return res.status(404).json({ error: 'Task not found' });
        if (task.userId !== req.userId) return res.status(403).json({ error: 'Not authorized' });

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// UPDATE TASK
export async function updateTask(req, res) {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        const existing = await prisma.task.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!existing) return res.status(404).json({ error: 'Task not found' });
        if (existing.userId !== req.userId) return res.status(403).json({ error: 'Not authorized' });

        const task = await prisma.task.update({
            where: { id: parseInt(req.params.id) },
            data: {
                title: title || existing.title,
                description: description || existing.description,
                status: status || existing.status,
                priority: priority || existing.priority,
                dueDate: dueDate ? new Date(dueDate) : existing.dueDate
            }
        });
        res.json(task);
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: error.message });
    }
}

// DELETE TASK
export async function deleteTask(req, res) {
    try {
        const existing = await prisma.task.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!existing) return res.status(404).json({ error: 'Task not found' });
        if (existing.userId !== req.userId) return res.status(403).json({ error: 'Not authorized' });

        await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}