package com.mayb.NovelDocs.service;

import java.util.List;

import com.mayb.NovelDocs.model.Directory;

public interface DirectoryService {
	public List<Directory> getSubdirectory(Directory searcher);
	public Integer createSubdirectory(Directory directory);
	public List<Directory> getConnectedDirectories(Directory searcher);
	
}
