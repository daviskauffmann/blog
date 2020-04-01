import sourceMapSupport from 'source-map-support';
import dotenv from 'dotenv';

sourceMapSupport.install();
dotenv.config();

console.log(`Application is in ${process.env.NODE_ENV} mode`);

import './server';
