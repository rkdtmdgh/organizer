package com.office.myorganizeruser.plan;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.office.myorganizeruser.plan.util.UploadFileService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Controller
@RequestMapping("/plan")
public class PlanController {
	
	final private PlanService planService;
	final private UploadFileService uploadFileService;
	
	public PlanController(PlanService planService, UploadFileService uploadFileService) {
		this.planService = planService;
		this.uploadFileService = uploadFileService;
	}

	// ORGANIZER HOME
	@GetMapping({"", "/"})
	public String home() {
		log.info("home()");
		
		String nextPage = "plan/home";
		
		return nextPage;
	}
	
	// 일정 등록
	@ResponseBody
	@PostMapping("/writePlan")
	public Object writePlan(PlanDto planDto, @RequestParam("file") MultipartFile file) {
		log.info("writePlan()");
		
		// SAVE FILE
		Authentication authentication = 
				SecurityContextHolder.getContext().getAuthentication();

		String savedFileName = uploadFileService.upload(authentication.getName(), file);
		
		if (savedFileName != null) {
			
			planDto.setP_img_name(savedFileName);
			planDto.setM_id(authentication.getName());
			
			return planService.writePlan(planDto);

		} else {
			return null;
			
		}
		
	}
	
	// 나의 일정 목록 조회
	@ResponseBody
	@GetMapping("/getPlans")
	public Object getPlans(@RequestParam("year") int year, @RequestParam("month") int month) {
		log.info("getPlans()");
		
		Authentication authentication = 
				SecurityContextHolder.getContext().getAuthentication();
		
		List<PlanDto> planDtos = planService.getPlans(year, month, authentication.getName());
		
		return planDtos;
		
	}
	
	// 일정 하나 조회
	@ResponseBody
	@GetMapping("/getPlan")
	public Object getPlan(@RequestParam("p_no") int p_no) {
		log.info("getPlan()");
		
		PlanDto planDto = planService.getPlan(p_no);
		
		return planDto;
	}
	
	// 일정 삭제
	@ResponseBody
	@DeleteMapping("/removePlan")
	public Object removePlan(@RequestParam("p_no") int p_no) {
		log.info("removePlan()");
		
		return planService.removePlan(p_no);
	}
	
	// 일정 수정
	@ResponseBody
	@PutMapping("/modifyPlan")
	public Object modifyPlan(PlanDto planDto, 
			@RequestParam(value ="file", required = false) MultipartFile file) {
		log.info("modifyPlan()");
		
		if (file != null) {
			
			// SAVE FILE
			Authentication authentication = 
					SecurityContextHolder.getContext().getAuthentication();
			String savedFileName = uploadFileService.upload(authentication.getName(), file);
			
			if (savedFileName != null) {
				planDto.setP_img_name(savedFileName);
				
				return planService.modifyPlan(planDto);
			} else {
				return null;
			}
			
		} else {
			return planService.modifyPlan(planDto);
			
		}
		
	}
	
	// 친구 찾기
	@ResponseBody
	@GetMapping("/searchFriends")
	public Object searchFriends(@RequestParam("keyword") String keyword) {
		log.info("searchFriends()");
		
		return planService.searchFriends(keyword);
		
	}
	
	// 일정 공유
	@ResponseBody
	@PostMapping("/sharePlan")
	public Object sharePlan(
			@RequestParam("p_no") int p_no,
			@RequestParam("m_no") int m_no,
			@RequestParam("m_id") String m_id) {
		log.info("sharePlan()");
		
		return planService.sharePlan(p_no, m_no, m_id);
	}
	
	
}
