import express from 'express';
import { getPrivateRoute } from '../controllers/private.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

router.route("/").get(authorize, getPrivateRoute);


export {router as PrivateRouter}