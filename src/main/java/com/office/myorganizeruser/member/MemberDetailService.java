package com.office.myorganizeruser.member;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.office.myorganizeruser.member.mapper.MemberMapper;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class MemberDetailService implements UserDetailsService {

	final private MemberMapper memberMapper;
	
	public MemberDetailService(MemberMapper memberMapper) {
		this.memberMapper = memberMapper;
	
	}
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		log.info("loadUserByUsername()");
		
		MemberDto memberDto = memberMapper.getMemberById(username);

		return User
				.builder()
				.username(memberDto.getM_id())
				.password(memberDto.getM_pw())
				.roles(memberDto.getM_role())
				.build();
	}
	
}
