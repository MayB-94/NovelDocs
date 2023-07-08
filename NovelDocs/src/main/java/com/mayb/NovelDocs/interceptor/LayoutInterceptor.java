package com.mayb.NovelDocs.interceptor;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.mayb.NovelDocs.security.UserDetailsImpl;

public class LayoutInterceptor implements HandlerInterceptor {
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		return true;
		//return HandlerInterceptor.super.preHandle(request, response, handler);
	}
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
		try { modelAndView.addObject("now", new Date()); }
		catch(Exception e) { }
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			if (authentication != null) {
				Object memberDetails = authentication.getPrincipal();
				if (memberDetails != null) {
					modelAndView.addObject("loginUser", ((UserDetailsImpl)memberDetails).getUser());
				}
			}
		} catch(Exception e) { }
		//HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
	}
}
