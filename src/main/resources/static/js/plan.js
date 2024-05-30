// ---------- 현재 ----------
let current_year;
let current_month;
let current_date;
let current_day;

// ---------- 오늘 ----------
let today = new Date();
let today_year = today.getFullYear();
let today_month = today.getMonth()
let today_date = today.getDate();
let today_day = today.getDay();


$(document).ready(() => {
	console.log("[PLAN] DOCUMENT READY!!");
	
	// 현재 보고 있는 날짜 설정
	setCurrentCalender(today_year, today_month, today_date, today_day);
	
	// 현재 보고 있는 캘린더 UI (<select>)
	setCurrentYearAndMonthSelectUI();
	
	// 현재 보고 있는 캘린더 UI (<tr>)
	addCalenderTr();
	
	// 현재 달의 일정 출력
	ajaxGetCurrentMonthPlans();
	
	// event handler 초기화
	eventInit()
	
})

// 현재 보고 있는 날짜 설정
const setCurrentCalender = (year, month, date, day) => {
	console.log("[PLAN] setCurrentCalender()");
	
	current_year = year;
	current_month = month;
	current_date = date;
	current_day = day;
	
}

const setCurrentYearAndMonthSelectUI = () => {
	console.log("[PLAN] setCurrentYearAndMonthSelectUI()");
	
	$('#article_wrap select[name="c_year"]').val(current_year).prop('selected', true);
	$('#article_wrap select[name="c_month"]').val(current_month + 1).prop('selected', true);
	
}

// 현재 캘린더 UI(tr)
const addCalenderTr = () => {
	console.log("[PLAN] addCalenderTr()");
	
	// ---------- 현재 월 & 첫 날 ----------
	let thisCalenderStart = new Date(current_year, current_month, 1);
	let thisCalenderStart_year = thisCalenderStart.getFullYear();		// 이번달_년
	let thisCalenderStart_month = thisCalenderStart.getMonth()			// 이번달_월
	let thisCalenderStart_date = thisCalenderStart.getDate();			// 이번달_첫 날
	let thisCalenderStart_day = thisCalenderStart.getDay();				// 이번달_첫 요일
	
	// ---------- 현재 월 & 마지막 날 ----------
	let thisCalenderEnd = new Date(current_year, current_month + 1, 0);
	let thisCalenderEnd_year = thisCalenderEnd.getFullYear();			// 이번달_년
	let thisCalenderEnd_month = thisCalenderEnd.getMonth();				// 이번달_월
	let thisCalenderEnd_date = thisCalenderEnd.getDate();				// 이번달_마지막 날
	let thisCalenderEnd_day = thisCalenderEnd.getDay();					// 이번달_마지막 요일
	
	// 캘린더 날짜 데이터 설정
	let dates = Array();
	let dateCnt = 1;
	
	for (let i = 0; i < 42; i++) {
		
		if(i < thisCalenderStart_day || dateCnt > thisCalenderEnd_date) {
			dates[i] = 0;
		} else {
			dates[i] = dateCnt;
			dateCnt++;
		}
		
	}
	
	let appendTag = '';
	let dateIndex = 0;
	
	for (let i = 0; i < 6; i++){
		
		if (i >= 4 && dates[dateIndex] == 0) break;
		
		appendTag = '<tr>';
		for (let j = 0; j < 7; j++){
			
			if (dates[dateIndex] !== 0) {
				let $calender_td_template = $("#calender_td_template").clone();
				let $calender_td = $($calender_td_template.html());
				
				$calender_td.find('div.date').text(dates[dateIndex]);
				$calender_td.find('div.plan_wrap').attr('id', `date_${dates[dateIndex]}`);
				appendTag += $calender_td.prop('outerHTML'); 
			} else {
				appendTag += "<td></td>";
			}
			dateIndex++;
		}
		appendTag += '</tr>'; 
		$('#table_calender tbody').append(appendTag);
	}
	
	
}

// 기존 <tr> 제거
const removeCalenderTr = () => {
	console.log("[PLAN] removeCalenderTr()");
	
	// $('#table_calender tbody tr').remove();
	$('#table_calender tbody').empty();
	
}

const eventInit = () => {
	console.log("[PLAN] eventInit()");
	
	// 캘린더에서 이전 달 버튼 (btn_pre) 클릭 시
	$(document).on('click', '#article_wrap a.btn_pre', () => {
		console.log("[PLAN] BTN_PRE CLICK HANDLER");
		
		setPreMonth();
		
	})
	 
	// 캘린더에서 다음 달 버튼 (btn_next) 클릭 시 
	$(document).on('click', '#article_wrap a.btn_next', () => {
		console.log("[PLAN] BTN_NEXT CLICK HANDLER");
		
		setNextMonth();
		
	})
	
	// 캘린더에서 select 년도(c_year) 변경 시 
	$(document).on('change', '#article_wrap select[name="c_year"]', () => {
		console.log("[PLAN] C_YEAR CHANGE HANDLER");
		
		setMonthBySelectChanged();
		
	})
	
	// 캘린더에서 select 월(c_month) 변경 시
	$(document).on('change', '#article_wrap select[name="c_month"]', () => {
		console.log("[PLAN] C_MONTH CHANGE HANDLER");
		
		setMonthBySelectChanged();
		
	})
	
	// 캘린더에서 일정 등록 버튼 클릭 시 
	$(document).on('click', '#article_wrap a.write_plan', (e) => {
		console.log("[PLAN] WRITE_PLAN CLICK HANDLER");
		
		let year = current_year;
		let month = current_month + 1;
		// 화살표 함수에서 e.currentTarget === function this 와 같은 역할 
		let date = $(e.currentTarget).parent('div').siblings('div.date').text();
		
		// 일정 등록 모달에 데이터 주입
		$('#write_plan').data({
			'ori_year' : year,
			'ori_month' : month,
			'ori_date' : date,
		})
		
		showWritePlanView(year, month, date);
		
	})
	/*
	$(document).on('click', '#article_wrap a.write_plan', function() {
		console.log("[PLAN] WRITE_PLAN CLICK HANDLER");
		
		let year = current_year;
		let month = current_month + 1;
		let date = $(this).parent('div').siblings('div.date').text();
		
		showWritePlanView(year, month, date);
		
	})
	*/
	
	// 캘린더에서 일정 등록 모달에서 cancel button 클릭 시 
	$(document).on('click', '#write_plan input[value="cancel"]', () => {
		console.log("[PLAN] WRITE_PLAN INPUT BUTTON CANCEL CLICK HANDLER");
		
		hideWritePlanView();
		
	})
	
	// 캘린더 일정 등록 모달에서 reset button 클릭 시
	$(document).on('click', '#write_plan input[value="reset"]', () => {
		console.log("[PLAN] WRITE_PLAN INPUT BUTTON RESET CLICK HANDLER");
		
		let ori_year = $('#write_plan').data('ori_year');
		let ori_month = $('#write_plan').data('ori_month');
		let ori_date = $('#write_plan').data('ori_date');

		showWritePlanView(ori_year, ori_month, ori_date);
		
	})
	
	// 캘린더 일정 등록 모달에서 write button 클릭 시
	$(document).on('click', '#write_plan input[value="write"]', () => {
		console.log("[PLAN] WRITE_PLAN INPUT BUTTON WRITE CLICK HANDLER");
		
		let year = $('#write_plan select[name="wp_year"]').val();		// 년도
		let month = $('#write_plan select[name="wp_month"]').val();		// 월
		let date = $('#write_plan select[name="wp_date"]').val();		// 일
		let title = $('#write_plan input[name="wp_title"]').val();		// 타이틀
		let body = $('#write_plan input[name="wp_body"]').val();		// 내용
		let file = $('#write_plan input[name="wp_file"]').val();		// 첨부 파일
		
		if (title === '') {
			alert('INPUT PLAN TITLE!!');
			$('#write_plan select[name="wp_title"]').focus();
		} else if (body === '') {
			alert('INPUT PLAN BODY!!');
			$('#write_plan select[name="wp_body"]').focus();
		} else if (file === '') {
			alert('SELECT PLAN FILE!!');
			$('#write_plan select[name="wp_file"]').focus();
		} else {
			let inputFile = $('#write_plan input[name="wp_file"]');
			let files = inputFile[0].files;
			
			ajaxWritePlan(year, month, date, title, body, files[0]);
			
		}
		
	})
	
	// 디테일 뷰 - 캘린더 일정 리스트 제목(<li>) 클릭 시
 	$(document).on('click', '#table_calender ul.plan li a', (e) => {
		console.log("[PLAN] DETAIL_PLAN PLAN TITLE CLICK HANDLER");
		
		ajaxGetPlan($(e.target).data('p_no'));
		
	})
	
	// 디테일 뷰 - 디테일 모달 수정 버튼 클릭 시
 	$(document).on('click', '#detail_plan input[value="modify"]', () => {
		console.log("[PLAN] TABLE_CALENDER MODIFY BUTTON CLICK HANDLER");
		
		let year = $('#detail_plan select[name="dp_year"]').val();
		let month = $('#detail_plan select[name="dp_month"]').val();
		let date = $('#detail_plan select[name="dp_date"]').val();
		let title = $('#detail_plan input[name="dp_title"]').val();
		let body = $('#detail_plan input[name="dp_body"]').val();
		
		if (title === '') {
			alert('INPUT PLAN TITLE');
			$('#detail_plan input[name="dp_title"]').focus();
			
		} else if (body === '') {
			alert('INPUT PLAN BODY');
			$('#detail_plan input[name="dp_body"]').focus();
			
		} else {
			
			let inputFile = $('#detail_plan input[name="dp_file"]');
			let files = inputFile[0].files;
			
			ajaxModifyPlan(
				$('#detail_plan').data('plan').p_no, 
				year, month, date, title, body, files[0]);
			
		}

	})
	
	// 디테일 뷰 - 디테일 모달 닫기 버튼 클릭 시
 	$(document).on('click', '#detail_plan input[value="close"]', () => {
		console.log("[PLAN] DETAIL_PLAN CLOSE BUTTON CLICK HANDLER");
		
		hideDetailPlanView();
		
	})
	
	// 디테일 뷰 - 디테일 모달 삭제 버튼 클릭 시
 	$(document).on('click', '#detail_plan input[value="delete"]', () => {
		console.log("[PLAN] DETAIL_PLAN DELETE BUTTON CLICK HANDLER");
		
		ajaxRemovePlan($('#detail_plan').data('plan').p_no);
		
	})
	
	// 디테일 뷰 - 공유 대상(ID) 검색
 	$(document).on('keyup', '#detail_plan input[name="search_friend"]', (e) => {
		console.log("[PLAN] DETAIL_PLAN INPUT SEARCH_FRIEND KEYUP HANDLER");
		
		let keyword = $(e.target).val();
		if (keyword === '') {
			$('#detail_plan div.list_friend').css('display', 'none');
		} else {
			$('#detail_plan div.list_friend').css('display', 'block');
			ajaxSearchFriends(keyword);
		}
		
	})
	
	// 디테일 뷰 - 일정 공유 
 	$(document).on('click', '#detail_plan div.list_friend ul li a', (e) => {
		console.log("[PLAN] DETAIL_PLAN LIST_FRIEND ID CLICK HANDLER");
		
		let result = confirm(`${e.target.text}님께 일정을 공유하시겠습니까?`);
		
		if (result) {
			ajaxSharePlan(
				$('#detail_plan').data('plan').p_no, 
				$(e.target).data('m_no'), $(e.target).text());
			
			$('#detail_plan div.list_friend').css('display', 'none');
			$('#detail_plan input[name="search_friend"]').val('');
			
		}
		
	})
	
	// 디테일 뷰 - 댓글 등록
 	$(document).on('click', '#detail_plan div.input_comment a', () => {
		console.log("[PLAN] DETAIL_PLAN INPUT_COMMENT A CLICK HANDLER");
		
		let comment = $('#detail_plan input[name="comment"]').val();
		let p_ori_no = $('#detail_plan').data('plan').p_ori_no;
		
		if (comment.trim() !== null) {
			ajaxRegistComment(comment.trim(), p_ori_no);
		}
		
	})
	
}

const setPreMonth = () => {
	console.log("[PLAN] setPreMonth()");
	
	if ($('select[name="c_year"]').val() === "2024" && $('select[name="c_month"]').val() === "1") {
		alert("2024년 1월 이전은 설정할 수 없어요.");
		return false;
	}
	
	let temp_year = current_year;
	let temp_month = current_month - 1;
	
	if (temp_month <= -1) {
		temp_year = temp_year -1;
		temp_month = 11;
	}
	
	// 데이터(년, 월)
	let preCalender = new Date(temp_year, temp_month, 1);
	setCurrentCalender(
		preCalender.getFullYear(), 
		preCalender.getMonth(), 
		preCalender.getDate(), 
		preCalender.getDay()
		);	
	
	setCurrentYearAndMonthSelectUI();		// 현재 캘린더 UI (<select>)
	removeCalenderTr(); 					// 기존 <tr> 제거
	addCalenderTr();						// 바뀐 날짜로 새로운 <tr> 생성 및 추가
	
}

const setNextMonth = () => {
	console.log("[PLAN] setNextMonth()");
	
	if ($('select[name="c_year"]').val() === "2030" && $('select[name="c_month"]').val() === "12") {
		alert("2030년 12월 이후는 설정할 수 없어요.");
		return false;
	}
	
	let temp_year = current_year;
	let temp_month = current_month + 1;
	
	if (temp_month >= 13) {
		temp_year = temp_year + 1;
		temp_month = 0;
	}
	
	// 데이터(년, 월)
	let preCalender = new Date(temp_year, temp_month, 1);
	setCurrentCalender(
		preCalender.getFullYear(), 
		preCalender.getMonth(), 
		preCalender.getDate(), 
		preCalender.getDay()
		);	
	
	setCurrentYearAndMonthSelectUI();		// 현재 캘린더 UI (<select>)
	removeCalenderTr(); 					// 기존 <tr> 제거
	addCalenderTr();						// 바뀐 날짜로 새로운 <tr> 생성 및 추가
	
}

// 년 또는 월 select 변경 시 
const setMonthBySelectChanged = () => {
	console.log("[PLAN] setMonthBySelectChanged()");
	
	let temp_year = $('#article_wrap select[name="c_year"]').val();
	let temp_month = $('#article_wrap select[name="c_month"]').val() - 1;
	
	// 데이터(년, 월)
	let selectedCalender = new Date(temp_year, temp_month, 1);
	setCurrentCalender(
		selectedCalender.getFullYear(), 
		selectedCalender.getMonth(), 
		selectedCalender.getDate(), 
		selectedCalender.getDay()
		);	
	
	removeCalenderTr(); 					// 기존 <tr> 제거
	addCalenderTr();						// 바뀐 날짜로 새로운 <tr> 생성 및 추가
	
}

// 캘린더에서 일정 등록 버튼 클릭 시 일정 등록 모달 오픈
const showWritePlanView = (year, month, date) => {
	console.log("[PLAN] showWritePlanView()");
	
	$('#write_plan select[name="wp_year"]').val(year).prop('selected', true);
	$('#write_plan select[name="wp_month"]').val(month).prop('selected', true);
	
	setSelectDateOptions(year, month, 'wp_date');
	$('#write_plan select[name="wp_date"]').val(date).prop('selected', true);
	
	$('#write_plan').css('display', 'block');
	// $('#write_plan').show();
	
}

// 캘린더에서 일정 등록 모달에서 cancle button 클릭 시 모달 hide
const hideWritePlanView = () => {
	console.log("[PLAN] hideWritePlanView()");
	
	$('#write_plan').css('display', 'none');
	// $('#write_plan').hide();
	
	$('#write_plan input[name="wp_title"]').val('');
	$('#write_plan input[name="wp_body"]').val('');
	$('#write_plan input[name="wp_file"]').val('');
	
}

// select date UI 생성
const setSelectDateOptions = (year, month, select_name) => {
	console.log("[PLAN] setSelectDateOptions()");
	
	// 데이터
	let last = new Date(year, month, 0);
	
	$(`select[name="${select_name}"]`).children().remove();
	for (let i = 1; i <= last.getDate(); i++) {
		$(`select[name="${select_name}"]`)
			.append(`<option value="${i}">${i}</option>`)
	}
	
}

const showDetailPlanView = (plan) => {
	console.log("[PLAN] showDetailPlanView()");
	
	if (plan.p_ori_owner_id !== plan.m_id) {      
		$('#detail_plan select[name="dp_year"]').attr('disabled', true);
		$('#detail_plan select[name="dp_month"]').attr('disabled', true);
		$('#detail_plan select[name="dp_date"]').attr('disabled', true);
    	$('#detail_plan input[name="dp_title"]').attr('disabled', true);
    	$('#detail_plan input[name="dp_body"]').attr('disabled', true);
    	$('#detail_plan input[name="dp_file"]').css('display', 'none');
   	 	$('#detail_plan input[value="modify"]').css('display', 'none');
    	$('#detail_plan input[value="delete"]').css('display', 'none');
      
	} else {
	    $('#detail_plan select[name="dp_year"]').attr('disabled', false);
	    $('#detail_plan select[name="dp_month"]').attr('disabled', false);
	    $('#detail_plan select[name="dp_date"]').attr('disabled', false);
	    $('#detail_plan input[name="dp_title"]').attr('disabled', false);
	    $('#detail_plan input[name="dp_body"]').attr('disabled', false);
	    $('#detail_plan input[name="dp_file"]').css('display', 'inline-block');
  	    $('#detail_plan input[value="modify"]').css('display', 'inline-block');
	    $('#detail_plan input[value="delete"]').css('display', 'inline-block');
      
	}
	
	// 년/월 <select> 
	$('#detail_plan select[name="dp_year"]').val(plan.p_year).prop('selected', true);
	$('#detail_plan select[name="dp_month"]').val(plan.p_month).prop('selected', true);
	
	// 일 <select>
	setSelectDateOptions(plan.p_year, plan.p_month, 'dp_date');
	$('#detail_plan select[name="dp_date"]').val(plan.p_date).prop('selected', true);
	
	// 일정 <input> 
	$('#detail_plan input[name="dp_no"]').val(plan.p_no);
	$('#detail_plan input[name="dp_title"]').val(plan.p_title);
	$('#detail_plan input[name="dp_body"]').val(plan.p_body);

	// 이미지 <src>
	let uploadImgURI = `/planUploadImg/${plan.p_ori_owner_id}/${plan.p_img_name}`;
	$('#detail_plan img.plan_img').attr('src', uploadImgURI);
	
	// 데이터(plan) 주입
	$('#detail_plan').data('plan', plan);	
	
	// 일정 상세 모달 show
	$('#detail_plan').css('display', 'block');
	
	// 댓글 목록 불러오기
	ajaxGetComments(plan.p_ori_no);
	
}

const hideDetailPlanView = () => {
	console.log("[PLAN] hideDetailPlanView()");
	
	$('#detail_plan input[name="dp_title"]').val('');
	$('#detail_plan input[name="dp_body"]').val('');
	$('#detail_plan input[name="dp_file"]').val('');
	
	$('#detail_plan').css('display', 'none');
	
}

const listUpComments = (comments) => {
	console.log("[PLAN] listUpComments()");
	
	$('#detail_plan div.list_comment ul').empty();
	
	for (let i = 0; i < comments.length; i++) {
		let appendTag = '';
		appendTag += '<li>';
		appendTag += comments[i].c_txt;
		appendTag += '</li>';
		
		$('#detail_plan div.list_comment ul').append(appendTag);
	}
	
}


// AJAX FUNCTION START --------------
// 일정 등록 하기
const ajaxWritePlan = (year, month, date, title, body, file) => {
	console.log("[PLAN] ajaxWritePlan()");
	
	let formData = new FormData();
	formData.append("p_year", year);
	formData.append("p_month", month);
	formData.append("p_date", date);
	formData.append("p_title", title);
	formData.append("p_body", body);
	formData.append("file", file);
	
	$.ajax({
		url: '/plan/writePlan',
		method: 'POST',
		processData: false,
		contentType: false,
		data: formData,
		success: (data) => {
			console.log('[PLAN] AJAX COMMUNICATION SUCCESS!! - ajaxWritePlan');
			
			if (data === null || data.resultWritePlan <= 0) {
				alert('일정 등록에 문제가 발생 했습니다.')
			} else {
				alert('일정이 정상적으로 등록 되었습니다.')
				
				removeCalenderTr();
				addCalenderTr();
				ajaxGetCurrentMonthPlans();
			}
			
		},
		error: (error) => {
			console.log('[PLAN] AJAX COMMUNICATION ERROR!! - ajaxWritePlan');
			alert('일정 등록에 문제가 발생 했습니다.')
		},
		complete: () => {
			console.log('[PLAN] AJAX COMMUNICATION COMPLETE!! - ajaxWritePlan');
			
			hideWritePlanView();
			
		}
	});
	
}

// 현재 달 일정 가져온 후 캘린더 업뎃
const ajaxGetCurrentMonthPlans = () => {
	console.log('[PLAN] ajaxGetCurrentMonthPlans()');
	
	$.ajax({
		url: `/plan/getPlans?year=${current_year}&month=${current_month + 1}`,
		method: 'GET',
		data: {},
		success: (data) => {
			console.log('[PLAN] AJAX COMMUNICATION COMPLETE!! - ajaxGetCurrentMonthPlans');

			for (let i = 0; i < data.length; i++) {
				let appendTag = "<li>";
					appendTag += `<a href='#none' data-p_no='${data[i].p_no}'>${data[i].p_title}</a>`;
					appendTag += "</li>";
					
				$(`#date_${data[i].p_date} ul.plan`).append(appendTag);
				
			}
			
		},
		error: (error) => {
			console.log('[PLAN] AJAX COMMUNICATION COMPLETE!! - ajaxGetCurrentMonthPlans');
			
		} 
	})
	
}

// 나의 일정 하나 조회
const ajaxGetPlan = (no) => {
	console.log('[PLAN] ajaxGetPlan()');
	
	$.ajax({
		url: `/plan/getPlan?p_no=${no}`,
		type: 'GET',
		data: {},
		success: (data) => {
			console.log('[PLAN] AJAX COMMUNICATION SUCCESS!! - ajaxGetPlan');
			
			showDetailPlanView(data);
			
		},
		error: (error) => {
			console.log('[PLAN] AJAX COMMUNICATION ERROR!! - ajaxGetPlan');
		}
	})
	
}

// 일정 하나 삭제
const ajaxRemovePlan = (no) => {
	console.log('[PLAN] ajaxRemovePlan()');	
	
	let formData = new FormData();
	formData.append('p_no', no)	
	
	$.ajax({
		url: '/plan/removePlan',
		type: 'DELETE',
		processData: false,
		contentType: false,
		data: formData,
		success: (data) => {
			console.log('[PLAN] AJAX COMMUNICATION SUCCESS!! - ajaxRemovePlan');
			
			if (data > 0) {
				alert('일정이 정상적으로 삭제되었습니다.')
				
				removeCalenderTr();
				addCalenderTr();
				ajaxGetCurrentMonthPlans();

			} else {
				alert('일정 삭제에 문제가 발생했습니다. 다시 시도해 주세요.')
				
			}
			
		},
		error: (error) => {
			console.log('[PLAN] AJAX COMMUNICATION ERROR!! - ajaxRemovePlan');
				alert('일정 삭제에 문제가 발생했습니다. 다시 시도해 주세요.')
			
		},
		complete: () => {
			console.log('[PLAN] AJAX COMMUNICATION COMPLETE!! - ajaxRemovePlan');
			
			hideDetailPlanView();
			
		}
	})
	
}

const ajaxModifyPlan = (no, year, month, date, title, body, file) => {
	console.log('[PLAN] ajaxModifyPlan()');	
	
	let formData = new FormData();
	formData.append('p_no', no);
	formData.append('p_year', year);
	formData.append('p_month', month);
	formData.append('p_date', date);
	formData.append('p_title', title);
	formData.append('p_body', body);
	
	if (file !== undefined) {
		formData.append('file', file);
	}
	
	$.ajax({
		url: '/plan/modifyPlan',
		type: 'PUT',
		processData: false,
		contentType: false,
		data: formData,
		success: (data) => {
			console.log('[PLAN] AJAX COMMUNICATION SUCCESS!! - ajaxModifyPlan');

			if (data === null || data <= 0) {
				 alert('일정 수정에 문제가 발생했습니다.');
				 
			} else {
				 alert('일정이 정상적으로 수정되었습니다.');
				 
				 removeCalenderTr();
				 addCalenderTr();
				 ajaxGetCurrentMonthPlans();
				
			}
			
		},
		error: (error) => {
			console.log('[PLAN] AJAX COMMUNICATION ERROR!! - ajaxModifyPlan');
			alert('일정 수정에 문제가 발생했습니다.');

		},
		complete: () => {
			console.log('[PLAN] AJAX COMMUNICATION COMPLETE!! - ajaxModifyPlan');
			
			hideDetailPlanView();
			
		}
	})
	
}

// 회원 조회
const ajaxSearchFriends = (keyword) => {
	console.log('[PLAN] ajaxSearchFriends()');	
	
	$.ajax({
		url: `/plan/searchFriends?keyword=${keyword}`,
		type: 'GET',
		data: {},
		success: (data) => {
			console.log('[PLAN] AJAX COMMUNICATION SUCCESS!! - ajaxSearchFriends');
			
			$('#detail_plan li.share_reply div.list_friend ul').children().remove();
			for (let i = 0; i < data.length; i++) {
				
				let appendTag = '<li>';
					appendTag += `<a href="#none" data-m_no=${data[i].m_no}>${data[i].m_id}</a>`
					appendTag += '</li>';
				
				$('#detail_plan li.share_reply div.list_friend ul').append(appendTag);
				
			}
			
		},
		error: (error) => {
			console.log('[PLAN] AJAX COMMUNICATION ERROR!! - ajaxSearchFriends');
			
		},
		complete: () => {
			console.log('[PLAN] AJAX COMMUNICATION COMPLETE!! - ajaxSearchFriends');
			
		}
	})
	
}

// 일정 공유
const ajaxSharePlan = (p_no, m_no, m_id) => {
	console.log('[PLAN] ajaxSharePlan()');	

	let formData = new FormData();
	formData.append("p_no", p_no);
	formData.append("m_no", m_no);
	formData.append("m_id", m_id);
	
	$.ajax({
		url: '/plan/sharePlan',
		method: 'POST',
		processData: false,
		contentType: false,
		data: formData,
		success: (data) => {
			console.log('[PLAN] AJAX COMMUNICATION SUCCESS!! - ajaxSharePlan');
			
			switch(data) {
				case -1:		//	ALREADY_SHARED_PLAN
					alert('이미 공유된 일정입니다.')
					break;
				case 0:			//	SHARE_PLAN_FAIL
					alert('일정 공유에 실패했습니다.')
					break;
				case 1:			//  SHARE_PLAN_SUCCESS
					alert('일정 공유에 성공했습니다. ')
					break;
			}
			
		},
		error: (error) => {
			console.log('[PLAN] AJAX COMMUNICATION ERROR!! - ajaxSharePlan');
			
		}
	});
	
}


const ajaxRegistComment = (comment, p_ori_no) => {
	console.log('[PLAN] ajaxRegistComment()');
	
	let formData = new FormData();
	formData.append("comment", comment);
	formData.append("p_ori_no", p_ori_no);
	
	$.ajax({
		url: '/comment/registComment',
		method: 'POST',
		processData: false,
		contentType: false,
		data: formData,
		success: (data) => {
			console.log('[PLAN] AJAX COMMUNICATION SUCCESS!! - ajaxRegistComment');
			
			if (data > 0) {
				alert('댓글이 정상 등록되었습니다.');
				
			} else {
				alert('댓글 등록에 실패했습니다. ');
				
			}
			
		},
		error: (error) => {
			console.log('[PLAN] AJAX COMMUNICATION ERROR!! - ajaxRegistComment');
			
		},
		complete: () => {
			console.log('[PLAN] AJAX COMMUNICATION COMPLETE!! - ajaxRegistComment');
			
			ajaxGetComments(p_ori_no);
			
		}
	});
	
}

const ajaxGetComments = (p_ori_no) => {
	console.log('[PLAN] ajaxGetComments()');
	
	$.ajax({
		url: `/comment/getComments?p_ori_no=${p_ori_no}`,
		type: 'GET',
		data: {},
		success: (data) => {
			console.log('[PLAN] AJAX COMMUNICATION SUCCESS!! - ajaxGetComments');
			
			listUpComments(data);
			
		},
		error: (error) => {
			console.log('[PLAN] AJAX COMMUNICATION ERROR!! - ajaxGetComments');
			
		}
	})
	
}

// AJAX FUNCTION END --------------



