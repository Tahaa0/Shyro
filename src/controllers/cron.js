var cron = require('node-cron');
const Invoice = require('./invoice');

exports.cronSetup = function(){
	cron.schedule('* */6 * * *', () => {
		console.log('Verifying subscriptions...');
	  	Invoice.verifySubscriptions();
	});
}