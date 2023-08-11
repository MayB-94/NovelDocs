package com.mayb.NovelDocs.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class History {
	private Integer id_num;
	private String type;
	private String prev_title;
	private String curr_title;
	@JsonFormat(timezone = "Asia/Seoul")
	private Date changedate;
}
