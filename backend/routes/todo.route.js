import express from 'express'
import {createTodo, getTodos, UpdateTodo, DeleteTodo, editTodo} from '../controler/todo.controler.js';
import { authenticate } from '../middleware/authorize.js';

const router = express.Router();


router.post("/create", authenticate, createTodo);
router.get("/fetch", authenticate, getTodos);
router.put("/update/:id", authenticate, UpdateTodo);
router.delete("/delete/:id", authenticate, DeleteTodo);
router.put("/edit/:id", authenticate, editTodo);

export default router;