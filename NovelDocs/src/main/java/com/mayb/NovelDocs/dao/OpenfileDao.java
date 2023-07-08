package com.mayb.NovelDocs.dao;

import java.util.List;

import com.mayb.NovelDocs.model.Openfile;
import com.mayb.NovelDocs.model.User;

public interface OpenfileDao {
	public Integer insertOpenfile(Openfile openfile);
	public List<Openfile> getOpenfiles(User user);
	
}
