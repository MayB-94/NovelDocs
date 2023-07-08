<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/tiles/preset.jsp" %>
<div class="recent-docs">
	<div class="header">
		<div class="header-left">
			<span class="header-title">최근 열어본 문서</span>
		</div>
		<div class="header-right">
			
		</div>
	</div>
	<div class="content">
		<c:forEach var="openfile" items="${openfiles }">
			<div class="recent-item">
				<span class="recent-item-title">${openfile.docs.title }</span>
				<div class="recent-item-path">
					<span>${openfile.docs.virtual_dir }</span>
				</div>
				<span class="recent-item-reguser">${openfile.docs.reguser.nickname }</span>
				<span class="recent-item-opendate"><fmt:formatDate value="${openfile.opendate }" pattern="yy-MM-dd HH:mm"/></span>
			</div>
		</c:forEach>
	</div>
</div>
<div class="docs-explorer">
	<div class="header">
		<div class="header-left">
			<span class="header-title">탐색</span>
		</div>
		<div class="header-right">
			<button type="button" class="explorer-manipulate explorer-new">
				<span>새 문서</span>
			</button>
		</div>
	</div>
	<div class="explorer-path">
		<span class="explorer-path-item" data-path="/">root</span>
	</div>
	<div class="content-header">
		<span>이름</span>
		<!-- <span>마지막으로 수정한 시각</span> -->
		<span>마지막 수정 시각</span>
	</div>
	<div class="content">
		<c:forEach var="subdirectory" items="${subdirectories }">
			<div class="explorer-item" data-type="folder" data-name="${subdirectory.name }" data-selected="false">
				<div class="explorer-item-left">
					<svg>
						<text text-anchor="middle" x="256" y="320">📁</text>
					</svg>
					<span class="explorer-item-title">${subdirectory.name }</span>
				</div>
				<div class="explorer-item-right">
					
				</div>
			</div>
		</c:forEach>
		<c:forEach var="doc" items="${docs }">
			<div class="explorer-item" data-type="file" data-name="${doc.title }" data-selected="false">
				<div class="explorer-item-left">
					<svg>
						<text text-anchor="middle" x="256" y="320">txt</text>
					</svg>
					<span class="explorer-item-title">${doc.title }</span>
				</div>
				<div class="explorer-item-right">
					<span class="explorer-item-lastdate"><fmt:formatDate value="${doc.lastdate }" pattern="yyyy-MM-dd HH:mm"/></span>
				</div>
			</div>
		</c:forEach>
</div>