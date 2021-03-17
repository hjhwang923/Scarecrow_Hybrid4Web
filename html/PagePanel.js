const PagePanel = {
	pageLib: null,
	socket: null,

	$header: null,
	$menu: null,
	$custList: null,

	Init: function () {
		this.pageLib = new PageLib("contents");



	},

	EventBind: function () {
		// 음소거 ON/OFF
		this.$header.find("> div.btn_wrap button.mute").on("click", (event) => {
			const $target = $(event.currentTarget);

			if ($target.hasClass("on")) {
				$target.removeClass("on");
			}
			else {
				$target.addClass("on");
			}
		});

		// 메뉴 펼치기
		this.$header.find("> div.btn_wrap button.ham").on("click", (event) => {
			this.MenuToggle(true);
		});

		// 메뉴 닫기
		this.$menu.find("button.cancel").on("click", (event) => {
			this.MenuToggle(false);
		});

		const $custListBox = $("#custListBox");
		const $custListBtn = $("#custListBtn");

		// 고객사 목록 버튼 Toggle
		$custListBtn.on("click", (event) => {
			const $target = $(event.currentTarget);

			if ($target.hasClass("on")) {
				this.CustListMenuToggle(false);
			}
			else {
				this.CustListMenuToggle(true);
			}
		});

		// 고객사 목록 비활성 배경
		$custListBox.find("div.bg").on("click", (event) => {
			$custListBtn.trigger("click");
		});
	},

	GetMenu: function() {
		__ShowLoading("Loading...");

		commandCustom("/html/__MenuListBL.jsp", {})
			.then((data) => {
				const { menu: menus } = data;

				for (const menu of menus) {
					this.$menu.find("ul.left").append(`<li data-id="${menu.ID}" data-link="${menu.LINK}">${menu.TITLE}</li>`);
					let $subBox = $(`<li data-id="${menu.ID}"></li>`);

					for (const sub1 of menu.SUB1) {
						if (sub1.SUB2.length > 0) {
							$subBox.append(`<span>${sub1.TITLE}</span>`);

							let $sub2Box = $(`<div><ul></ul></div>`);

							for (const sub2 of sub1.SUB2) {
								let $item = $(`<li><a href="javascript:none()" onclick="PagePanel.GoPage(this)">${sub2.TITLE}</a></li>`);
								$item.find("a").attr("data-id", sub2.ID).attr("data-link", sub2.LINK);

								$sub2Box.find("ul").append($item);
							}

							$subBox.append($sub2Box);
						}
						else {
							let $item = $(`<a href="javascript:none()" onclick="PagePanel.GoPage(this)">${sub1.TITLE}</a>`);
							$item.attr("data-id", sub1.ID).attr("data-link", sub1.LINK);

							$subBox.append($item);
						}
					}

					this.$menu.find("ul.right").append($subBox);
				}

				// 메뉴 2-Depth
				this.$menu.find("div.bottom ul.left > li").on("click", (event) => {
					const $target = $(event.currentTarget);
					const index = $target.index();

					this.$menu.find("div.bottom ul.left > li").removeClass("on");
					$target.addClass("on");
					this.$menu.find("div.bottom ul.right > li").removeClass("on").eq(index).addClass("on");

					if (index === 0) {
						PagePanel.GoMain();
					}
				});

				// 메뉴 3-Depth
				this.$menu.find("div.bottom ul.right > li > span").on("click", (event) => {
					const $target = $(event.currentTarget);
					const boxHeight = $target.next().find("ul").height();

					if ($target.hasClass("on")) {
						$target.removeClass("on");
						$target.next().css({"height": "0"});
					} else {
						$target.addClass("on");
						$target.next().css({"height": boxHeight + "px"});
					}
				});

				__HideLoading();

				this.GoMain();
			})
			.catch((error) => {
				console.error(error);

				__HideLoading();
				_ShowError(__ServerNotConnectMSG);
			});
	},

	/**
	 * User Mobile Device Info Update
	 */
	SaveDeviceToken: function () {
		__GetDeviceID(function (deviceType, deviceToken) {
			// deviceType
			//   A : Android
			//   I : iOS
		});
	},

	MenuToggle: function(flag) {
		if (typeof(flag) !== "boolean") flag = true;

		if (flag) {
			this.$menu.addClass('on');
		}
		else {
			this.$menu.removeClass("on");
		}
	},

	CustListMenuToggle: function(flag) {
		if (typeof(flag) !== "boolean") flag = true;

		const $custListBox = $("#custListBox");
		const $custListBtn = $("#custListBtn");

		if (flag) {
			$custListBtn.addClass("on");
			$custListBox.find("div.side").addClass("on");
			$custListBox.find("div.bg").fadeIn();
		}
		else {
			$custListBtn.removeClass("on");
			$custListBox.find("div.side").removeClass("on");
			$custListBox.find("div.bg").fadeOut();
		}
	},

	/**
	 * 이전페이지로 이동
	 */
	Back: function (cnt) {
		if (typeof (cnt) != "number") cnt = 1;
		this.pageLib.PageBack(cnt);
	},

	/**
	 * 현재페이지 새로고침
	 */
	Reload: function () {
		this.pageLib.Reload();
	},

	/**
	 * 현재페이지 메뉴아이디 가져오기
	 */
	ViewMenuID: function () {
		return this.pageLib.ViewMenuID();
	},

	/**
	 * 현재 페이지 패널 가져오기
	 */
	ViewPanel: function () {
		return this.pageLib.ViewPanel();
	},

	ViewIndex: function() {
		return this.pageLib.ViewIndex();
	},

	SetHeaderStyle: function(isMain) {
		isMain = (typeof(isMain) === "boolean") ? isMain : false;

		if (isMain) {
			this.$header.addClass("main");
			this.$header.find("div.btn_wrap > button.mute").show();
			this.$header.find("div.btn_wrap > button.notice").show();
			this.$custList.show();
		}
		else {
			this.$header.removeClass("main");
			this.$header.find("div.btn_wrap > button.mute").hide();
			this.$header.find("div.btn_wrap > button.notice").hide();
			this.$custList.hide();
		}
	},

	/**
	 * 메인페이지로 이동
	 */
	GoMain: function () {
		this.SetHeaderStyle(true);
		this.MenuToggle(false);

		const $item = this.$menu.find("ul.left li:first");
		if ($item.length === 0) return;

		this.pageLib.Clear();

		this.pageLib.View({
			menuID: $item.attr("data-id"),
			title: $item.html(),
			url: $item.attr("data-link"),
			urlParam: {}
		}, true);
	},

	GoPage: function (el) {
		if (!el) return;
		const $el = $(el);
		if ($el.length === 0) return;

		this.MenuToggle(false);

		const menuID = $el.attr("data-id");
		const menuLink = $el.attr("data-link");

		if (menuID === "SpecificationsView") {
			__OpenBrowser("http://www.booster.co.kr/html/information05.asp?bbs=specification_reference");
		}
		else if (menuID === "PDFViewer") {
			if (isIOS()) {
				__OpenBrowser("https://apps.apple.com/kr/app/adobe-acrobat-reader/id469337564");
			}
			else {
				__OpenBrowser("https://play.google.com/store/apps/details?id=com.adobe.reader&hl=ko");
			}
		}
		else {
			this.pageLib.Clear();
			this.Open(menuID, $el.html(), menuLink, {});
		}
	},

	/**
	 * Page Open
	 */
	Open: function (menuID, pageTitle, pageURL, pageParam) {
		if (pageURL.length === 0) {
			return;
		}

		this.SetHeaderStyle(menuID === "Main");

		this.pageLib.View({
			menuID: menuID,
			title: pageTitle,
			url: pageURL,
			urlParam: pageParam
		}, false);
	},

	/**
	 * Socket Client 연결
	 */
	SocketConnenct: function() {
		var oThis = this;

		this.socket = io.connect( __Socket_URL, { transports: ['websocket'] });

		this.socket.on("connect", function() {
			console.log("socket.io", "connect");
			oThis.socket.emit("/key", Global.KEY);
		});
	}
};