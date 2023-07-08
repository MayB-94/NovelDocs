package com.mayb.NovelDocs.service;

import java.util.List;

import com.mayb.NovelDocs.model.Openfile;
import com.mayb.NovelDocs.model.User;

public interface OpenfileService {
	public Integer insertOpenfile(Openfile openfile);
	public List<Openfile> getOpenfiles(User user);
	
}
