import { Router } from 'express';
import { country } from '../controllers/country.controller';

const router: Router = Router();

router.get('/', country);

export default router;
