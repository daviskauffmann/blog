import dotenv from 'dotenv';
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install();
dotenv.config();

console.log(`Application is in ${process.env.NODE_ENV} mode`);

import './server';
