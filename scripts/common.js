let __Today = new Date();
let __NewNo = __Today.getFullYear() + __Today.getMonth() + __Today.getDate() + __Today.getHours() + __Today.getMinutes() + __Today.getSeconds() + __Today.getMilliseconds();

$LAB.setOptions({AlwaysPreserveOrder:true})
	.script("/scripts/jquery-3.2.1.min.js")
	.script([
		"/jqUI/jquery-ui-1.10.4.custom.min.js",
		"/scripts/jquery.ui.touch-punch.min.js",
		"/scripts/jquery.form.js"
	])
	.script(function() {
		return [
			"/scripts/__Array.js?_no=" + __NewNo,
			"/scripts/__CSS.js?_no=" + __NewNo,
			"/scripts/__Date.js?_no=" + __NewNo,
			"/scripts/__Default.js?_no=" + __NewNo,
			"/scripts/__Storage.js?_no=" + __NewNo,
			"/scripts/__String.js?_no=" + __NewNo,
			"/scripts/__PageLib.js?_no=" + __NewNo,
			"/scripts/__PopupLib.js?_no=" + __NewNo,
			"/scripts/__MobileBridge.js?_no=" + __NewNo
		];
	})
	.script(function() {
		return [
			"/scripts/calendarLib/calendarLib.js?_no=" + __NewNo,
			"/scripts/socket.io.js?_no=" + __NewNo,
			"/sweetalert/sweetalert-dev.js?_no=" + __NewNo
		];
	})
	.script("/scripts/CommonFunc.js?_no=" + __NewNo)
	.script(function() {
		const loadScriptsList = [];

		if (typeof(pageLoaderOption) == "object") {
			if (pageLoaderOption.pageLogic) {
				const typeOf = typeof (pageLoaderOption.pageLogic);

				if (typeOf === "string") {
					loadScriptsList.push(pageLoaderOption.pageLogic + "?_no" + __NewNo);
				}
				else if (typeOf === "object") {
					for (let i = 0; i < pageLoaderOption.pageLogic.length; i++) {
						loadScriptsList.push(pageLoaderOption.pageLogic[i] + "?_no=" + __NewNo);
					}
				}
			}
		}

		return loadScriptsList;
	})
	.wait(function() {
		Application_Init();
	});
