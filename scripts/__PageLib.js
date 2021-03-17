function PageLib(panelID) {
	Object.defineProperty(this, "panelID", { value: panelID, configurable: false, enumerable: true, writable: false });
	Object.defineProperty(this, "$panel", { value: $("#" + panelID), configurable: false, enumerable: true, writable: false });
	Object.defineProperty(this, "menuIDStack", { value: [], configurable: false, enumerable: false, writable: true });
}

/**
 * Page 삭제
 * @param menuID
 * @param isRemovePanel
 */
PageLib.prototype.DelPageData = function(menuID, isRemovePanel) {
	if (typeof(menuID) !== "string") return;
	if (typeof(isRemovePanel) !== "boolean") isRemovePanel = true;

	const $currentPanel = this.$panel.find(`div.page-panel[data-menu-id='${menuID}']`);
	if ($currentPanel.length === 0) return;

	const stackIndex = this.menuIDStack.indexOf(menuID);

	if (stackIndex > -1) {
		this.menuIDStack.splice(stackIndex, 1);
	}

	try {
		// 스타일 삭제
		const $styles = $("style");

		if ($styles.length > 0) {
			for (let i = 0, len = $styles.length; i < len; i++) {
				if ($styles.eq(i).attr("data-menu-id") === menuID) {
					$styles.eq(i).remove();
					break;
				}
			}
		}

		// 객체삭제
		if ($currentPanel.data("pageFunc") !== null) {
			if (typeof($currentPanel.data("pageFunc")) == "object" || typeof($currentPanel.data("pageFunc")) == "function") {
				const pageFuncName = $currentPanel.data("pageFunc").funcName;

				if (typeof($currentPanel.data("pageFunc").OnDisappear) == "object" || typeof($currentPanel.data("pageFunc").OnDisappear) == "function") {
					try {
						$currentPanel.data("pageFunc").OnDisappear();
					}
					catch (e) {}
				}

				$currentPanel.removeData("pageFunc");

				try {
					// 객체상태값
					// console.log( Object.getOwnPropertyDescriptor(window, pageFuncName) );
					eval("delete " + pageFuncName);
				}
				catch (e) {}
			}
		}

		// 스크립트 삭제
		const scriptURL = $currentPanel.attr("data-script-url");
		const $scripts = $("script");

		for (let i = 0, len = $scripts.length; i < len; i++) {
			if (typeof($scripts.eq(i).attr("data-script-url")) != "undefined") {
				if ($scripts.eq(i).attr("data-script-url") === scriptURL) {
					$scripts.eq(i).remove();
					break;
				}
			}
		}

		if (isRemovePanel) {
			$currentPanel.remove();
		}
	}
	catch (e) {
		console.error(e);
	}
};

/**
 * 현재 활성화된 패널의 메뉴아이디 가져오기
 */
PageLib.prototype.ViewMenuID = function() {
	if (this.menuIDStack.length > 0) {
		return this.menuIDStack[this.menuIDStack.length - 1];
	}

	return "";
}

PageLib.prototype.ViewIndex = function() {
	return this.menuIDStack.length;
}

/**
 * 현재 페이지 새로고침
 */
PageLib.prototype.Reload = function() {
	const currentMenuID = this.ViewMenuID();
	if (currentMenuID.length === 0) return;

	const $currentPanel = this.$panel.find("div.page-panel[data-menu-id='" + currentMenuID + "']");
	if ($currentPanel.length === 0) return;
	if (typeof($currentPanel.data("param")) != "object") return;

	this.View($currentPanel.data("config"), true);
};

/**
 * 이전 페이지로 이동
 * @param cnt Number
 */
PageLib.prototype.PageBack = function(cnt) {
	if (this.menuIDStack.length <= 1) return;
	if (typeof(cnt) != "number") cnt = 1;
	if (cnt > (this.menuIDStack.length - 1)) cnt = this.menuIDStack.length - 1;

	const menuIDStackLength = this.menuIDStack.length;

	for (let i = 1; i <= cnt; i++) {
		const check = menuIDStackLength - i;
		this.DelPageData(this.menuIDStack[check], true);
	}

	const prevMenuID = this.menuIDStack[this.menuIDStack.length - 1];
	const $prevPanel = this.$panel.find("div.page-panel[data-menu-id='" + prevMenuID + "']");
	if ($prevPanel.length === 0) return;
	$prevPanel.show();

	if (typeof($prevPanel.data("pageFunc")) == "object" || typeof($prevPanel.data("pageFunc")) == "function") {
		try {
			$prevPanel.data("pageFunc").OnResume();
		}
		catch (e) {}
	}
};

/**
 * 현재 페이지 패널 가져오기
 */
PageLib.prototype.ViewPanel = function() {
	const currentMenuID = this.ViewMenuID();
	const $currentPanel = this.$panel.find("div.page-panel[data-menu-id='" + currentMenuID + "']");

	if ($currentPanel.length > 0) {
		return $currentPanel;
	}

	return null;
};

/**
 * 메인페이지를 제외하고 모든 페이지 삭제
 * @constructor
 */
PageLib.prototype.Clear = function() {
	if (this.menuIDStack.length < 1) return;

	for (let i = this.menuIDStack.length - 1; i > 0; i--) {
		this.DelPageData(this.menuIDStack[i], true);
	}
};

/**
 * Page 보기
 * @param config
 * @param isReload
 *
 * config 구조
 *   menuID : 메뉴아이디
 *   title : 페이지 제목
 *   url : 페이지 주소
 *   urlParam : 페이지주소 인자
 */
PageLib.prototype.View = function(config, isReload) {
	if ((typeof (config) == "object" || typeof (config) == "function") === false) {
		console.error("설정값이 없습니다.");
		return;
	}

	if (this.ViewMenuID().length > 0) {
		this.$panel.find(`div.page-panel[data-menu-id='${this.ViewMenuID()}']`).hide();
	}

	this.DelPageData(config.menuID, !isReload);

	if (typeof(isReload) !== "boolean") isReload = false;
	new PageLoader(this, config, isReload)
};

/**
 * 동적으로 HTML, JS 로드
 * @param pageLib PageLib
 * @param config
 * @param isReload 새로고침 여부
 *
 * config 구조
 *   menuID : 메뉴아이디
 *   title : 페이지 제목
 *   url : 페이지 주소
 *   urlParam : 페이지 주소 인자
 */
function PageLoader(pageLib, config, isReload) {
	if ((typeof(pageLib) == "object" || typeof(pageLib) == "function") === false) return;
	if (typeof(config) !== "object") return;

	isReload = (typeof(isReload) === "boolean") ? isReload : false;
	config.menuID = (typeof(config.menuID) === "string") ? config.menuID : "";
	config.title = (typeof(config.title) === "string") ? config.title : "";
	config.url = (typeof(config.url) === "string") ? config.url : "";
	config.urlParam = (typeof(config.urlParam) === "object") ? config.urlParam : {};

	const pageURL = config.url;
	const pageURLNoExt = pageURL.substr(0, pageURL.indexOf(".html"));
	let pageName = pageURLNoExt;
	if (pageURLNoExt.lastIndexOf("/") > -1) pageName = pageURLNoExt.substr(pageURLNoExt.lastIndexOf("/") + 1);
	let pageParam = "";
	if (pageURL.indexOf(".html?") > -1) pageParam = pageURL.substr(pageURL.indexOf(".html?") + 6);

	const panelID = "__pageContentPanel-" + config.menuID;
	let $currentPanel = null;

	if (isReload) {
		if (pageLib.$panel.find(`#${panelID}`).length > 0) {
			$currentPanel = pageLib.$panel.find(`#${panelID}`);
		}
	}

	if ($currentPanel === null) {
		$currentPanel = $("<div></div>");
		$currentPanel.attr("id", panelID);
		$currentPanel.attr("data-menu-id", config.menuID);
		$currentPanel.attr("data-menu-link", pageURL);
		$currentPanel.attr("data-menu-param", pageParam);
		$currentPanel.addClass("page-panel");
		$currentPanel.hide();

		$currentPanel.css({
			width: "100%",
			height: "100%",
			position: "relative",
			outlineStyle: "none"
		});

		if (pageLib.$panel.find("div.page-panel").length === 0) {
			pageLib.$panel.append($currentPanel);
		}
		else {
			pageLib.$panel.find("div.page-panel:last").after($currentPanel);
		}
	}

	$currentPanel.data("config", config);

	if (pageLib.menuIDStack.indexOf(config.menuID) === -1) {
		pageLib.menuIDStack.push(config.menuID);
	}

	/* Html Load */
	__Today = new Date();
	__NewNo = __Today.getFullYear() + __Today.getMonth() + __Today.getDate() + __Today.getHours() + __Today.getMinutes() + __Today.getSeconds() + __Today.getMilliseconds();

	__ShowLoading("Page Loading...");

	try {
		$(document).scrollTop(0);

		const oThis = this;

		$.get(__ServerURL + pageURLNoExt + ".html?_no=" + __NewNo)
			.done(function(data) {
				let regPtrn = null, regResult = null, str = "";

				if (data.indexOf("<body>") > -1) {
					let bodyData = data.substr(data.indexOf("<body>") + 6);
					if (bodyData.indexOf("</body>") > -1) bodyData = bodyData.substr(0, bodyData.indexOf("</body>"));

					if (bodyData.length > 0) {
						bodyData = bodyData.replace(/\r\n/gm, "");
						bodyData = bodyData.replace(/\t/gm, "");

						regPtrn = / id="([A-Za-z0-9_-]+)"/ig;
						regResult = regPtrn.exec(bodyData);
						str = bodyData;

						while (regResult) {
							str = str.replace(regResult[0], " id=\"" + pageName + "_" + regResult[1] + "\"");
							regResult = regPtrn.exec(bodyData);
						}

						bodyData = str;
					}

					const $header = $("head");
					const checkStr = "<style type=\"text/css\"";

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

								styleData = str.Trim();

								if (styleData.length > 0) {
									$header.append(checkStr + " data-menu-id=\"" + config.menuID + "\">" + styleData + "</style>");
								}
							}
						}
					}

					$currentPanel.show();
					$currentPanel.attr("tabindex", 100).focus().blur();

					const $loadBox = $("<div>" + bodyData + "</div>");
					$currentPanel.html($loadBox.html()).show();

					const scriptURL = __ServerURL + pageURLNoExt + ".js?_no=" + __NewNo;
					$currentPanel.attr("data-script-url", scriptURL);

					$.get(scriptURL)
						.done(function (data) {
							const script = document.createElement("script");
							script.type = "text/javascript";
							$(script).attr("data-script-url", scriptURL);

							const inlineScript = document.createTextNode(data);
							script.appendChild(inlineScript);
							$("head").append(script);

							try {
								$currentPanel.data("pageFunc", eval(pageName));

								if (typeof($currentPanel.data("pageFunc")) == "object" || typeof($currentPanel.data("pageFunc")) == "function") {
									Object.defineProperty($currentPanel.data("pageFunc"), "prefix", {
										value: pageName + "_",
										configurable: false,
										enumerable: true,
										writable: false
									});

									Object.defineProperty($currentPanel.data("pageFunc"), "funcName", {
										value: pageName,
										configurable: false,
										enumerable: true,
										writable: false
									});

									Object.defineProperty($currentPanel.data("pageFunc"), "param", {
										value: config.urlParam,
										configurable: false,
										enumerable: true,
										writable: false
									});

									__HideLoading(() => {
										$currentPanel.data("pageFunc").Init(pageParam);
									});
								}
							}
							catch (e) {
								console.error(e);
								__ShowError(e);
							}
						})
						.fail(function () {
							__HideLoading();
							_ShowError("페이지를 찾을 수 없습니다.");
						});
				}
				else {
					__HideLoading();
					__ShowError("페이지 내용이 없습니다.");
				}
			})
			.fail(function() {
				__HideLoading();
				__ShowError("페이지를 찾을 수 없습니다.");
			});
	}
	catch (e) {
		console.error(e);
		__ShowError(e);
	}
}