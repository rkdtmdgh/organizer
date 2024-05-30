package com.office.myorganizeruser.plan.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.office.myorganizeruser.plan.PlanDto;

@Mapper
public interface PlanMapper {

	public int writePlan(PlanDto planDto);

	public void setPOriNo(int p_no);

	public List<PlanDto> getPlans(
			@Param("p_year") int year, 
			@Param("p_month") int month, 
			@Param("m_id") String m_id
			);

	public PlanDto getPlan(int p_no);

	public int removePlan(int p_no);

	public int modifyPlan(PlanDto planDto);

	public boolean isSharedPlan(int p_ori_no, String m_id);

	public int sharePlan(@Param("planDto") PlanDto planDto, @Param("m_id") String m_id);

}
