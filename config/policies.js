module.exports.policies = {
	'*': ['appcontroller', 'isAuthenticated'],
	UserController: {
		login: true
	}
};




/*
// Here's an example of adding some policies to a controller
RabbitController: {

	// Apply the `false` policy as the default for all of RabbitController's actions
	// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
	'*': false,

	// For the action `nurture`, apply the 'isRabbitMother' policy 
	// (this overrides `false` above)
	nurture	: 'isRabbitMother',

	// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
	// before letting any users feed our rabbits
	feed : ['isNiceToAnimals', 'hasRabbitFood']
}
*/