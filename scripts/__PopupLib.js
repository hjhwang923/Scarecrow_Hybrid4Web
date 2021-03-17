function LayerPopup(boxID, step) {
	// Private
	Object.defineProperty(this, "boxID", { value: boxID + "_Popup", configurable: false, enumerable: false, writable: false });
	Object.defineProperty(this, "$box", { value: null, configurable: false, enumerable: false, writable: true });
	Object.defineProperty(this, "$disabledBox", { value: null, configurable: false, enumerable: false, writable: true });
	Object.defineProperty(this, "scriptURL", { value: null, configurable: false, enumerable: false, writable: true });

	// Public
	Object.defineProperty(this, "callback", { value: null, configurable: false, enumerable: true, writable: true });
	Object.defineProperty(this, "referFunc", { value: null, configurable: false, enumerable: true, writable: true });
	Object.defineProperty(this, "param", { value: null, configurable: false, enumerable: true, writable: true });

	let currentStep = parseInt(step);
	if (isNaN(currentStep)) currentStep = 1;
	if (currentStep < 1) currentStep = 1;

	Object.defineProperty(this, "step", { value: currentStep, configurable: false, enumerable: false, writable: false });
}

LayerPopup.prototype.Make = function() {
	this.$box = $("#popup_" + this.boxID);
	this.$disabledBox = $("#popup-disabled_" + this.boxID);
	if (this.$box.length > 0) this.$box.remove();
	if (this.$disabledBox.length > 0) this.$disabledBox.remove();

	this.$box = $("<div id=\"popup_" + this.boxID + "\" class=\"layer-popup-box\"></div>");
	this.$disabledBox = $("<div id=\"popup-disabled_" + this.boxID + "\" class=\"layer-popup-disabled\"></div>");

	let boxHTML = "";
	boxHTML += "<div class=\"layer-popup-header\">";
	boxHTML += "	<h6 class=\"popup-title\"></h6>";
	boxHTML += "	<p class=\"closeBtn\"></p>";
	boxHTML += "	<div class=\"clear\"></div>";
	boxHTML += "</div>";
	boxHTML += "<div class=\"layer-popup-body\"></div>";
	this.$box.html(boxHTML);

	const oThis = this;

	let $popupContainer = $("#__popup_container");

	if ($popupContainer.length === 0) {
		$("body").append("<div id=\"__popup_container\"></div>");
		$popupContainer = $("#__popup_container");
	}

	$popupContainer.append(this.$box);
	$popupContainer.append(this.$disabledBox);

	this.$box.css({
		"top": "10px",
		"left": "10px",
		"width": "calc(100% - 20px)",
		"height": "calc(100% - 20px)"
	});

	this.$disabledBox.css({
		"top": 0,
		"height": "100%"
	});

	const headerHeight = this.$box.find("div.layer-popup-header").outerHeight(true);
	this.$box.find("div.layer-popup-body").css("height", "calc(100% - " + headerHeight + "px)");

	const $popupHeader = this.$box.find("div.layer-popup-header");
	$popupHeader.find("p.closeBtn").bind("click", function() { oThis.Close(); });

	this.$box.css("zIndex", 1000 + ((this.step) + 2));
	this.$disabledBox.css("zIndex", 1000 + (this.step + 1));

	this.$box.hide();
	this.$disabledBox.hide();
	SetOpacity(this.$disabledBox, 0.5);
};

LayerPopup.prototype.Close = function() {
	if (this.$box === null) return;

	try {
		if (this.$box.data("pageFunc") !== null) {
			if (typeof (this.$box.data("pageFunc")) == "object" || typeof (this.$box.data("pageFunc")) == "function") {
				try {
					this.$box.data("pageFunc").CloseCallBack();
				}
				catch(e) {}

				const currentFuncName = this.$box.data("pageFunc").funcName;

				try {
					// 객체상태값
					// console.log(currentFuncName, Object.getOwnPropertyDescriptor(window, currentFuncName));
					eval("delete " + currentFuncName);
				}
				catch (e) {
					console.error(e);
				}

				this.$box.removeData("pageFunc");
			}
		}
	}
	catch (e) {}

	try {
		const $styles = $("style");

		if ($styles.length > 0) {
			for (let i = 0, len = $styles.length; i < len; i++) {
				if ($styles.eq(i).attr("data-popupID") === this.boxID) {
					$styles.eq(i).remove();
					break;
				}
			}
		}
	}
	catch(e) {}

	try {
		const $scripts = $("script");

		for (let i = 0, len = $scripts.length; i < len; i++) {
			if (typeof ($scripts.eq(i).attr("src")) != "undefined") {
				if ($scripts.eq(i).attr("src").indexOf(this.scriptURL) > -1) {
					$scripts.eq(i).remove();
					break;
				}
			}
		}
	}
	catch (e) {}

	if (this.$disabledBox !== null) {
		this.$disabledBox.remove();
		this.$disabledBox = null;
	}

	this.$box.remove();
	this.$box = null;
};

/**
 * 팝업 오픈여부 확인
 */
LayerPopup.prototype.isOpen = function() {
	if (this.$box === null) {
		return false;
	}
	else if (this.$box.css("display") === "none") {
		return false;
	}

	return true;
};

/**
 * 팝업 보여주기
 * @param param 설정
 *
 * config = {
 *     pageURL: {페이지 절대주소},
 *     title: {팝업 제목},
 *     callback: {팝업내에서 부모창 처리 함수}
 *     referFunc: {팝업내에서 부모창 참조 함수}
 *     param: {팝업창으로 보내는 인수객체}
 * }
 */
LayerPopup.prototype.View = function(config) {
	if (typeof(config) != "object") {
		_ShowError("No pop-up settings information.");
		return;
	}

	if (this.$box === null) this.Make();

	const pageURL = (config.pageURL) ? config.pageURL : "";
	const title = (config.title) ? config.title : "";
	const callback = (config.callback) ? config.callback : null;
	const referFunc = (config.referFunc) ? config.referFunc : null;
	const param = (config.param) ? config.param : null;

	this.$box.find("div.layer-popup-header h6.popup-title").html(title);

	if (typeof(callback) == "object" || typeof(callback) == "function") {
		this.callback = callback;
	}
	else {
		this.callback = null;
	}

	if (typeof(referFunc) == "object" || typeof(referFunc) == "function") {
		this.referFunc = referFunc;
	}
	else {
		this.referFunc = null;
	}

	if (typeof(param) == "undefined") {
		this.param = null;
	}
	else {
		this.param = param;
	}

	const $popupBody = this.$box.find("div.layer-popup-body");
	if ($popupBody.length === 0) return;

	const panelWidth = $(document).width();
	const popupWidth = panelWidth - 40;

	$popupBody.empty();
	$popupBody.html("<p style=\"padding:15px 0;text-align:center;\">Page loading...</p>");

	this.$box.show();
	this.$disabledBox.show();
	this.PageLoad(pageURL);
};

LayerPopup.prototype.PageLoad = function(currentPageURL) {
	const $popupBody = this.$box.find("div.layer-popup-body");
	if ($popupBody.length === 0) return;

	let pageParam = "";
	let loadPageURL = "";

	const pageURL = currentPageURL.substr(0, currentPageURL.indexOf(".html"));
	let pageName = pageURL;
	if (pageURL.lastIndexOf("/") > -1) pageName = pageURL.substr(pageURL.lastIndexOf("/") + 1);
	if (currentPageURL.lastIndexOf("?") > -1 ) pageParam = currentPageURL.substr(currentPageURL.lastIndexOf("?") + 1);

	const $styles = $("style");

	if ($styles.length > 0) {
		for (let i = 0, len = $styles.length; i < len; i++) {
			if ($styles.eq(i).attr("data-popupID") === this.boxID) {
				$styles.eq(i).remove();
				break;
			}
		}
	}

	const $scripts = $("script");

	for (let i = 0, len = $scripts.length; i < len; i++) {
		if (typeof($scripts.eq(i).attr("src")) != "undefined") {
			if ($scripts.eq(i).attr("src").indexOf(pageName) > -1) {
				$scripts.eq(i).remove();
				break;
			}
		}
	}

	// Html Load
	__Today = new Date();
	__NewNo = __Today.getFullYear() + __Today.getMonth() + __Today.getDate() + __Today.getHours() + __Today.getMinutes() + __Today.getSeconds() + __Today.getMilliseconds();
	const oThis = this;

	this.lastPageName = pageName;
	loadPageURL = pageURL + ".html?_no=" + __NewNo;

	$.get(__ServerURL + loadPageURL,
		function(data) {
			let str;
			let regPtrn;
			let regResult;

			if (data.indexOf("<body>") > -1) {
				let bodyData = data.substr(data.indexOf("<body>") + 6);
				if (bodyData.indexOf("</body>") > -1) bodyData = bodyData.substr(0, bodyData.indexOf("</body>"));

				if (bodyData.length > 0) {
					bodyData = bodyData.replace(/\r\n/gm, "");
					bodyData = bodyData.replace(/\t/gm, "");

					regPtrn = /id="([A-Za-z0-9_-]+)"/ig;
					regResult = regPtrn.exec(bodyData);
					str = bodyData;

					while (regResult) {
						str = str.replace(regResult[0], "id=\"" + pageName + "_" + regResult[1] + "\"");
						regResult = regPtrn.exec(bodyData);
					}

					bodyData = str;
				}

				const $header = $("head"), checkStr = "<style type=\"text/css\"";

				if ($header.length > 0) {
					if (data.indexOf(checkStr + ">") > -1) {
						let styleData = data.substr(data.indexOf(checkStr + ">") + checkStr.length + 1);
						if (styleData.indexOf("</style>") > -1) styleData = styleData.substr(0, styleData.indexOf("</style>"));

						if (styleData.length > 0) {
							styleData = styleData.replace(/\r\n/gm, " ");
							styleData = styleData.replace(/\t/gm, "");

							regPtrn = /[^:]#([A-Za-z0-9_-]+)[ {| ]/ig;
							regResult = regPtrn.exec(styleData);
							str = styleData;

							while (regResult) {
								str = str.replace("#" + regResult[1], "#" + pageName + "_" + regResult[1]);
								regResult = regPtrn.exec(styleData);
							}

							styleData = str;
							$header.append(checkStr + " data-popupID=\"" + oThis.boxID + "\">" + styleData + "</style>");
						}
					}
				}

				const $loadBox = $("<div>" + bodyData + "</div>");
				$popupBody[0].innerHTML = $loadBox.html();
				loadPageURL = pageURL + ".js?_no=" + __NewNo;

				$LAB.script(__ServerURL + loadPageURL).wait(function() {
					try {
						oThis.$box.data("pageFunc", eval(pageName));

						if (typeof(oThis.$box.data("pageFunc")) == "object" || typeof(oThis.$box.data("pageFunc")) == "function") {
							try {
								Object.defineProperty(oThis.$box.data("pageFunc"), "prefix", {
									value: pageName + "_",
									configurable: false,
									enumerable: true,
									writable: false
								});

								Object.defineProperty(oThis.$box.data("pageFunc"), "funcName", {
									value: pageName,
									configurable: false,
									enumerable: true,
									writable: false
								});

								Object.defineProperty(oThis.$box.data("pageFunc"), "__popupFunc", {
									value: oThis,
									configurable: false,
									enumerable: true,
									writable: false
								});

								oThis.$box.data("pageFunc", oThis.$box.data("pageFunc"));
								oThis.$box.data("pageFunc").Init(pageParam);
							}
							catch (e) {
								console.log(e);
								$popupBody[0].innerHTML = "<p style=\"padding:15px 0;text-align:center;\">Error loading page.</p>";
								__ShowError(__ServerNotConnectMSG);
							}
						}
					}
					catch (e) {
						console.log(e);
						$popupBody[0].innerHTML = "<p style=\"padding:15px 0;text-align:center;\">Error loading page.</p>";
						__ShowError(__ServerNotConnectMSG);
					}

				});
			}
		}
	)
	.fail(function() {
		// Error
		$popupBody[0].innerHTML = "<p style=\"padding:15px 0;text-align:center;\">Error loading page.</p>";
	});
};
