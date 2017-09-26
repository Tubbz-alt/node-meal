exports.options = {
	username: '12345',
	lm_password: new Buffer([ 249, 228, 175, 198, 91, 141, 168, 223, 148, 203, 241, 101, 239, 29, 159, 90 ]),
	nt_password: new Buffer([ 27, 172, 52, 93, 137, 162, 105, 90, 186, 74, 116, 114, 82, 11, 176, 165 ]),
};

if(require.main === module) {
	const httpntlm = require('httpntlm');
	const password = 'abc';
	console.dir(httpntlm.ntlm.create_LM_hashed_password(password));
	console.dir(httpntlm.ntlm.create_NT_hashed_password(password));
}
