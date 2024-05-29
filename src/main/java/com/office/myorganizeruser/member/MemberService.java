package com.office.myorganizeruser.member;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.office.myorganizeruser.member.mapper.MemberMapper;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class MemberService {
	
	final static public int MEMBER_ALREADY = -1;
	final static public int MEMBER_SIGN_UP_FAIL = 0;
	final static public int MEMBER_SIGN_UP_SUCCESS = 1;

	final private MemberMapper memberMapper;
	final private PasswordEncoder passwordEncoder;
	
	public MemberService(MemberMapper memberMapper, PasswordEncoder passwordEncoder) {
		this.memberMapper = memberMapper;
		this.passwordEncoder = passwordEncoder;
	
	}

	// 회원 가입 확인
	public int memberSignUpConfirm(MemberDto memberDto) {
		log.info("memberSignUpConfirm()");
		
		// ID 중복 확인
		Boolean isMember = memberMapper.isMember(memberDto.getM_id());
		
		memberDto.setM_pw(passwordEncoder.encode(memberDto.getM_pw()));
		
		// 회원 가입 진행. 
		if(!isMember) {
			log.info("THIS ID DOES NOT EXIST");
			
			int result = memberMapper.memberSignUpConfirm(memberDto);
			
			if(result <= 0) {
				log.info("MEMBER SIGNUP FAIL");
				return MEMBER_SIGN_UP_FAIL;
				
			} else {
				log.info("MEMBER SIGNUP SUCCESS");
				return MEMBER_SIGN_UP_SUCCESS;
				
			}
			
		} else {
			log.info("THIS ID EXIST");
			return MEMBER_ALREADY;
			
		}
		
	}

	// 로그인 확인
	public MemberDto memberSignInConfirm(MemberDto memberDto) {
		log.info("memberSignInConfirm()");
		
		MemberDto loginedMemberDto = memberMapper.memberSignInConfirm(memberDto);
		
		return loginedMemberDto;
	}

	// ID를 이용한 회원 정보 조회
	public MemberDto getMemberById(String loginedMemberId) {
		log.info("getMemberById()");
		
		MemberDto loginedMemberDto = memberMapper.getMemberById(loginedMemberId);

		return loginedMemberDto;
	}

	// 회원 정보 수정 확인
	public int memberModifyConfirm(MemberDto memberDto) {
		log.info("memberModifyConfirm()");
		
		memberDto.setM_pw(passwordEncoder.encode(memberDto.getM_pw()));
		
		int result = memberMapper.memberModifyConfirm(memberDto);
		
		return result;
	}

	// 회원 정보 삭제 확인
	public int memberDeleteConfirm(String m_id) {
		log.info("memberDeleteConfirm()");
		
		int result = memberMapper.memberDeleteConfirm(m_id);
		
		return result;
	}
	
}
