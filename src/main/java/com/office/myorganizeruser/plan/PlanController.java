package com.office.myorganizeruser.plan;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Controller
@RequestMapping("/plan")
public class PlanController {

	// ORGANIZER HOME
	@GetMapping({"", "/"})
	public String home() {
		log.info("home()");
		
		String nextPage = "plan/home";
		
		return nextPage;
	}
	
}
