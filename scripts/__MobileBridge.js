/**
 * iOS 확인
 */
function isIOS() {
	const userAgent = navigator.userAgent;
	return userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1;
}

/**
 * 외부 브라우저여부 확인
 */
function isBrowser() {
	return (typeof (window.conn) == "undefined") && isIOS() === false && typeof (webkit) == "undefined";
}

/**
 * 로딩창 표시
 * @param message
 */
function __ShowLoading(message) {
	if (typeof(window.conn) != "undefined") {
		try {
			window.conn.showLoading(message);
		}
		catch (e) {
			console.log(e);
		}
	}
	else if (isIOS() && typeof(webkit) != "undefined") {
		webkit.messageHandlers.iOS.postMessage("showLoading?" + message);
	}
	else {
		_ShowWebLoading(message);
	}
}

/**
 * 로딩창 숨김
 * @param {*} callback
 */
let __LoadingClose_Callback = null;

function __HideLoading(callback) {
	if (typeof(callback)  == "object" || typeof(callback) == "function") {
		__LoadingClose_Callback = callback;
	}
	else {
		__LoadingClose_Callback = null;
	}

	if (typeof(window.conn) != "undefined") {
		try {
			window.conn.hideLoading();
		}
		catch (e) {
			console.log(e);
		}
	}
	else if (isIOS() && typeof(webkit) != "undefined") {
		webkit.messageHandlers.iOS.postMessage("hideLoading");
	}
	else {
		_HideWebLoading(callback);
	}
}

function __HideLoading_Callback() {
	if (__LoadingClose_Callback !== null) {
		__LoadingClose_Callback();
	}
}

/**
 * 카메라 호출
 */
let __Camera_Callback = null;

function __GoCamera(fileNM, dirNo, callback) {
	if (typeof(callback)  == "object" || typeof(callback) == "function") {
		__Camera_Callback = callback;
	}
	else {
		__Camera_Callback = null;
	}

	if (window.conn) {
		window.conn.goCamera(fileNM, dirNo);
	}
	else if (isIOS() && typeof(webkit) != "undefined") {
		webkit.messageHandlers.iOS.postMessage("goCamera?" + fileNM + "@@" + dirNo);
	}
	else {
		__GoCamera_Callback();
	}
}

function __GoCamera_Callback() {
	if (__Camera_Callback !== null) {
		__Camera_Callback();
	}
}

/**
 * 전화 연결
 * @param {*} telNo
 */
function __GoDial(telNo) {
	if (typeof(telNo) == "undefined") return;
	if (telNo.Trim().length === 0) return;

	if (window.conn) {
		window.conn.goDial(telNo);
	}
	else if (isIOS() && typeof(webkit) != "undefined") {
		webkit.messageHandlers.iOS.postMessage("goDial?" + telNo);
	}
}

/**
 * Get Unique Device ID
 */
let __DEVICE_ID_Callback = null;

function __GetDeviceID(callback) {
	if (typeof(callback)  == "object" || typeof(callback) == "function") {
		__DEVICE_ID_Callback = callback;
	}
	else {
		__DEVICE_ID_Callback = null;
	}

	if (window.conn) {
		window.conn.getDeviceID();
	}
	else if (isIOS() && typeof(webkit) != "undefined") {
		webkit.messageHandlers.iOS.postMessage("getDeviceID");
	}
}

function __GetDeviceID_Callback(deviceType, deviceToken) {
	if (__DEVICE_ID_Callback !== null) {
		__DEVICE_ID_Callback(deviceType, deviceToken);
	}
}

/**
 * File View
 * @param {*} filePath
 */
function __File_View(filePath) {
	if (typeof(window.conn) != "undefined") {
		try {
			window.conn.callFilePath(filePath);
		}
		catch (e) {
			console.log(e);
		}
	}
	else if (isIOS() && typeof(webkit) != "undefined") {
		webkit.messageHandlers.iOS.postMessage("fileView?" + filePath);
	}
	else {
		location.href = filePath;
	}
}

/**
 * Calendar Open
 * @param {*} inputID
 */
let __CalendarCallback = null;

function __ShowCalendar(inputID, callback) {

	if(typeof(callback) == "undefined") {
		__CalendarCallback = null;
	}
	else if (typeof(callback) != "object" || typeof(callback) == "function") {
		__CalendarCallback = callback;
	}
	else {
		__CalendarCallback = null;
	}

	if (typeof(window.conn) != "undefined") {
		try {
			let currentDateStr = $("#" + inputID).val();
			if (typeof(currentDateStr) !== "string" || currentDateStr.isDate() === false) currentDateStr = PrtDate(new Date());
			window.conn.showCalendar(inputID, currentDateStr);
		}
		catch (e) {
			console.log(e);
		}
	}
	else if (isIOS() && typeof(webkit) != "undefined") {
		let initDate = "";
		const $target = $("#" + inputID);

		if ($target.length > 0) {
			initDate = $target.val();
		}

		webkit.messageHandlers.iOS.postMessage("showCalendar?" + inputID + "@@" + initDate);
	}
	else {
		CalendarLib.open(document.getElementById(inputID), inputID, '', '', '', function (yyyy, mm, dd) {
			 __Calendar_Callback(yyyy, mm, dd);
		 });
	}
}

function __Calendar_Callback(yyyy, mm, dd) {
	if (__CalendarCallback !== null) {
		__CalendarCallback(yyyy, mm, dd);
	}
}

/**
 * 내위치 확인
 * @param {*} callback
 */
let __MyLocationCallback = null;

function __GetMyLocation(callback) {
	if (typeof(callback) != "object" || typeof(callback) == "function") {
		__MyLocationCallback = callback;
	}
	else {
		__MyLocationCallback = null;
	}

	if (window.conn) {
		window.conn.getMyLocation();
	}
	else if (isIOS() && typeof(webkit) != "undefined") {
		webkit.messageHandlers.iOS.postMessage("getMyLocation");
	}
	else {
		if (__MyLocationCallback !== null) {
			__MyLocationCallback("0@@0");
		}
	}
}

function __MyLocation_Callback(rtn) {
	if (__MyLocationCallback !== null) {
		__MyLocationCallback(rtn);
	}
}

/**
 * Device Token 가져오기
 * @param {*} callback
 */
const __DeviceTokenCallback = null;

function __GetDeviceToken(callback) {
	if (window.conn) {
		window.conn.getDeviceToken();
	}
	else if (isIOS() && typeof(webkit) != "undefined") {
		webkit.messageHandlers.iOS.postMessage("getDeviceToken");
	}
	else {
		if (__DeviceTokenCallback !== null) {
			__DeviceTokenCallback("");
		}
	}
}

function __DeviceToken_Callback(rtn) {
	if (__DeviceTokenCallback !== null) {
		__DeviceTokenCallback(rtn);
	}
}

/**
 * 외부 브라우저 호출
 * @param {*} pageURL
 */
function __OpenBrowser(pageURL) {
	if (window.conn) {
		window.conn.goUrlParser(pageURL);
	}
	else if (isIOS() && typeof(webkit) != "undefined") {
		webkit.messageHandlers.iOS.postMessage("openBrowser?" + pageURL);
	}
	else {
		top.location.href = pageURL;
	}
}

/**
 * Clear Badge Number (Only iOS)
 */
function __ClearBadgeNumber() {
	if (isIOS() && typeof(webkit) != "undefined") {
		webkit.messageHandlers.iOS.postMessage("clearBadgeNumber");
	}
}

/**
 * Android BackKey Press Event
 */
function __AndroidBackKeyPress() {
	if (typeof(PagePanel) == "undefined") {
		try {
			window.conn.callFinish();
		}
		catch (e) {
			_ShowError(e);
		}
	}
	else {
		const currentMenuIndex = PagePanel.ViewIndex();

		if (currentMenuIndex > 1) {
			const $currentPanel = PagePanel.ViewPanel();

			if ($currentPanel != null) {
				if (typeof($currentPanel.data("pageFunc")) == "object" || typeof($currentPanel.data("pageFunc")) == "function") {
					if (typeof($currentPanel.data("pageFunc").popup) == "object") {
						if ($currentPanel.data("pageFunc").popup.isOpen()) {
							$currentPanel.data("pageFunc").popup.Close();
						}
						else {
							PagePanel.Back();
						}
					}
					else {
						PagePanel.Back();
					}
				}
				else {
					PagePanel.Back();
				}
			}
			else {
				PagePanel.Back();
			}
		}
		else {
			// 활성화된 패널이 하나인 경우에는 프로그램 종료
			try {
				window.conn.callFinish();
			}
			catch (e) {
				_ShowError(e);
			}
		}
	}
}

/**
 * Get App Version ID
 */
let __APP_VERSION_Callback = null;

function __GetAppVersion(callback) {
	if (typeof(callback)  == "object" || typeof(callback) == "function") {
		__APP_VERSION_Callback = callback;
	}
	else {
		__APP_VERSION_Callback = null;
	}

	if (window.conn) {
		window.conn.getAppVersion();
	}
	else if (isIOS() && typeof(webkit) != "undefined") {
		webkit.messageHandlers.iOS.postMessage("getAppVersion");
	}
}

function __GetAppVersion_Callback(deviceType, appVersion) {
	if (__APP_VERSION_Callback !== null) {
		__APP_VERSION_Callback(deviceType, appVersion);
	}
}