/**
 * Created by sridharrajs.
 */

'use strict';

let _ = require('lodash');

let jwtController = require('../controllers/jwt-controller');

const NON_AUTH_URLS = [
	'/api/users',
	'/api/users/login',
	'/api/join'
];

function isNonAuthEndPointAccessURL(url) {
	return _.contains(NON_AUTH_URLS, url);
}

function authenticate(req, res, next) {
	let token = req.headers.authorization;
	let isNonAuthURL = isNonAuthEndPointAccessURL(req.url);

	if (isNonAuthURL) {
		return next();
	}

	let userId = jwtController.decodeForUid(token);
	if (!userId) {
		return res.status(401).send({
			err: 'please login'
		});
	}

	req.uid = userId;
	next();
}

module.exports = authenticate;
