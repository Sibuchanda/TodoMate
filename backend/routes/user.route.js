import express from 'express'
import {signup, login, logout, getUserDetails} from '../controler/user.controler.js';
import { authenticate } from '../middleware/authorize.js';

const router = express.Router();


router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",logout);
router.get("/details",authenticate,getUserDetails);

export default router;