package com.office.myorganizeruser.plan.comment;

import org.springframework.stereotype.Service;

import com.office.myorganizeruser.plan.comment.mapper.CommentMapper;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class CommentService {

	final private CommentMapper commentMapper;
	
	public CommentService(CommentMapper commentMapper) {
		this.commentMapper = commentMapper;
	}

	// 일정 등록
	public Object registComment(int p_ori_no, String m_id, String c_txt) {
		log.info("registComment()");
		
		int result = commentMapper.registComment(p_ori_no, m_id, c_txt);
		
		return result;
	}

	// 댓글 조회 by p_ori_no
	public Object getComments(int p_ori_no) {
		log.info("getComments()");
		
		return commentMapper.getComments(p_ori_no);
	}
	
}
