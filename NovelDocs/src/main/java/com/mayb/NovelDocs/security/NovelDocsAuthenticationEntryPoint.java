package com.mayb.NovelDocs.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * 인증이 필요한 resources에 인증되지 않은 사용자가 접근하려할 때 실행
 * UNAUTHORIZED 리턴 => 로그인페이지에 메시지 출력
 * @author MayB
 * @since 2023/06/11
 */
@Component
@Slf4j
public class NovelDocsAuthenticationEntryPoint implements AuthenticationEntryPoint {
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
		log.info("[commence] authException : {}", authException.getMessage());
		int errorCode = HttpStatus.UNAUTHORIZED.value();
		String redirectURL = "/login?error=";
		response.sendRedirect(redirectURL + errorCode);
	}
}
