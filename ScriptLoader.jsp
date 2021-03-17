<%@ page import="java.io.*" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="common.jsp" %>
<%
	response.setHeader("Cache-Control","no-store");   
	response.setHeader("Pragma","no-cache");   
	response.setDateHeader("Expires",0);   
	if (request.getProtocol().equals("HTTP/1.1")) response.setHeader("Cache-Control", "no-cache");

	String menuCode = CommonFunc.getParam(request, "code", "");
	String menuLink = CommonFunc.getParam(request, "link", "");

	if (!CommonFunc.isNum(menuCode)) {
		menuCode = CommonFunc.getParam(request, "id", "");
	}

	if (CommonFunc.isNull(menuLink)) {
		menuLink = "";
	}

	if (menuCode.length() > 0 && menuLink.length() > 0) {
		StringBuilder responseStr = new StringBuilder();
		responseStr.setLength(0);

		String pageURL = menuLink;

		if (menuLink.contains(".html")) {
			pageURL = menuLink.substring(0, menuLink.indexOf(".html"));
		}

		String pageName = pageURL;
		if (pageURL.lastIndexOf("/") > -1) pageName = pageURL.substring(pageURL.lastIndexOf("/") + 1);

		ServletContext context = getServletContext();
		String uploadPath = context.getRealPath("/") + "/";
		String pagePath = uploadPath + pageURL + ".js";
		
		BufferedReader reader = null;

		try {
			File file =  new File(pagePath);
			reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8));
			String line = null;

			while (true) {
				line = reader.readLine();
				if (line == null) break;
				responseStr.append(line + "\r\n");
			}
		}
		catch (Exception ex) {
			responseStr.setLength(0);
		}

		try { if (reader != null) reader.close(); } catch (Exception ignored) {}

		if (responseStr.capacity() > 0) {
			String outStr = responseStr.toString();
			outStr = outStr.replace("var " + pageName + " = {", "var " + pageName + "_" + menuCode + " = {");
			outStr = outStr.replace(pageName + " = {", pageName + "_" + menuCode + " = {");

			PrintWriter printWriter = response.getWriter();
			printWriter.print(outStr);
			printWriter.close();
		}

		responseStr.setLength(0);
	}
%>