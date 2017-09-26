const httpntlm = require('httpntlm');
const ntlmAuth = require('./ntlmAuth.js').options;
const spasAuth = require('./spasAuth.js').options;
const isHoliday = require('./holidays.js').isHoliday;

const MEAL_DATE = daysAhead(0);

const commonFormData = {
	__EVENTARGUMENT: '',
	__LASTFOCUS: '',
	cmbTheDate: toDateString(MEAL_DATE),
	cmbDateOfActualOrder: toDateString(daysAhead(1)),
	cmbCodeOfActualOrder: 'M1:午餐',
	txtQtyOfActualOrder: 0
}

var COOKIE = undefined;

function summary(badgeID, response) {
	let lines = response.body.split('\r\n');
	for(let record of lines) {
		if(record.includes(badgeID)) {
			let row = [toDateString(MEAL_DATE), spasAuth.txtBadgeID];
			let nextPos = 0;
			let found = undefined;
			while(found = record.substr(nextPos).match(/[^\u0000-\u007F]+/)) {
				row.push(found[0]);
				nextPos += found[0].length + found['index'];
			}
			console.log(row);
		}
	}
}

function sendData(method, params) {
	return new Promise((resolve, reject) => {
		let toBePost = Object.assign(COOKIE ? {cookies: COOKIE} : {}, ntlmAuth, params);
		httpntlm[method](toBePost, (err, res) => {
			if(err) reject(err);
			resolve(res);
		});
	});
}

function submitMeal(mealTime, response) {
	let param = Object.assign({
		cmbMealCode: mealTime, 
		__EVENTTARGET: '',
		cmdSubmit: '本人订餐',
		cmbMealName: 'F1:米饭'
	} , viewStats(response.body), commonFormData);

	return sendData('post', {
		url: `http://cvppasip02/SPAS/Meal/Meal.aspx?d=${toDateString(MEAL_DATE)}`, 
		parameters: param
	});
}

function setMealTime(mealTime, response) {
	let param = Object.assign({
		cmbMealCode: mealTime, 
		__EVENTTARGET: 'cmbMealCode',
		cmbMealName: ''
	}, viewStats(response.body), commonFormData);

	return sendData('post', {
		url: `http://cvppasip02/SPAS/Meal/Meal.aspx`, 
		parameters: param
	});
}

function setMealDate(response) {
	return sendData('get', {
		url: `http://cvppasip02/SPAS/Meal/Meal.aspx?d=${toDateString(MEAL_DATE)}`
	});
}

function loginSPAS(response) {
	return sendData('post', {
		url: 'http://cvppasip02/SPAS/FormLeft.aspx', 
		parameters: Object.assign(viewStats(response.body), spasAuth)
	});
}

function openSPAS() {
	return sendData('get', {
		url: 'http://cvppasip02/SPAS/FormLeft.aspx'
	});
}

function viewStats(html) {
	let view = {};
	let lines = html.split('\r\n');
	for (let line of lines) {
		if (line.includes('__VIEWSTATE') 
			|| line.includes('__VIEWSTATEGENERATOR')
				|| line.includes('__EVENTVALIDATION')) {
					let name = line.match(/id="(\w+)"/)[1]
					let value = line.match(/value="([^\"]+)"/)[1]
					view[name] = value;
				}
	}
	return view;
}

function daysAhead(numOfDay) {
	let date = new Date();
	date.setDate(date.getDate()+numOfDay); 
	return date;
}

function toDateString(theDate) {
	return theDate.toISOString().slice(0,10);
}

async function myMeal(meal, response) {
	let fwd = await setMealDate(response);
	fwd = await setMealTime(meal, fwd);
	fwd = await submitMeal(meal, fwd);
	return fwd;
}

async function book_n_disp() {
	console.log(new Date());
	try {
		let response = await loginSPAS(await openSPAS());
		COOKIE = response.cookies;
		response = await myMeal('M1:午餐', response);
		response = await myMeal('M2:晚餐', response);
		summary(spasAuth.txtBadgeID, response);
	} catch(err) {
		new Error(err);
	}
}

//////////////////////////////////////////////////////
if(isHoliday(MEAL_DATE)) {
	console.log(`${toDateString(MEAL_DATE)} is skipped`);
	process.exit();
}

book_n_disp();

