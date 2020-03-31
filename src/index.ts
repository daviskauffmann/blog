import sourceMapSupport from 'source-map-support';
import dotenv from 'dotenv';

sourceMapSupport.install();
dotenv.config();

import './server';
