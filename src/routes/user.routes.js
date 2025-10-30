import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';
import {upload} from '../middlewares/fileUpload.middleware.js';
const router = Router();

router.post('/register', registerUser);
upload.fields([
    {
        name: 'avatar', maxCount: 1
    },
    {
        name: 'coverImage', maxCount: 5
    }
])
export default router;