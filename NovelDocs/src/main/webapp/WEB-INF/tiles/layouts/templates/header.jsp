<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/tiles/preset.jsp" %>
<div class="header-left">
	<button type="button" class="toggle side-toggle" data-toggle="false">
		<svg class="stroke-subtheme-font">
			<path />
		</svg>
	</button>
	<span class="doc-title">${doc != null ? doc.title : '제목없는 문서' }</span>
</div>
<div class="header-right">
	
	<c:if test="${loginUser != null }">
		<button type="button" class="header-right-button logout-button">
			<svg>
				<path/>
			</svg>
		</button>
	</c:if>
</div>