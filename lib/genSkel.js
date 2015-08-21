#! /usr/bin/env node
'use strict';

//Enables es6 syntax in genSkel.es.js file
require('babel/register')({ only: ['.es.js'] });
require('./genSkel.es');
