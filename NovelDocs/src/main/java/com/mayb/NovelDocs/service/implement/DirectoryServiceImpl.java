package com.mayb.NovelDocs.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mayb.NovelDocs.dao.DirectoryDao;
import com.mayb.NovelDocs.model.Directory;
import com.mayb.NovelDocs.service.DirectoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DirectoryServiceImpl implements DirectoryService {
	private final DirectoryDao directoryDao;
	
	@Override
	public List<Directory> getSubdirectory(Directory searcher) {
		return directoryDao.getSubdirectory(searcher);
	}
	@Override
	public Integer createSubdirectory(Directory directory) {
		return directoryDao.createSubdirectory(directory);
	}
	@Override
	public List<Directory> getConnectedDirectories(Directory searcher) {
		return directoryDao.getConnectedDirectories(searcher);
	}
}
