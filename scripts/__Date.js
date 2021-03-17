/**
 * 두 날짜 차이 비교
 * @type {{Month: (function(*, *): number), Second: (function(*, *): number), Minute: (function(*, *): number), Year: (function(*, *): number), Weeks: (function(*, *): number), Day: (function(*, *): number)}}
 */
const DateDiff = {
	Second: function (d1, d2) {
		const t2 = d2.getTime();
		const t1 = d1.getTime();
		return Math.floor((t2 - t1) / 1000);
	},

	Minute: function (d1, d2) {
		const t2 = d2.getTime();
		const t1 = d1.getTime();
		return Math.floor((t2 - t1) / 1000 / 60);
	},

	Day: function (d1, d2) {
		const t2 = d2.getTime();
		const t1 = d1.getTime();
		return Math.floor((t2 - t1) / (24 * 3600 * 1000));
	},

	Weeks: function (d1, d2) {
		const t2 = d2.getTime();
		const t1 = d1.getTime();
		return Math.floor((t2 - t1) / (24 * 3600 * 1000 * 7));
	},

	Month: function (d1, d2) {
		const d1Y = d1.getFullYear();
		const d2Y = d2.getFullYear();
		const d1M = d1.getMonth();
		const d2M = d2.getMonth();
		return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
	},

	Year: function (d1, d2) {
		return d2.getFullYear() - d1.getFullYear();
	}
};

/**
 * 문자열을 날짜형식으로 변경
 * @param s
 * @returns {null|Date}
 * @constructor
 */
function Str2Date(s) {
	let year = 0, month = 0, day = 0;
	let hour = 0, minute = 0, second = 0;
	let arrDay = null;

	if (s.indexOf(" ") > -1) {
		const items = s.split(" ");

		if (!s.isDate()) {
			return null;
		}

		arrDay = items[0].split("-");
		year = parseInt(arrDay[0]);
		month = parseInt(arrDay[1].replace(/^0(\d)/g,"$1"));
		day = parseInt(arrDay[2].replace(/^0(\d)/g,"$1"));

		if (items[1].split(":").length === 3) {
			var arrTime = items[1].split(":");
			hour = parseInt(arrTime[0]);
			minute = parseInt(arrTime[1]);
			second = parseInt(arrTime[2]);
		}
		else {
			return null;
		}
	}
	else {
		if (!s.isDate()) {
			return null;
		}

		arrDay = s.split("-");
		year = parseInt(arrDay[0]);
		month = parseInt(arrDay[1].replace(/^0(\d)/g,"$1"));
		day = parseInt(arrDay[2].replace(/^0(\d)/g,"$1"));
	}

	return new Date(year, month - 1, day, hour, minute, second);
}

/**
 * 날짜를 yyyy-MM-dd 형식으로 출력
 * @param d
 * @returns {string}
 * @constructor
 */
function PrtDate(d) {
	let prtString = d.getFullYear() + "-";
	const month = d.getMonth() + 1;
	const day = d.getDate();

	if (month < 10)
		prtString += "0" + month;
	else
		prtString += month;

	prtString += "-";

	if (day < 10)
		prtString += "0" + day;
	else
		prtString += day;

	return prtString;
}

/**
 * 날짜를 yyyyMMdd 형식으로 출력
 * @param d
 * @returns
 */
function PrtDateNoDash(d) {
	let prtString = String(d.getFullYear());
	const month = d.getMonth() + 1;
	const day = d.getDate();

	if (month < 10)
		prtString += "0" + month;
	else
		prtString += "" + month;

	if (day < 10)
		prtString += "0" + day;
	else
		prtString += "" + day;

	return prtString;
}

/**
 * 날짜를 hhmmss 형식으로 출력
 * @param {*} d 
 */
function PrtTimeNoDash(d) {
	let prtString = "";
	const hours = d.getHours();
	const minutes = d.getMinutes();
	const seconds = d.getSeconds();

	if (hours < 10)
		prtString += "0" + hours;
	else
		prtString += "" + hours;

	if (minutes < 10)
		prtString += "0" + minutes;
	else
		prtString += "" + minutes;

	if (seconds < 10)
		prtString += "0" + seconds;
	else
		prtString += "" + seconds;

	return prtString;
}

/**
 * 날짜를 yyyyMMddhhmmssSSS 형식으로 출력
 * @param d
 * @returns {string}
 * @constructor
 */
function PrtDateTimeNoDash(d) {
	let prtString = String(d.getFullYear());
	const month = d.getMonth() + 1;
	const day = d.getDate();
	const hours = d.getHours();
	const minutes = d.getMinutes();
	const seconds = d.getSeconds();
	const mseconds = d.getMilliseconds();

	if (month < 10)
		prtString += "0" + month;
	else
		prtString += "" + month;

	if (day < 10)
		prtString += "0" + day;
	else
		prtString += "" + day;

	if (hours < 10)
		prtString += "0" + hours;
	else
		prtString += "" + hours;

	if (minutes < 10)
		prtString += "0" + minutes;
	else
		prtString += "" + minutes;

	if (seconds < 10)
		prtString += "0" + seconds;
	else
		prtString += "" + seconds;

	prtString += mseconds;

	return prtString;
}

/**
 * 날짜를 yyyy-MM-dd hh:mm:ss 형식으로 출력
 * @param d
 * @returns {string}
 * @constructor
 */
function PrtDateTime(d) {
	let prtString = d.getFullYear() + "-";
	const month = d.getMonth() + 1;
	const day = d.getDate();
	const hours = d.getHours();
	const minutes = d.getMinutes();
	const seconds = d.getSeconds();

	if (month < 10)
		prtString += "0" + month;
	else
		prtString += month;

	prtString += "-";

	if (day < 10)
		prtString += "0" + day;
	else
		prtString += day;

	if (hours < 10)
		prtString += " 0" + hours;
	else
		prtString += " " + hours;

	if (minutes < 10)
		prtString += ":0" + minutes;
	else
		prtString += ":" + minutes;

	if (seconds < 10)
		prtString += ":0" + seconds;
	else
		prtString += ":" + seconds;

	return prtString;
}

/**
 * 날짜를 hh:mm:ss 형식으로 출력
 * @param d
 * @returns {string}
 * @constructor
 */
function PrtTime(d) {
	let prtString = "";
	const hours = d.getHours();
	const minutes = d.getMinutes();
	const seconds = d.getSeconds();

	if (hours < 10)
		prtString = " 0" + hours;
	else
		prtString = "" + hours;

	if (minutes < 10)
		prtString += ":0" + minutes;
	else
		prtString += ":" + minutes;

	if (seconds < 10)
		prtString += ":0" + seconds;
	else
		prtString += ":" + seconds;

	return prtString;
}

/**
 * 해당월의 마지막일을 가져오기
 * @param y
 * @param m
 * @returns {number}
 * @constructor
 */
function GetMonthLastDay(y, m) {
	if (y + "-" + m + "1".isDate() === false) return 0;
	y = parseInt(y);
	m = parseInt(m);

	const monthLastDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //각 달별 마지막날 저장
	let currentLastDay = monthLastDay[m - 1];

	// 윤년계산
    if (m === 2) {
        if ((y % 400) === 0)
        	currentLastDay = 29;
        else if (((y % 4) === 0) && ((y % 100) > 0))
        	currentLastDay = 29;
    }
    
    return currentLastDay;
}

/**
 * 초단위로 시간단위 환산
 * @param secs
 * @returns {{h:시, m:분, s:초, d:일, dh:일기준 시}}
 */
function secondsToTime(secs) {
	const hours = Math.floor(secs / (60 * 60));

	const divisor4minutes = secs % (60 * 60);
	let minutes = Math.floor(divisor4minutes / 60);
	if (minutes < 10) minutes = "0" + minutes;

	const divisor4seconds = divisor4minutes % 60;
	let seconds = Math.floor(divisor4seconds);
	if (seconds < 10) seconds = "0" + seconds;

	const days = Math.floor(hours / 24);
	let daysHour = hours % 24;
	if (daysHour < 10) daysHour = "0" + daysHour;

	const obj = {
		h: hours,
		m: minutes,
		s: seconds,
		d: days,
		dh: daysHour
	};

	return obj;
}