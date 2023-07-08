package com.mayb.NovelDocs.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.mayb.NovelDocs.interceptor.ErrorInterceptor;
import com.mayb.NovelDocs.interceptor.LayoutInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	@Bean
	public LayoutInterceptor layoutInterceptor() { return new LayoutInterceptor(); }
	@Bean
	public ErrorInterceptor errorInterceptor() { return new ErrorInterceptor(); }
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		//WebMvcConfigurer.super.addInterceptors(registry);
		registry.addInterceptor(layoutInterceptor()).addPathPatterns("/**").excludePathPatterns("/css/**", "/static/**", "/js/**");
		registry.addInterceptor(errorInterceptor()).addPathPatterns("/**");
	}
}
