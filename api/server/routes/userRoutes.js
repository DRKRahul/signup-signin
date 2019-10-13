import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.addUser);
router.get('/verify', userController.verifyUser);

export default router;