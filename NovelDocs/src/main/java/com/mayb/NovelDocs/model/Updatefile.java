package com.mayb.NovelDocs.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class Updatefile {
	private Docs docs;
	private User updateuser;
	@JsonFormat(timezone = "Asia/Seoul")
	private Date updatedate;
	private String prevcontent;
}
