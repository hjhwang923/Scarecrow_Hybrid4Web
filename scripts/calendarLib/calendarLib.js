var CalendarLib = {
    $box: null,
    $targetEL: null,
    viewType: null,
    monthLastDay: null,
    currentDate: null,
    minDate: null,
    maxDate: null,
    callbackFunc: null,

	/*
		el : 클릭되는 객체
		targetEL : 입력되는 InputBox ID명
		viewType : 보여주는 방식 S:한개 D:두개
		minDate : 입력을 못하게 하는 최소날짜 ex) 2012-03-30
		maxDate : 입력을 못하게 하는 최대날짜 ex) 2012-04-05
	*/
	open: function(el, targetEL, viewType, minDate, maxDate, callbackFunc) {
	    this.$targetEL = $("#" + targetEL);
	    if ( typeof(callbackFunc) == "function" ) this.callbackFunc = callbackFunc;
	    if (this.$targetEL.length === 0)  return false;

		this.viewType = "S";

	    this.createBox();
	    this.currentDate = [];

	    //참조객체의 이전 선택된 날짜가 있으면 해당 년월을 시작지점으로 설정
	    if (this.isDate(this.$targetEL.val())) {
	        var checkString = this.$targetEL.val().split("-");

	        // parseInt로 변경시 앞에 0이 있으면 제거, 제거를 안하면 0으로 변경됨
	        for (var i = -1; ++i < checkString.length; ) {
	            if (checkString[i].substr(0, 1) == "0")
	                checkString[i] = checkString[i].substr(1);
	        }

	        this.currentDate.push(new Date(parseInt(checkString[0]), parseInt(checkString[1]) - 1, 1));
	    }
	    else {
	        this.currentDate.push(new Date());
	    }

	    this.currentDate.push(new Date(this.currentDate[0].getFullYear(), this.currentDate[0].getMonth() + 1, 1));

	    //최소날짜 확인
	    if (minDate == "T") {
	    	// 오늘날짜 지정
	    	this.minDate = new Date();
	    }
	    else if (this.isDate(minDate)) {
	        this.minDate = this.convertDate(minDate);
	    }
	    else
	        this.minDate = null;

	    //최대날짜 확인
	    if (maxDate == "T") {
	    	// 오늘날짜 지정
	    	this.maxDate = new Date();
	    }
	    else if (this.isDate(maxDate)) {
	        this.maxDate = this.convertDate(maxDate);
	    }
	    else
	        this.maxDate = null;

	    this.$box.show();
	    this.genDate();

	    //달력 위치값 설정
	    var pos = $(el).offset();
	    var boxWidth = this.$box.width();
	    var boxHeight = this.$box.height();
	    var bodyWidth = $(document).width();
	    var bodyHeight = $(document).height();

	    if ((boxHeight + pos.top) >= bodyHeight) pos.top = pos.top - ((boxHeight + pos.top + 50) - bodyHeight);
	    if ((boxWidth + pos.left + 50) >= bodyWidth) pos.left = pos.left - ((boxWidth + pos.left + 50) - bodyWidth);
	    this.$box.css({ "top": pos.top, "left": pos.left });
	},

	close: function() {
        if (this.$box === null) return;
	    this.$box.hide("fast");
	},

    //달력박스 생성 및 전역변수 초기화
    createBox: function() {
        this.monthLastDay = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31); //각 달별 마지막날 저장

        if (!this.$box) {
            this.$box = $(document.createElement("div"));
            this.$box.attr("id", "CalendarBox");
            this.$box.css("display", "none");
            $("body").append(this.$box);
        }
        else
            this.$box.empty();

        if (this.viewType == "S")
            this.$box.css("width", "245");
        else
            this.$box.css("width", "470");

		// 이미지경로 설정
        var imageURL = "/scripts/calendarLib/";
        var html = "<div class=\"Header\">" +
                    "<form>" +
                    "<img onclick=\"CalendarLib.moveMonth('P')\" src=\"" + imageURL + "btn_pre.gif\" width=\"16\" height=\"16\" alt=\"Previous Month\" />&nbsp;" +
                    "<select size=\"1\" onchange=\"CalendarLib.directMove()\"></select>&nbsp;&nbsp;<select size=\"1\" onchange=\"CalendarLib.directMove()\"></select>" +
                    "&nbsp;<img onclick=\"CalendarLib.moveMonth('N')\" src=\"" + imageURL + "btn_next.gif\" width=\"16\" height=\"16\" alt=\"Next Month\" />" +
                    "</form>";

        if (this.viewType == "S")
            html += "<p style=\"display:none;\">";
        else
            html += "<p>";

        html += "<strong></strong>. <strong></strong></p></div>" +
                "<div class=\"clear\"></div>";

        this.$box.html(html);

        html = this.$box.html() + "<div class=\"ListBox\">";

        if (this.viewType == "S")
            html += "<table style=\"margin-right:0;\" ";
        else
            html += "<table ";

        html += "cellspacing=\"0\" cellpadding=\"0\" border=\"0\">" +
                "<thead>" +
                "<tr>" +
                "<th class=\"Sun\">SUN</th>" +
                "<th>MON</th>" +
                "<th>TUE</th>" +
                "<th>WED</th>" +
                "<th>THU</th>" +
                "<th>FRI</th>" +
                "<th class=\"Sat\">SAT</th>" +
                "</tr>" +
                "</thead>" +
                "<tbody></tbody>" +
                "</table>";

        if (this.viewType == "S")
            html += "<table style=\"display:none;\"";
        else
            html += "<table ";

        html += "class=\"Right\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">" +
                "<thead>" +
                "<tr>" +
                "<th class=\"Sun\">SUN</th>" +
                "<th>MON</th>" +
                "<th>TUE</th>" +
                "<th>WED</th>" +
                "<th>THU</th>" +
                "<th>FRI</th>" +
                "<th class=\"Sat\">SAT</th>" +
                "</tr>" +
                "</thead>" +
                "<tbody></tbody>" +
                "</table>" +
                "</div>" +
                "<div class=\"clear\"></div>";

        this.$box.html(html);

        html = this.$box.html() + "<div class=\"Btn\"><img onclick=\"CalendarLib.close()\" style=\"cursor:pointer;\" src=\"" + imageURL + "btn_close.gif\" width=\"50\" height=\"18\" alt=\"Close\" /></div>";
        this.$box.html(html);
    },

    genDate: function() {
        var currentYear = this.currentDate[0].getFullYear();
        var currentMonth = this.currentDate[0].getMonth() + 1;
        var html, i;
        var $selectEL = this.$box.find(".Header select");
        var $strongEL = this.$box.find(".Header strong");
        var $tableEL = this.$box.find("table");

        html = "";
        
        for (i = currentYear - 3; i < currentYear + 4; i++) {
            html = html + "<option value=\"" + i + "\"";
            if (i == currentYear) html = html + " selected=\"selected\"";
            html = html + ">" + i + "</optoin>";
        }

        $selectEL.eq(0).html(html);

        html = "";
        for (i = 1; i < 13; i++) {
            html = html + "<option value=\"" + i + "\"";
            if (i == currentMonth) html = html + " selected=\"selected\"";
            html = html + ">" + i + "</option>";
        }

        $selectEL.eq(1).html(html);
        $strongEL.eq(0).text(this.currentDate[1].getFullYear());
        $strongEL.eq(1).text(this.currentDate[1].getMonth() + 1);

        var oThis = this;
        var nowDate = new Date(), checkDate;
        var currentLastDay, startPos;
        var j, counter, $tr, $td, prtDay, linkOK, dateDiffCnt;

        for (var seq = 0; seq < this.currentDate.length; seq++) {
            currentYear = this.currentDate[seq].getFullYear();
            currentMonth = this.currentDate[seq].getMonth() + 1;
            currentLastDay = this.monthLastDay[currentMonth - 1];

            //윤년계산
            if (currentMonth == 2) {
                if ((currentYear % 400) === 0)
                    currentLastDay = 29;
                else if (((currentYear % 4) === 0) && ((currentYear % 100) > 0))
                    currentLastDay = 29;
            }

            //첫날에 요일 가져오기
            startPos = new Date(currentYear, currentMonth - 1, 1).getDay();

            //가로 7 , 세로 5~6
            counter = 0;
            $tableEL.eq(seq).find("tbody").empty();

            for (i = 0; i < 6; i++) {
                $tr = $(document.createElement("tr"));

                for (j = 0; j < 7; j++) {
                    $td = $(document.createElement("td"));

                    //해당 월의 1일의 시작요일 이하면 공백출력하고 넘어가면 그때부터 일수를 출력함
                    if ((i === 0) && (j < startPos)) {
                        prtDay = "&nbsp;";
                    }
                    else {
                        linkOK = true;
                        ++counter;

                        //해당 달의 마지막날 이전까지만 일수 출력
                        if (counter <= currentLastDay) {
                            checkDate = new Date(currentYear, currentMonth - 1, counter);

                            //해당 요일에 CSS 클래스부여, 일요일:Sun, 토요일:Sat
                            switch (checkDate.getDay()) {
                                case 0:
                                    $td.addClass("Sun");
                                    break;
                                case 6:
                                    $td.addClass("Sat");
                                    break;
                            }

                            //현재일 표시
                            if ((currentYear == nowDate.getFullYear()) && (currentMonth == nowDate.getMonth() + 1) && (counter == nowDate.getDate())) {
                                $td.addClass("Today");
                            }

                            //최소날짜 확인
                            if (this.minDate !== null) {
                                dateDiffCnt = Math.ceil((checkDate.getTime() - this.minDate.getTime()) / (1000 * 60 * 60 * 24));
                                if (dateDiffCnt < 0) linkOK = false;
                            }

                            //최대날짜 확인
                            if (this.maxDate !== null) {
                                dateDiffCnt = Math.ceil((checkDate.getTime() - this.maxDate.getTime()) / (1000 * 60 * 60 * 24));
                                if (dateDiffCnt > 0) linkOK = false;
                            }

                            if (linkOK) {
                                $td.attr("year", currentYear);
                                $td.attr("month", currentMonth);
                                $td.attr("day", counter);
                                $td.bind("click", function() { oThis.insert(this); });
                                $td.bind("mouseenter", function() { $(this).addClass("Focus"); });
                                $td.bind("mouseout", function() { $(this).removeClass("Focus"); });
                            }
                            else {
                                $td.removeClass("Sun");
                                $td.removeClass("Sat");
                                $td.addClass("Disabled");
                            }

                            prtDay = counter;
                        }
                        else {
                            i = 6;
                            prtDay = "&nbsp;";
                        }
                    }

                    $td.html(prtDay);
                    $tr.append($td);
                }

                if (counter == currentLastDay) i = 6;
                $tableEL.eq(seq).find("tbody").append($tr);
            }
        }
    },

    directMove: function() {
        var $selectEL = this.$box.find(".Header select");
        var selectYear = parseInt($selectEL.eq(0).find("option:selected").val());
        var selectMonth = parseInt($selectEL.eq(1).find("option:selected").val());

        this.currentDate[0] = new Date(selectYear, selectMonth - 1, 1);
        this.currentDate[1] = new Date(this.currentDate[0].getFullYear(), this.currentDate[0].getMonth() + 1, 1);
        this.genDate();
    },

    moveMonth: function(tag) {
        var directMethod;

        if (tag == "P")
            directMethod = -1;
        else
            directMethod = 1;

        this.currentDate[0] = new Date(this.currentDate[0].getFullYear(), (this.currentDate[0].getMonth() + directMethod), 1);
        this.currentDate[1] = new Date(this.currentDate[0].getFullYear(), this.currentDate[0].getMonth() + 1, 1);
        this.genDate();
    },

    insert: function(el) {
        if (!el) return false;
        el = $(el);
        var selYear = el.attr("year");
        var selMonth = el.attr("month");
        var selDay = el.attr("day");

        if (selMonth.length < 2) selMonth = "0" + selMonth;
        if (selDay.length < 2) selDay = "0" + selDay;

        // Callback 확인
        if (typeof(this.callbackFunc) == "function") {
        	this.callbackFunc(selYear, selMonth, selDay, this.$targetEL.attr("id"));
        }
        this.$targetEL.val(selYear + "-" + selMonth + "-" + selDay);
        this.close();
    },

    isDate: function(s) {
        var tmp, checkString = new Array(3);
        var checkDate;

        if (!s) return false;
        tmp = s.split("-");

        if (tmp.length == 3) {
            for (var i = 0; i < checkString.length; i++) {
                tmp[i] = String(tmp[i]);

                if (tmp[i].length == 2) {
                    if (tmp[i].substr(0, 1) == "0")
                        tmp[i] = tmp[i].substr(1);
                }

                checkString[i] = parseInt(String(tmp[i]));
                if (isNaN(checkString[i])) checkString[i] = 0;
            }

            checkDate = new Date(checkString[0], checkString[1] - 1, checkString[2]);

            if ((checkDate.getFullYear() == checkString[0] && (checkDate.getMonth() + 1) == checkString[1] && checkDate.getDate() == checkString[2]))
                return true;
            else
                return false;
        }
        else
            return false;
    },

    convertDate: function(s) {
        var tmp, checkString = new Array(3);
        var checkDate;

        tmp = s.split("-");

        for (var i = 0; i < checkString.length; i++) {
            tmp[i] = String(tmp[i]);

            if (tmp[i].length == 2) {
                if (tmp[i].substr(0, 1) == "0")
                    tmp[i] = tmp[i].substr(1);
            }

            checkString[i] = parseInt(String(tmp[i]));
        }

        checkDate = new Date(checkString[0], checkString[1] - 1, checkString[2]);
        return checkDate;
    },

    PrtDate: function(d) {
    	var prtString = d.getFullYear() + "-";
    	var month = d.getMonth() + 1;
    	var day = d.getDate();

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
};