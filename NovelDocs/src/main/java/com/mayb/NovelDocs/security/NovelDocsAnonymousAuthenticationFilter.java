package com.mayb.NovelDocs.security;

import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;

import com.mayb.NovelDocs.model.User;

public class NovelDocsAnonymousAuthenticationFilter extends AnonymousAuthenticationFilter {
	private static final String USER_SESSION_KEY = "user";
	private final String key;
	
	public NovelDocsAnonymousAuthenticationFilter(String key) {
		super(key);
		this.key = key;
	}
	
	@Override
	protected Authentication createAuthentication(HttpServletRequest request) {
		//return super.createAuthentication(request);
		HttpSession httpSession = request.getSession();
		UserDetailsImpl user = Optional.ofNullable((UserDetailsImpl)httpSession.getAttribute(USER_SESSION_KEY))
												.orElseGet(() -> {
													User anonymousUser = new User();
													String clientIp = request.getHeader("X-Forwarded-For");
												    if (clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
												        //Proxy 서버인 경우
												        clientIp = request.getHeader("Proxy-Client-IP");
												    }
												    if (clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
												        //Weblogic 서버인 경우
												        clientIp = request.getHeader("WL-Proxy-Client-IP");
												    }
												    if (clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
												        clientIp = request.getHeader("HTTP_CLIENT_IP");
												    }
												    if (clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
												        clientIp = request.getHeader("HTTP_X_FORWARDED_FOR");
												    }
												    if (clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
												        clientIp = request.getRemoteAddr();
												    }
													anonymousUser.setId(clientIp);
													UserDetailsImpl anonymous = new UserDetailsImpl(anonymousUser);
													httpSession.setAttribute(USER_SESSION_KEY, anonymous);
													return anonymous;
												});
		return new AnonymousAuthenticationToken(key, user, AuthorityUtils.createAuthorityList("ROLE_GUEST"));
	}
}
