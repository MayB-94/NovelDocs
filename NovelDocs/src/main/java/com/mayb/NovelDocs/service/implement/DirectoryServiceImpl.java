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
	public List<Directory> getSubdirectory(String currentPath) {
		return directoryDao.getSubdirectory(currentPath);
	}
}
