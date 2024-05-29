package com.office.myorganizeruser.member;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class MemberAccessDeniedHandler implements AccessDeniedHandler {

	// 권한이 없는 경우 처리할 로직 구현. 
	
	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
			AccessDeniedException accessDeniedException) throws IOException, ServletException {
		log.info("handle()");
		
		response.sendRedirect("/member/accessDeniedPage");
		
	}

}
