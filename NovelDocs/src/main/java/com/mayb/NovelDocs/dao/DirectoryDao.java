package com.mayb.NovelDocs.dao;

import java.util.List;

import com.mayb.NovelDocs.model.Directory;

public interface DirectoryDao {
	public List<Directory> getSubdirectory(String currentPath);
	
}
