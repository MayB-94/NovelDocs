<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/tiles/preset.jsp" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${titleString }</title>
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/initializer.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/utils/poplet.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/utils/modalet.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/utils/calendar.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/layout.js"></script>
<link rel="stylesheet" href="https://unpkg.com/sanitize.css">
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/initializer.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/preference.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/presets.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/utils/poplet.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/utils/poplet-NovelDocs.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/utils/modalet.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/utils/modalet-NovelDocs.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/utils/calendar.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/layout.css">
<tiles:insertAttribute name="include"/>
</head>
<body>
	<header>
		<tiles:insertAttribute name="header"/>
	</header>
	<aside>
		<tiles:insertAttribute name="aside"/>
	</aside>
	<main>
		<tiles:insertAttribute name="main"/>
	</main>
	<footer>
		<tiles:insertAttribute name="footer"/>
	</footer>
</body>
</html>