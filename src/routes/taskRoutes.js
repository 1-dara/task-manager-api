import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/', authenticateToken, createTask);
router.get('/', authenticateToken, getTasks);
router.get('/:id', authenticateToken, getTask);
router.put('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);

export default router;