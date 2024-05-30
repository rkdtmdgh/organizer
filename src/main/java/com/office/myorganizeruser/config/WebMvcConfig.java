package com.office.myorganizeruser.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

//	@Override
//	public void addInterceptors(InterceptorRegistry registry) {
//		
//		registry.addInterceptor(new MemberLoginInterceptor())
//		// 로그인 없이 접근 가능
//		.excludePathPatterns("/css/**", "/img/**", "/js/**")	
//		// 로그인 후 접근 가능
//		.addPathPatterns(										
//				"/member/memberModify",
//				"/member/memberModifyConfirm",
//				"/member/memberDeleteConfirm"
//				);
//		
//	}
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		// for windows
		registry
			.addResourceHandler("/planUploadImg/**")
			.addResourceLocations("file:///c:organizer/upload/");
	
	}
	
	
}
