exports.options = {
	username: Buffer.from([ '1', '2', '3', '4', '5' ]).toString(),
	lm_password: new Buffer([ 52, 56, 233, 24, 28, 173, 46, 60, 217, 35, 4, 11, 223, 205, 217, 151 ]),
	nt_password: new Buffer([ 51, 199, 4, 1, 221, 8, 159, 57, 28, 2, 14, 246, 73, 10, 92, 91 ]),
};

//uncomment to generate new passwd	const httpntlm = require('httpntlm');
//uncomment to generate new passwd	const password = 'abc';
//uncomment to generate new passwd	let hash = (str, cb) => {
//uncomment to generate new passwd		let arr = [];
//uncomment to generate new passwd		for(let i of cb(str)) {
//uncomment to generate new passwd			arr.push(i);
//uncomment to generate new passwd		}
//uncomment to generate new passwd		return arr;	
//uncomment to generate new passwd	}
//uncomment to generate new passwd	console.log(`LM: ${hash(password, httpntlm.ntlm.create_LM_hashed_password)}`);
//uncomment to generate new passwd	console.log(`NT: ${hash(password, httpntlm.ntlm.create_NT_hashed_password)}`);
