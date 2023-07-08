package com.mayb.NovelDocs.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class Openfile {
	private Docs docs;
	private User openuser;
	@JsonFormat(timezone = "Asia/Seoul")
	private Date opendate;
}
