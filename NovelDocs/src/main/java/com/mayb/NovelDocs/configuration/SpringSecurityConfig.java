package com.mayb.NovelDocs.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

/**
 * Security Configuration File
 * @author MayB
 * @since 2023/06/11
 */
@Configuration
@EnableWebSecurity
public class SpringSecurityConfig {
	@Autowired
	private AuthenticationSuccessHandler userLoginSuccessHandler;
	@Autowired
	private AuthenticationEntryPoint gamersAuthenticationEntryPoint;
	@Autowired
	private AuthenticationFailureHandler userLoginFailureHandler;
	@Autowired
	private AccessDeniedHandler gamersAccessDeniedHandler;
	@Autowired
	private UserDetailsService userDetailsServiceImpl;
	
	@Bean
	protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.httpBasic().disable()
			 .csrf().disable()
			 .cors()
			 .and()
			 // 인증 허용 범위 설정
			 .authorizeHttpRequests()
			 	.antMatchers("/images/**").permitAll() // static resources 인증 제외
			 	.antMatchers("/login").permitAll()
			 	.antMatchers("/not-authorized").permitAll()
			 	.antMatchers("/").authenticated()
			 	.antMatchers("/docs/guest").permitAll()
			 	.antMatchers("/novel/**").authenticated()
			 	.anyRequest().permitAll()
			 .and()
			 // exceptionHandling 설정
			 .exceptionHandling()
			 	.authenticationEntryPoint(gamersAuthenticationEntryPoint)
			 	.accessDeniedHandler(gamersAccessDeniedHandler)
			 .and()
			 // 로그인 설정
			 .formLogin()
			 	.loginPage("/login") // custom 로그인 페이지 설정
			 	.loginProcessingUrl("/loginProc")
			 	.usernameParameter("username")
			 	.passwordParameter("password")
			 	.successHandler(userLoginSuccessHandler)
			 	.failureHandler(userLoginFailureHandler)
			 .and()
			 // 로그아웃 설정
			 .logout()
			 	.logoutUrl("/logout")
			 	.logoutSuccessUrl("/")
			 .and()
			 .rememberMe()
			 	.key("secret")
			 	.rememberMeParameter("remember")
			 	.tokenValiditySeconds(600)
			 	.alwaysRemember(false)
			 	.userDetailsService(userDetailsServiceImpl)
			 	.authenticationSuccessHandler(userLoginSuccessHandler);
		return http.build();
	}
}
