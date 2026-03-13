import express from 'express';
import { getHomepageData } from '../controllers/homepageController';
import { validateCertificate } from '../controllers/certificateController';

const router = express.Router();

router.get('/homepage', getHomepageData);
router.get('/validate-certificate', validateCertificate);

export default router;
