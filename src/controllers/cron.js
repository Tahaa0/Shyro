var cron = require('node-cron');
const Invoice = require('./invoice');

exports.cronSetup = function(){
	cron.schedule('0 0,6,12,18 * * *', () => {
		console.log('Verifying subscriptions...');
	  	Invoice.verifySubscriptions();
	});
}