package com.mayb.NovelDocs.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * 권한이 필요한 resources에 권한이 없는 유저가 접속을 시도했을 때 실행
 * 이전 페이지 없이 바로 접근 시 로그인페이지, 그 외 접근 시 이전 페이지로 prevURL을 저장하여 front에 전달 리다이렉트
 * 403 에러페이지에서 이전 페이지로 이동하도록 설정
 * @author MayB
 * @since 2023/06/11
 */
@Component
@Slf4j
public class NovelDocsAccessDeniedHandler implements AccessDeniedHandler {
	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
		log.info("[handle] accessDeniedException : {}", accessDeniedException.getMessage());
		RequestCache requestCache = new HttpSessionRequestCache();
		SavedRequest savedRequest = requestCache.getRequest(request, response);
		String defaultURL = "/login";
		String redirectURL = "/not-authorized";
		if (savedRequest != null) request.getSession().setAttribute("prevURL", savedRequest.getRedirectUrl());
		else request.getSession().setAttribute("prevURL", defaultURL);
		if (isAjaxRequest(request)) response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied");
		else response.sendRedirect(redirectURL);
	}
	private boolean isAjaxRequest(HttpServletRequest request) {
		return "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
	}
}
