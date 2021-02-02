// 어드민 로그인 메소드
function fn_login(f) {
    if($('#email').val() == '') {
        alert('아이디를 입력해주세요.');
        return;
    } else if($('#password').val() == '') {
        alert('비밀번호를 입력해주세요.');
        return;
    }
    f.submit();
}

// 로그인 성공여부 체크 메소드
function fn_loginCehck(result) {
	if(result == 0) {
		alert('로그인 되었습니다.');
		location.href = 'adminIndex.wooki';
	} else if(result == 1) {
		alert('아이디 또는 암호를 확인하세요.');
	} else if(result == 2) {
		alert('접근 권한이 없습니다.');
	}
}

// 로그아웃 메소드
function fn_logout() {
	location.href = 'adminLogout.wooki';
}

// 페이지접속시 어드민권한이 있는지 확인하는 메소드
function fn_adminCheck(user_sep) {
	if(user_sep != 0) {
		alert('접근 권한이 없습니다.');
		fn_logout();
		return;
	}
	return true;
}

// 선택한 nav-btn 강조 메소드
function fn_selectBtn() {
	$('.nav-container .nav-btn').click(function() {
		$('.nav-container .nav-btn').removeAttr('id', 'select-nav');
	    $('.nav-container .nav-btn').eq($(this).index()).attr('id', 'select-nav');
	});
}

// 메인페이지 선택 메소드
function fn_main() {
	$('.content-container').empty();
	$('.content-container')
	.append('<h1>어드민 전용 페이지 입니다</h1>')
	.append('<p>환영합니다</p>');
}

// 일반회원관리 선택 메소드
function fn_user(p) {
	$.ajax({
		url: 'userList.wooki',
		type: 'get',
		data: {page: p},
		dataType: 'json',
		success: function(list) {
			if(list.result) {
				userFilter(list.text_filter, list.search, list.user_separator);
				userList(list.list, list.paging, list.totalRecord, list.recordPerPage, list.page);
			}
		},
		error: function() {
			alert('실패');
		}
	});
}

// 필터리스트 만드는 함수
function userFilter(text_filter, search, user_separator) {
	$('.content-container').empty();
	$('.content-container').append('<h1>회원 관리</h1>');
	$('<form>')
	.append($('<tbody id="filterBox">'))
	.appendTo('.content-container');
	
	$('<tr>')
	.append($('<td>').html('<select name="text_filter" id="text_filter"><option value="email">이메일</option><option value="user_nickname">닉네임</option><option value="user_no">유저번호</option></select>'))
	.append($('<td>').html('<input type="text" name="search" id="search" />'))
	.append($('<td>').html('회원구분'))
	.append($('<td>').html('<select name="user_separator" id="user_separator"><option value="">전체선택</option><option value="0">관리자</option><option value="1">트레이너</option><option value="2">일반회원</option></select>'))
	.append($('<td>').html('<input type="button" value="검색" onclick="fn_filterUserList(1)" />'))
	.appendTo('#filterBox');
	if(text_filter == undefined) {
		$('#text_filter').val('email');
	} else {
		$('#text_filter').val(text_filter);
	}
	$('#search').val(search);
	$('#user_separator').val(user_separator);
}

function fn_filterUserList(p) {
	let text_filter = $('#text_filter').val();
	let search = $('#search').val();
	let user_separator = $('#user_separator').val();
	if(text_filter == 'user_no' && search == '') {
		alert('유저번호를 입력하세요.');
		return;
	}
	$.ajax({
		url: 'filterUserList.wooki',
		type: 'get',
		data: {
			page: p,
			text_filter: text_filter,
			search: search,
			user_separator: user_separator
		},
		dataType: 'json',
		success: function(list) {
			if(list.result) {
				userFilter(list.text_filter, list.search, list.user_separator);
				userList(list.list, list.paging, list.totalRecord, list.recordPerPage, list.page);
			}
		},
		error: function() {
			alert('유저번호는 숫자로 입력 해 주세요.');
		}
	});
}

// 유저리스트 테이블 만드는 함수
function userList(list, paging, totalRecord, recordPerPage, page) {
	$('<table>')
	.append($('<thead id="title">'))
	.append($('<tbody id="list">'))
	.append($('<tfoot class="paging">'))
	.appendTo('.content-container');
	
	$('<tr>')
	.append($('<th>').html('인덱스'))
	.append($('<th>').html('유저번호'))
	.append($('<th>').html('이메일'))
	.append($('<th>').html('닉네임'))
	.append($('<th>').html('회원구분'))
	.append($('<th>').html('활동지역(시,도)'))
	.append($('<th>').html('활동지역(시,군,구)'))
	.append($('<th>').html('가입일'))
	.append($('<th>').html('최종로그인'))
	.append($('<th>').html('로그인횟수'))
	.append($('<th>').html('로그인 시도 횟수'))
	.append($('<th>').html('가입방식'))
	.append($('<th>').html('계정 활성화 여부'))
	.append($('<th colspan="3">').html('비고'))
	.appendTo('#title');
	
	$.each(list, function(idx, user) {
		let date = [user.created_at, user.last_login];
		let result = [];
		for(let i = 0; i < 2; i++) {
			let d = new Date(date[i]);
			result[i] = `${d.getFullYear()}-`;
			if(d.getMonth() < 10) {result[i] += 0;}
			result[i] += `${(d.getMonth() + 1)}-${d.getDate()} ${d.getHours()}:`;
			if(d.getMinutes() < 10) {result[i] += 0;}
			result[i] += `${d.getMinutes()}:`;
			if(d.getSeconds() < 10) {result[i] += 0;}
			result[i] += d.getSeconds();
		};
		let separator = ['관리자', '트레이너', '일반회원'];
		let sep = separator[user.user_separator];
		$('<tr>')
		.append($('<td>').html(totalRecord - (recordPerPage * (page - 1)) - idx))
		.append($('<td>').html(user.user_no))
		.append($('<td>').html(user.email))
		.append($('<td>').html(user.user_nickname))
		.append($('<td>').html(sep))
		.append($('<td>').html(user.location1_no))
		.append($('<td>').html(user.location2_no))
		.append($('<td>').html(result[0]))
		.append($('<td>').html(result[1]))
		.append($('<td>').html(user.login_count))
		.append($('<td>').html(user.login_attempt))
		.append($('<td>').html(user.user_reg_method))
		.append($('<td>').html(user.disable))
		.append($('<input type="hidden" name="user_no" id="user_no" />').val(user.user_no))
		.append($('<input type="hidden" name="email" id="email" />').val(user.email))
		.append($('<td>').html('<input type="button" value="아이디변경" id="changeEmail" />'))
		.append($('<td>').html('<input type="button" value="임시비밀번호부여" id="changePwd" />'))
		.append($('<td>').html('<input type="button" value="계정삭제" id="deleteId" />'))
		.appendTo('#list')
	});
	
	$('<tr>')
	.append($('<td colspan="16">').html(paging))
	.append($('<input type="hidden" id="now_page" />').val(page))
	.appendTo('.paging');
}

// 이메일변경 모달 열기
function fn_openChangeEmailModal() {
	$('body').on('click', '#changeEmail', function() {
		let user_no = $(this).parents('tr').find('#user_no').val();
		let email = $(this).parents('tr').find('#email').val();
		$('#change-email-modal').addClass('show');
		$('#change_user_no').val(user_no);
		$('#current_email').val(email);
	});
}

let is_possible = false;
// 이메일 변경 가능 아이디 체크
function fn_changeEmailIsPossible() {
	$('#change_email').blur(function() {
		if($('#change_email').val() == '') {
			return;
		}
		$.ajax({
			url: 'changeEmailIsPossible.wooki',
			type: 'get',
			data: {
				email: $('#change_email').val()
			},
			dataType: 'json',
			success: function(obj) {
				if(obj.result) {
					$('#change_mail_is_possible').html('사용 가능한 이메일 입니다.');
					$('#change_mail_is_possible').attr('class', 'success');
					is_possible = obj.result;
				} else {
					$('#change_mail_is_possible').html('이미 사용중인 이메일 입니다.');
					$('#change_mail_is_possible').attr('class', 'fail');
				}
			},
			error: function() {
				alert('실패');
			}
		});
	});
}

//이메일변경 이벤트
function fn_changeEmail() {
	$('#change_email_submit').click(function() {
		let email = $('#change_email').val();
		let user_no = $('#change_user_no').val();
		if(email == '') {
			alert('변경할 이메일을 입력하세요.');
			$('#change_email').focus();
			return;
		} else if(!is_possible) {
			alert('사용가능한 이메일을 입력하세요.');
			$('#change_email').focus();
			return;
		}
		let sendObj = {"user_no": user_no, "email": email};
		$.ajax({
			url: 'changeEmail.wooki',
			type: 'put',
			dataType: 'json',
			data: JSON.stringify(sendObj),
			contentType: 'application/json',
			success: function(obj) {
				$('#change-email-modal').removeClass('show');
				$('#change_email').val('');
				$('#change_user_no').val('');
				$('#current_email').val('');
				$('#change_mail_is_possible').html('');
				$('#change_mail_is_possible').attr('class', '');
				is_possible = false;
				fn_filterUserList($('#now_page').val());
				return;
			},
			error: function() {
				alert('실패');
			}
		});
	});
}

// 이메일변경 모달 닫기
function fn_closeChangeEmailModal() {
	$('#change-email-modal').click(function(e) {
		if(e.target == e.currentTarget) {
			$(this).removeClass('show');
			$('#change_email').val('');
			$('#change_user_no').val('');
			$('#current_email').val('');
			$('#change_mail_is_possible').html('');
			$('#change_mail_is_possible').attr('class', '');
			is_possible = false;
		}
	});
}

// 임시비밀번호 발송
function fn_sendTempPass() {
	$('body').on('click', '#changePwd', function() {
		let user_no = $(this).parents('tr').find('#user_no').val();
		let email = $(this).parents('tr').find('#email').val();
		let sendObj = {"user_no": user_no, "email": email};
		$.ajax({
			url: 'sendTempPass.wooki',
			type: 'put',
			dataType: 'json',
			data: JSON.stringify(sendObj),
			contentType: 'application/json',
			success: function(obj) {
				if(obj.result) {
					alert('임시 비밀번호를 발송하였습니다.');
				} else {
					alert('임시 비밀번호를 발송에 실패하였습니다.');
				}
			},
			error: function() {
				alert('실패');
			}
		});
	});
}