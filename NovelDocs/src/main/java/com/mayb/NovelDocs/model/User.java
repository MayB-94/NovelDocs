package com.mayb.NovelDocs.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class User {
	private String id;
	private String password;
	private String nickname;
	private String email;
	@JsonFormat(timezone = "Asia/Seoul")
	private Date user_regdate;
	@JsonFormat(timezone = "Asia/Seoul")
	private Date user_lastdate;
	private String user_role;
}
