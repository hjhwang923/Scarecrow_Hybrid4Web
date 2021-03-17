/**
 * Array.indexOf
 * 배열내에 속한 객체의 인덱스 가져오기
 */
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(searchElement) {
		"use strict";

		if (this === void 0 || this === null) throw new TypeError();
		const t = Object(this);
		const len = t.length >>> 0;
		if (len === 0) return -1;
		let n = 0;

		if (arguments.length > 0) {
			n = Number(arguments[1]);
			
			if (n !== n) n = 0;
			else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
		}

		if (n >= len) return -1;

		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);

		for (; k < len; k++) {
			if (k in t && t[k] === searchElement) return k;
		}

		return -1;
	};
}
