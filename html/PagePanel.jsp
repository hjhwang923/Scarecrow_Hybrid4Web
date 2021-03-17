<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	response.setHeader("Cache-Control","no-store");
	response.setHeader("Pragma","no-cache");
	response.setDateHeader("Expires",0);
	if (request.getProtocol().equals("HTTP/1.1")) response.setHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
	<title>부스타</title>
	<link rel="stylesheet" type="text/css" href="/css/reset.css?v=1.0" />
	<link rel="stylesheet" type="text/css" href="/css/style.css?v=1.0" />
	<link rel="stylesheet" type="text/css" href="/css/common.css?v=1.0" />
	<link rel="stylesheet" type="text/css" href="/css/loading.css?v=1.0" />
	<link rel="stylesheet" type="text/css" href="/css/customSwitch.css?v=1.0" />
	<link rel="stylesheet" type="text/css" href="/scripts/calendarLib/calendarLib.css?v=1.0" />
	<link rel="stylesheet" type="text/css" href="/sweetalert/sweetalert.css?v=1.0" />
	<style type="text/css">
		#contents {position:relative; width:100%; height:calc(100% - 50px);}
	</style>
</head>

<body>

<div class="wrap">
	<div id="contents">
		<div class="button_wrap">
			<button>음성 녹음</button>
		</div>


	</div>
</div>

<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=64a23e73e4d379ad3f5f158a6c56127a&libraries=clusterer"></script>
<script type="text/javascript" src="/scripts/LAB.min.js?v=1.0"></script>
<script type="text/javascript">
	const pageLoaderOption = {
		pageLogic: ["PagePanel.js"]
	};
</script>
<script type="text/javascript" src="/scripts/common.js?v=1.0"></script>
<script type="text/javascript">
	function Application_Init() {
		PagePanel.Init();
	}
</script>

</body>

</html>