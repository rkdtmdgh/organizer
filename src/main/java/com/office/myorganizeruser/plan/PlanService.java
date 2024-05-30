package com.office.myorganizeruser.plan;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.office.myorganizeruser.member.mapper.MemberMapper;
import com.office.myorganizeruser.plan.mapper.PlanMapper;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class PlanService {
	
	final static public int ALREADY_SHARED_PLAN = -1; 	// 이미 공유된 일정
	final static public int SHARE_PLAN_FAIL 	= 0;	// 일정 공유 실패
	final static public int SHARE_PLAN_SUCCESS 	= 1;	// 일정 공유 성공
	
	final private PlanMapper planMapper;
	final private MemberMapper memberMapper;
	
	public PlanService(PlanMapper planMapper, MemberMapper memberMapper) {
		this.planMapper = planMapper;
		this.memberMapper = memberMapper;
	}

	// 일정 등록
	public Object writePlan(PlanDto planDto) {
		log.info("writePlan()");
		
		Map<String, Object> responseMap = new HashMap<>();
		
		int result = planMapper.writePlan(planDto);
		
		if (result > 0) {
			log.info("WRITE PLAN SUCCESS");
			planMapper.setPOriNo(planDto.getP_no());
			
		} else {
			log.info("WRITE PLAN FAIL");
			
		}
		
		responseMap.put("resultWritePlan", result);
		
		return responseMap;
	}

	
	// 나의 일정 목록 조회
	public List<PlanDto> getPlans(int year, int month, String m_id) {
		log.info("getPlans()");
		
		return planMapper.getPlans(year, month, m_id);
		
	}

	// 일정 하나 조회
	public PlanDto getPlan(int p_no) {
		log.info("getPlan()");
		
		return planMapper.getPlan(p_no);
		
	}

	// 일정 삭제
	public Object removePlan(int p_no) {
		log.info("removePlan()");
		
		return planMapper.removePlan(p_no);
		
	}

	// 일정 수정
	public Object modifyPlan(PlanDto planDto) {
		log.info("modifyPlan()");
		
		return planMapper.modifyPlan(planDto);
		
	}

	// 친구 찾기
	public Object searchFriends(String keyword) {
		log.info("searchFriends()");
		
		return memberMapper.searchFriends(keyword);
		
	}

	public Object sharePlan(int p_no, int m_no, String m_id) {
		log.info("sharePlan()");
		
		PlanDto planDto = planMapper.getPlan(p_no);
		
		boolean isSharedPlan = planMapper.isSharedPlan(planDto.getP_ori_no(), m_id);
		
		int result = SHARE_PLAN_FAIL;
		
		if (!isSharedPlan) {
			result = planMapper.sharePlan(planDto, m_id);
		} else {
			result = ALREADY_SHARED_PLAN;
		}
		
		return result;
	}
	
	
	

}
