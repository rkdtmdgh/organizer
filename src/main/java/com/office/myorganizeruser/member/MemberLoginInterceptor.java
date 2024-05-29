package com.office.myorganizeruser.member;

import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class MemberLoginInterceptor implements HandlerInterceptor {

	// session 체크 후 WebMvcConfig 로 Boolean 값 전달.
//	@Override
//	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
//			throws Exception {
//		
//		HttpSession session = request.getSession(false);
//		
//		if(session != null) {
//			Object sessionObj = session.getAttribute("loginedMemberId");
//			
//			if(sessionObj != null) { 
//				return true;
//			}
//			
//		}
//		
//		response.sendRedirect(request.getContextPath() + "/member/memberSignIn");
//		return false;
//	
//	}
	
}
