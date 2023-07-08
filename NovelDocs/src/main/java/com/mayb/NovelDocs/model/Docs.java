package com.mayb.NovelDocs.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class Docs {
	private Integer docs_id;
	private String title;
	private String virtual_dir;
	private User reguser;
	private String content;
	@JsonFormat(timezone = "Asia/Seoul")
	private Date regdate;
	@JsonFormat(timezone = "Asia/Seoul")
	private Date lastdate;
	private String isdelete;
	@JsonFormat(timezone = "Asia/Seoul")
	private Date deletedate;
	private String exposetype;
}
