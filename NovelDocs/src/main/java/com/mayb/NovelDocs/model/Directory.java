package com.mayb.NovelDocs.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class Directory {
	private String name;
	private String parent;
	private String reguser;
	@JsonFormat(timezone = "Asia/Seoul")
	private Date regdate;
}
