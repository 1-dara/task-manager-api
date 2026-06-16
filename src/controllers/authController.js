import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
// REGISTER
export async function register(req, res) {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name }
        });

        res.status(201).json({
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// LOGIN
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ access_token: token, token_type: 'bearer' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}