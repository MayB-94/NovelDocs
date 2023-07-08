<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/tiles/preset.jsp" %>
<div class="docs-editor">
	<div class="editor-header">
		<div class="editor-header-item">
			<span class="editor-header-label">크기</span>
			<select class="editor-header-select" role="font-size">
				<c:forEach var="size" begin="8" end="50">
					<option value="${size }px">${size }px</option>
				</c:forEach>
			</select>
		</div>
		<div class="editor-header-item">
			<span class="editor-header-label">글꼴</span>
			<select class="editor-header-select" role="font-family">
				<c:set var="fonts" value="Arial,Arial Black,Bahnschrift,Calibri,Cambria,Cambria Math,Candara,Comic Sans MS,Consolas,Constantia,Corbel,Courier New,Ebrima,Franklin Gothic Medium,Gabriola,Gadugi,Georgia,HoloLens MDL2 Assets,Impact,Ink Free,Javanese Text,Leelawadee UI,Lucida Console,Lucida Sans Unicode,Malgun Gothic,Marlett,Microsoft Himalaya,Microsoft JhengHei,Microsoft New Tai Lue,Microsoft PhagsPa,Microsoft Sans Serif,Microsoft Tai Le,Microsoft YaHei,Microsoft Yi Baiti,MingLiU-ExtB,Mongolian Baiti,MS Gothic,MV Boli,Myanmar Text,Nirmala UI,Palatino Linotype,Segoe MDL2 Assets,Segoe Print,Segoe Script,Segoe UI,Segoe UI Historic,Segoe UI Emoji,Segoe UI Symbol,SimSun,Sitka,Sylfaen,Symbol,Tahoma,Times New Roman,Trebuchet MS,Verdana,Webdings,Wingdings,Yu Gothic,American Typewriter,Andale Mono,Arial Narrow,Arial Rounded MT Bold,Arial Unicode MS,Avenir,Avenir Next,Avenir Next Condensed,Baskerville,Big Caslon,Bodoni 72,Bodoni 72 Oldstyle,Bodoni 72 Smallcaps,Bradley Hand,Brush Script MT,Chalkboard,Chalkboard SE,Chalkduster,Charter,Cochin,Copperplate,Courier,Didot,DIN Alternate,DIN Condensed,Futura,Geneva,Gill Sans,Helvetica,Helvetica Neue,Herculanum,Hoefler Text,Lucida Grande,Luminari,Marker Felt,Menlo,Monaco,Noteworthy,Optima,Palatino,Papyrus,Phosphate,Rockwell,Savoye LET,SignPainter,Skia,Snell Roundhand,Times,Trattatello,Zapfino"/>
				<c:forTokens var="ff" items="${fonts }" delims=",">
					<option value="${ff }" style="font-family: ${ff};">${ff }</option>
				</c:forTokens>
			</select>
		</div>
		<div class="editor-header-item toggle-group">
			<button type="button" class="toggle editor-header-toggle" role="font-weight" role-value="bold">
				<span style="font-size: 14px; font-weight: bold;">B</span>
			</button>
			<button type="button" class="toggle editor-header-toggle" role="font-style" role-value="italic">
				<span style="font-size: 14px; font-style: italic;">I</span>
			</button>
			<button type="button" class="toggle editor-header-toggle" role="text-decoration" role-value="underline">
				<span style="font-size: 14px; text-decoration: underline;">U</span>
			</button>
		</div>
		<!-- <button type="button" onclick="Modalet.show({ content: '모달 테스트' })">모달 TEST</button> -->
	</div>
	<textarea class="content" style="font-size: 14px;">${docs.content }</textarea>
</div>