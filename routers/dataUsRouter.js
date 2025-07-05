import { Router } from 'express';
import { deactivateUser,getUserData,updateUserNameOrSurname} from '../controller/userPerfController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/user', authMiddleware, getUserData);
router.put('/user', authMiddleware, updateUserNameOrSurname);
router.put('/userDelete', authMiddleware, deactivateUser);

export default router;