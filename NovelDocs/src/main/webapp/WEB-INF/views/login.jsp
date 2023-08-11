<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/tiles/preset.jsp" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>로그인 - NovelDocs</title>
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/initializer.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/utils/poplet.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/utils/modalet.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/utils/calendar.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/login.js"></script>
<link rel="stylesheet" href="https://unpkg.com/sanitize.css">
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/preference.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/presets.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/utils/poplet.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/utils/poplet-NovelDocs.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/utils/modalet.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/utils/modalet-NovelDocs.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/utils/calendar.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/css/login.css">
</head>
<body>
	<main>
		<form action="/loginProc" method="post">
			<div class="form-container">
				<a class="logo pixeboy" href="${pageContext.request.contextPath }">NovelDocs</a>
				<div class="form-group">
					<input type="text" name="username" id="username" size="0" required autofocus>
					<label for="username">아이디</label>
				</div>
				<div class="form-group">
					<input type="password" name="password" id="password" size="0" required>
					<label for="username">비밀번호</label>
				</div>
				<button type="submit" role="login">
					<span>로그인</span>
				</button>
				<button type="button" role="guest" onclick="location.href = getContext() + '/docs/guest'">
					<span>게스트 로그인</span>
				</button>
			</div>
		</form>
	</main>
</body>
</html>