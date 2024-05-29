package com.office.myorganizeruser.member;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.log4j.Log4j2;



@Log4j2
@Controller
@RequestMapping("/member")
public class MemberController {

	// 처음 한번 초기화 한 후 계속 사용할 수 있게 final private 선언. (다시 초기화 할 수 없게.)
	final private MemberService memberService;
	
//	@Autowired
	public MemberController(MemberService memberService) {
		this.memberService = memberService;
		
	}
	
	// 회원 가입 양식
	
	@GetMapping("/memberSignUp")
	public String memberSignUp() {
		log.info("memberSignUp()");
		
		String nextPage = "member/signup";
		
		return nextPage;
	}
	
	// 회원 가입 확인
	@PostMapping("/memberSignUpConfirm")
	public String memberSignUpConfirm(MemberDto memberDto) {
		log.info("memberSignUpConfirm()");
		
		String nextPage = "member/signup_ok";
		
		int result = memberService.memberSignUpConfirm(memberDto);
		
		if(result == MemberService.MEMBER_ALREADY || result == MemberService.MEMBER_SIGN_UP_FAIL) {
			nextPage = "member/sign_ng";
		}
		
		return nextPage;
		
	}
	
	// 로그인 양식
	@GetMapping("/memberSignIn")
	public String memberSignIn() {
		log.info("memberSignIn()");
		
		String nextPage = "member/signin";
		
		return nextPage;
	}
	
	/*
	// 로그인 확인
	@PostMapping("/memberSignInConfirm")
	public String memberSignInConfirm(MemberDto memberDto, HttpSession session) {
		log.info("memberSignInConfirm()");
		
		String nextPage = "member/signin_ok";
		
		MemberDto logineMemberDto = memberService.memberSignInConfirm(memberDto);
		
		if(logineMemberDto != null) {
			session.setAttribute("loginedMemberId", logineMemberDto.getM_id());
			session.setMaxInactiveInterval(60 * 30);
		} else {
			nextPage = "member/signin_ng";
		}
		
		return nextPage;
	}
	*/
	
	@GetMapping("/memberSignInResult")
	public String memberSignInResult(@RequestParam(value = "logined", required = false) Boolean logined) {
		log.info("memberSignInResult()");
		
		String nextPage = "member/signin_ok";
		
		if(!logined) {
			nextPage = "member/signin_ng";
		}
		
		return nextPage;
	}
	
	
	// 회원 정보 수정 양식
	@GetMapping("/memberModify")
	public String memberModify(HttpSession session, Model model) {
		log.info("memberModify()");
		
		String nextPage = "member/modify";
		
//		Object sessionObj = session.getAttribute("loginedMemberId");
//		if(sessionObj == null) {
//			return "redirect:/member/memberSignIn";
//		
//		}
//		String loginedMemberId = String.valueOf(sessionObj);
		
		Authentication authentication = 
				SecurityContextHolder.getContext().getAuthentication();
		
		MemberDto loginedMemberDto = memberService.getMemberById(authentication.getName());
		model.addAttribute("loginedMemberDto", loginedMemberDto);
		
		return nextPage;
		
	}
	
	
	// 회원 정보 수정 확인
	@PostMapping("/memberModifyConfirm")
	public String memberModifyConfirm(MemberDto memberDto, HttpSession session) {
		log.info("memberModifyConfirm()");
		
		String nextPage = "member/modify_ok";
		
//		Object sessionObj = session.getAttribute("loginedMemberId");
//		if(sessionObj == null) {
//			return "redirect:/member/memberSignIn";
//		}
		
		int result = memberService.memberModifyConfirm(memberDto);
		
		if(result <= 0) {
			nextPage = "member/modify_ng";
		}
		
		return nextPage;
	}
	
	// 로그 아웃 확인
//	@GetMapping("/memberSignOutConfirm")
//	public String memberSignOutConfirm(HttpSession session) {
//		log.info("memberSignOutConfirm()");
//		
//		String nextPage = "redirect:/";
//		
//		session.invalidate();
//		
//		return nextPage;
//	}
	
	// 회원 정보 삭제 확인 
	@GetMapping("/memberDeleteConfirm")
	public String memberDeleteConfirm(HttpSession session, HttpServletRequest request, HttpServletResponse response) {
		log.info("memberDeleteConfirm");
		
		String nextPage = "member/delete_ok";
		
//		Object sessionObj = session.getAttribute("loginedMemberId");
		
//		if(sessionObj == null) {
//			return "redirect:/member/memberSignIn";
//		
//		}
		
//		String loginedMemberId = String.valueOf(sessionObj);
//		int result = memberService.memberDeleteConfirm(loginedMemberId);
//		
//		if(result <= 0) 
//			nextPage = "member/delete_ng";
		
		// 세션 무효화. 선언 후 세션 역할? 기능? 상실.
//		session.invalidate();	
		
		Authentication authentication = 
				SecurityContextHolder.getContext().getAuthentication();
		int result = memberService.memberDeleteConfirm(authentication.getName());
		if(result <= 0) {
			nextPage = "member/delete_ng";
		} else {
			// security 로그아웃처리
			new SecurityContextLogoutHandler().logout(request, response, authentication);
		}
		
		
		return nextPage;
	}
	
	@GetMapping("/accessDeniedPage")
	public String accessDeniedPage() {
		log.info("accessDeniedPage()");
		
		String nextPage = "member/access_denied_page";
		
	    return nextPage;
	}
	
	
	
	// 비밀번호 찾기 /findeIdOrPw
	
}
