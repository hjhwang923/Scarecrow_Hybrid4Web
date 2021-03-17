/*
 * None
 */
function none() {}

/**
 * Ajax URL Call Promise
 * @param url
 * @param param
 * @param returnType
 * @returns {Promise<>}
 */
function commandCustom(url, param, returnType) {
	returnType = (typeof(returnType) === "string") ? returnType : "json";
	if (returnType !== "json") returnType = "text";

	return new Promise(function(resolve, reject) {
		$.ajax({
			type: "POST",
			dataType: "text",
			async: true,
			url: url,
			data: param,
			beforeSend: function() {
			},
			success: function(data) {
				if (returnType === "json") {
					const parseData = GetJSON(data);
					resolve(parseData);
				}
				else {
					resolve(data);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				reject(__ServerNotConnectMSG);
			}
		});
	});
}

/**
 * Ajax Command Select Call Promise
 * @param sqlNM
 * @param param
 * @param dbType
 * @returns {Promise<>}
 */
function commandSelect(sqlNM, param, dbType) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			type: "POST",
			dataType: "text",
			async: true,
			url: "/command_select.jsp",
			data: GetDataPostData(param, sqlNM, dbType),
			beforeSend: function() {
			},
			success: function(data) {
				const parseData = GetJSON(data);
				parseData.rows = Array.isArray(parseData.rows) ? parseData.rows : [];
				parseData.res = (typeof(parseData.res) === "boolean") ? parseData.res : false;
				parseData.msg = (typeof(parseData.msg) === "string") ? parseData.msg : "";

				resolve(parseData);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				reject(__ServerNotConnectMSG);
			}
		});
	});
}

/**
 * Ajax Command Update Call Promise
 * @param sqlNM
 * @param param
 * @param dbType
 * @returns {Promise<>}
 */
function commandUpdate(sqlNM, param, dbType) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			type: "POST",
			dataType: "text",
			async: true,
			url: "/command_update.jsp",
			data: GetDataPostData(param, sqlNM, dbType),
			beforeSend: function() {
			},
			success: function(data) {
				const parseData = GetJSON(data);
				parseData.cnt = (typeof(parseData.cnt) === "number") ? parseData.cnt : 0;
				parseData.res = (typeof(parseData.res) === "boolean") ? parseData.res : false;
				parseData.msg = (typeof(parseData.msg) === "string") ? parseData.msg : "";

				resolve(parseData);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				reject(__ServerNotConnectMSG);
			}
		});
	});
}

/*
 * Data Request POST
 */
function GetDataPostData(param, sqlNm, dbType, pageNo, pageSize) {
	if (typeof(param) != "object") {
		param = [];
	}

	if (typeof(pageNo) != "number") pageNo = 1;
	if (typeof(pageSize) != "number") pageSize = 20;

	const postData = {
		sqlNm: sqlNm,
		pamCnt: param.length,
		pam: "",
		dbType: dbType,
		pageNo: pageNo,
		pageSize: pageSize
	};

	let temp = "";

	for (let i = 0; i < param.length; i++) {
		temp += "@@" + param[i];
	}

	postData.pam = temp.substr(2);

	return postData;
}

/*
 * Get Request Parameters
 */
const Request = {
	getParameter: function (name) {
		let rtnVal = "";
		const currentHref = location.href;
		const parameters = (currentHref.slice(currentHref.indexOf('?') + 1, currentHref.length)).split('&');

		for (let i = -1; ++i < parameters.length;) {
			const temp = parameters[i].split("=");

			if (temp.length === 2) {
				if (temp[0].toLowerCase() === name.toLowerCase()) {
					rtnVal = temp[1];
					break;
				}
			}
		}

		return rtnVal;
	},

	Get: function (name, str) {
		let rtnVal = "";
		const currentHref = str;
		const parameters = (currentHref.slice(currentHref.indexOf('?') + 1, currentHref.length)).split('&');

		for (let i = -1; ++i < parameters.length;) {
			const temp = parameters[i].split("=");

			if (temp.length === 2) {
				if (temp[0].toLowerCase() === name.toLowerCase()) {
					rtnVal = temp[1];
					break;
				}
			}
		}

		return rtnVal;
	}
};

/**
 * JQuery Extented (contains 대소문자 구분없이 검색)
 */
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

/**
 * 모바일 여부
 * @returns
 */
function isMobile() {
	const userAgent = navigator.userAgent;

	if (typeof(window.conn) != "undefined") {
		return true;
	}
	else if ((userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) && typeof(webkit) != "undefined") {
		return true;
	}

	return false;
}

/**
 * 에러 알림창 표시
 * @param {*} message
 * @param {*} callback
 */
function _ShowError(message, callback) {
	_ShowAlert("error", message, callback);
}

/**
 * 경고 알림창 표시
 * @param {*} message
 * @param {*} callback
 */
function _ShowWarning(message, callback) {
	_ShowAlert("warning", message, callback);
}

/**
 * 성공 알림창 표시
 * @param {*} message
 * @param {*} callback
 */
function _ShowSuccess(message, callback) {
	_ShowAlert("success", message, callback);
}

/**
 * 정보 알림창 표시
 * @param {*} message
 * @param {*} callback
 */
function _ShowInfo(message, callback) {
	_ShowAlert("info", message, callback);
}

/**
 * 알림창 표시
 * @param {*} type warning, error, success, info
 * @param {*} message
 * @param {*} callback
 */
function _ShowAlert(type, message, callback) {
	if (typeof(swal) == "undefined") return;

	if ((typeof(callback) == "object" || typeof(callback) == "function") === false) {
		callback = null;
	}

	swal({
			title: "",
			text: message,
			type: type,
			confirmButtonText: "OK"
		},
		function(isConfirm) {
			if (callback !== null) callback();
		});
}

/**
 * 사용자 확인창 표시
 * @param {*} message
 * @param {*} confirmCallback
 * @param {*} cancelCallback
 */
function _ShowConfirm(message, confirmCallback, cancelCallback) {
	if ((typeof(confirmCallback) == "object" || typeof(confirmCallback) == "function") === false) {
		confirmCallback = null;
	}

	if ((typeof(cancelCallback) == "object" || typeof(cancelCallback) == "function") === false) {
		cancelCallback = null;
	}

	swal({
			title: "",
			text: message,
			type: "info",
			showCancelButton: true,
			confirmButtonText: "확인",
			cancelButtonText: "취소",
			closeOnConfirm: false,
			closeOnCancel: false,
			showLoaderOnConfirm: true,
			allowOutsideClick: false
		},
		function(isConfirm) {
			if (isConfirm) {
				if (confirmCallback !== null) {
					confirmCallback();
				}
			}
			else {
				swal.close();

				if (cancelCallback !== null) {
					cancelCallback();
				}
			}
		});
}

/**
 * 사용자 확인창에서 작업 성공인 경우 성공 경고창 표시
 * @param {*} message
 * @param {*} callback
 */
function _ShowSuccessAfterLoading(message, callback) {
	if ((typeof(callback) == "object" || typeof(callback) == "function") === false) {
		callback = null;
	}

	window.setTimeout(function () {
		swal({
				title: "",
				text: message,
				type: "success"
			},
			function (isConfirm) {
				if (callback !== null) {
					callback();
				}
			});
	}, 1000);
}

/**
 * 사용자 확인창에서 작업 실패한 경우 에러 경고창 표시
 * @param {*} message
 * @param {*} callback
 */
function _ShowErrorAfterLoading(message, callback) {
	if ((typeof(callback) == "object" || typeof(callback) == "function") === false) {
		callback = null;
	}

	window.setTimeout(function () {
		swal({
				title: "",
				text: message,
				type: "error"
			},
			function (isConfirm) {
				if (callback !== null) {
					callback();
				}
			});
	}, 1000);
}

function _CloseConfirm() {
	if (typeof(swal) == "undefined") return;
	swal.close();
}

/**
 * 숫자형 데이터 정수형 여부 확인
 * @param {*} n
 */
function isInt(n) {
	return Number(n) === n && n % 1 === 0;
}

/**
 * 숫자형 데이터 실수형 여부 확인
 * @param {*} n
 */
function isFloat(n) {
	return Number(n) === n && n % 1 !== 0;
}

/**
 * 로딩창 표시
 * @param message
 * @returns
 */
function _ShowWebLoading(message) {
	let $box = $("#__Loading_Box");

	if ($box.length === 0) {
		const str = "" +
			"<div id=\"__Loading_Box\" style=\"display:none;\">" +
			"	<div class=\"inner-box\">" +
			"		<div class=\"message-box\">" +
			"			<div class=\"icon-box\">" +
			"				<span class=\"icon icon1\"></span>" +
			"				<span class=\"icon icon2\"></span>" +
			"				<span class=\"icon icon3\"></span>" +
			"				<span class=\"icon icon4\"></span>" +
			"				<span class=\"icon icon5\"></span>" +
			"			</div>" +
			"			<p class=\"message\"></p>" +
			"		</div>" +
			"		<div class=\"disabled-box\"></div>" +
			"	</div>" +
			"</div>";

		$box = $(str);
		$("body").append($box);
	}

	$box.find("div.message-box p.message").html(message);
	$box.show();
}

/**
 * 로딩창 숨김
 */
function _HideWebLoading() {
	_HideWebLoading(null);
}

/**
 * 로딩창 숨김
 * @param callback
 */
function _HideWebLoading(callback) {
	const $box = $("#__Loading_Box");

	if ($box.length === 0) return;
	if ($box.css("display") === "none") return;

	if ((typeof(callback) == "object" || typeof(callback) == "function") === false) {
		callback = null;
	}

	window.setTimeout(function () {
		$box.hide();
		if (callback !== null) callback();
	}, 500);
}

/**
 * 검색박스
 * @param boxID
 * @param callButtonID
 */
function SearchBox(boxID, callButtonID) {
	Object.defineProperty(this, "boxID", { value: boxID, configurable: false, enumerable: false, writable: false });
	Object.defineProperty(this, "$box", { value: $(`#${boxID}`), configurable: false, enumerable: false, writable: false });
	Object.defineProperty(this, "$callButton", { value: $(`#${callButtonID}`), configurable: false, enumerable: false, writable: false });

	if (this.$callButton.length > 0) {
		this.$callButton.off("click");
		this.$callButton.on("click", (event) => {
			this.Show();
		});
	}
}

SearchBox.prototype.Show = function() {
	let $disabledBox = $(`#${this.boxID}-disabled`);

	if ($disabledBox.length === 0) {
		$disabledBox = $(`<div style="display:none;" id="${this.boxID}-disabled" class="search-box-disabled"></div>`);
		$disabledBox.on("click", (event) => {
			this.Close();
		});

		this.$box.after($disabledBox);
	}
	else {
		$disabledBox.hide();
	}

	$disabledBox.fadeIn("normal");
	this.$box.slideDown("normal");
	this.$callButton.hide();
};

SearchBox.prototype.Close = function () {
	$(`#${this.boxID}-disabled`).fadeOut("fast", function() {
		$(this).remove();
	});

	this.$box.slideUp("fast", () => {
		this.$box.hide();
	});

	this.$callButton.show();
};
