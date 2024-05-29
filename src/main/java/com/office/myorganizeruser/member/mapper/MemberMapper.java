package com.office.myorganizeruser.member.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.office.myorganizeruser.member.MemberDto;

@Mapper
public interface MemberMapper {

	Boolean isMember(String m_id);

	int memberSignUpConfirm(MemberDto memberDto);

	MemberDto memberSignInConfirm(MemberDto memberDto);

	MemberDto getMemberById(String loginedMemberId);

	int memberModifyConfirm(MemberDto memberDto);

	int memberDeleteConfirm(String m_id);

}
