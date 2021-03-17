/*
 * Storage
 */
function setSessionStorage(keyname, keyvalue) {	
	sessionStorage.setItem(keyname, keyvalue);
}

function getSessionStorage(keyname) {
	var keydata = sessionStorage.getItem(keyname);
	if (keydata === null || typeof(keydata) == "undefined") keydata = "";
	return keydata;
}

function removeSessionStorage(keyname) {
	sessionStorage.removeItem(keyname);
}

function clearSessionStorage() {
	sessionStorage.clear();
}

function setLocalStorage(keyname, keyvalue) {
   window.localStorage[keyname] = keyvalue;
}

function getLocalStorage(keyname) {	
	var keydata = window.localStorage[keyname];
	if (keydata === null || typeof(keydata) == "undefined") keydata = "";
	return keydata;
}

function removeLocalStorage(keyname) {
	window.localStorage.removeItem(keyname);
}

function clearLocalStorage(keyname) {
	window.localStorage.clear();
}

/*
 * Cookies
 */
var Cookies = {
	Set: function(name, value, day) {
		var expire = new Date();
		expire.setDate(expire.getDate() + day);
		cookies = name + "=" + escape(value) + "; path=/ ";
		if(typeof day != "undefined") cookies += ";expires=" + expire.toGMTString() + ";";
		document.cookie = cookies;
	},
	
	Get: function(name) {
		name = name + "=";
		var cookieData = document.cookie;
		var start = cookieData.indexOf(name);
		var value = "";

        if (start != -1) {
             start += name.length;
             var end = cookieData.indexOf(";", start);
             if(end == -1)end = cookieData.length;
             value = cookieData.substring(start, end);
        }

        return unescape(value);
	}
};