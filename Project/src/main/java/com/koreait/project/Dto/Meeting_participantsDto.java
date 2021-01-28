package com.koreait.project.Dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data

public class Meeting_participantsDto {

	private int participants_no;
	private int meeting_no;
	private int user_no;
	private Date created_at;
	private int status;
	private String reject_reason;
}
