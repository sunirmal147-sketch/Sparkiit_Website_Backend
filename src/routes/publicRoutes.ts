import express from 'express';
import { getHomepageData } from '../controllers/homepageController';

const router = express.Router();

router.get('/homepage', getHomepageData);

export default router;
