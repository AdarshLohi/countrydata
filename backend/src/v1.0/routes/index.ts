import { Router } from 'express';
const router: Router = require('express').Router();
import country from './country.routes';

router.use('/country', country);

export default router;
