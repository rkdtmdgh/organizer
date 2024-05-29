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
	$(document).on('click', '#article_wrap a.write_plan', function() {
		console.log("[PLAN] WRITE_PLAN CLICK HANDLER");
		
		let year = current_year;
		let month = current_month + 1;
		let date = $(this).parent('div').siblings('div.date').text();
		
		showWritePlanView(year, month, date);
		
	})
	
	// 캘린더에서 일정 등록 모달에서 cancel button 클릭 시 
	$(document).on('click', '#write_plan input[value="cancel"]', () => {
		console.log("[PLAN] WRITE_PLAN INPUT BUTTON CANCEL CLICK HANDLER");
		
		hideWritePlanView();
		
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

const setSelectDateOptions = (year, month, select_name) => {
	console.log("[PLAN] setSelectDateOptions()");
	
	// 데이터
	let last = new Date(year, month, 0);
	
	$(`#write_plan select[name="${select_name}"]`).children().remove();
	for (let i = 1; i <= last.getDate(); i++) {
		$(`#write_plan select[name="${select_name}"]`)
			.append(`<option value="${i}">${i}</option>`)
	}
	
}
