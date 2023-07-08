package com.mayb.NovelDocs.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;

import com.mayb.NovelDocs.security.UserDetailsImpl;

import lombok.extern.slf4j.Slf4j;

/**
 * 로그인 성공 시의 Handler
 * 로그인 페이지 직접 접속 후 인증 성공 시 redirectURL로 이동
 * 이전 접속 정보가 있을 경우 이전 접속한 URL로 이동
 * 인증 성공한 member의 정보를 세션에 저장
 * @author MayB
 * @since 2023/06/11
 */
@Component
@Slf4j
public class UserLoginSuccessHandler implements AuthenticationSuccessHandler {
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
		// Instance that has request information before interception by Security
		RequestCache requestCache = new HttpSessionRequestCache();
		SavedRequest savedRequest = requestCache.getRequest(request, response);
		// redirectURL default value for moving directly login page
		String redirectURL = "/";
		// Instance for setting logined member information
		UserDetailsImpl userDetails = (UserDetailsImpl)authentication.getPrincipal();
		
		// Login when lack of authority
		if (savedRequest != null) {
			// Redirect to previous URL before interception by Security
			redirectURL = savedRequest.getRedirectUrl();
			// Session clearing for preventing memory leak
			requestCache.removeRequest(request, response);
		}
		// Save logined member information in session
		HttpSession session = request.getSession();
		session.setAttribute("user", userDetails.getUser());
		session.setAttribute("user_id", userDetails.getUser().getId());
		log.info("[onAuthenticationSuccess] user : {}", userDetails.getUser());
		response.sendRedirect(redirectURL);
	}
}
