package com.office.myorganizeruser.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;

import com.office.myorganizeruser.member.MemberAccessDeniedHandler;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Configuration
@EnableWebSecurity
public class SpringSecurityConfig {

	@Bean PasswordEncoder passwordEncoder() {
		log.info("passwordEncoder()");
		
		return new BCryptPasswordEncoder();
	}
	
	@Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		
		http
			.cors(cors -> cors.disable())
			.csrf(csrf -> csrf.disable());
		
		http
			.authorizeHttpRequests(auth -> auth
					.requestMatchers(
							"/css/**",
							"/img/**",
							"/js/**",
							"/",
							"/member/memberSignUp",
							"/member/memberSignUpConfirm",
							"/member/memberSignIn",
							"/member/memberSignInConfirm",
							"/member/memberSignInResult"
							).permitAll()
					.requestMatchers("/plan/**").hasRole("USER_APPROVED")
					.anyRequest().authenticated());
		
		
		http
			// 권한이 없을 경우 이동 페이지.
			.exceptionHandling(exceptionConfig -> exceptionConfig
					.accessDeniedHandler(new MemberAccessDeniedHandler()));
//					.accessDeniedPage("/member/accessDeniedPage"));
		
		http
			.formLogin(login -> login
					.loginPage("/member/memberSignIn")
					.loginProcessingUrl("/member/memberSignInConfirm")
					.usernameParameter("m_id")
					.passwordParameter("m_pw")
					.successHandler((request, response, authentication) -> {
						log.info("MEMBER SIGNIN SUCCESS HANDLER!");
						
						String targetURL = "/member/memberSignInResult?logined=true";
						
						RequestCache requestCache = new HttpSessionRequestCache();
						SavedRequest savedRequest = requestCache.getRequest(request, response);
						if(savedRequest != null) {
							targetURL = savedRequest.getRedirectUrl();
							requestCache.removeRequest(request, response);
						}
						response.sendRedirect(targetURL);
						
					})
					.failureHandler((request, response, exception) -> {
						log.info("MEMBER SIGNIN FAILURE HANDLER!"); 
						log.info("exception : " + exception); 
						response.sendRedirect("/member/memberSignInResult?logined=false");
						
					}));
		
		http
			.logout(logout -> logout
					.logoutUrl("/member/memberSignOutConfirm")
					.logoutSuccessHandler((request, response, authentication) -> {
						log.info("MEMBER SIGNOUT SUCCESS");
						
						response.sendRedirect("/");
						
					}));
		
		return http.build();
	}
	
	
}
