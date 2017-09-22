const holidays = [
	'2017-3-27',
];

function isWeekend(theDate) {
	return theDate.getDay() === 6 || theDate.getDay() === 0;
}

exports.isHoliday = (theDate) => {
	return isWeekend(theDate) 
		|| holidays.includes(theDate.toISOString().slice(0,10));
};
