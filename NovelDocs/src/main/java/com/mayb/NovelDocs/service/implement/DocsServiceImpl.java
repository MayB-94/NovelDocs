package com.mayb.NovelDocs.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mayb.NovelDocs.dao.DocsDao;
import com.mayb.NovelDocs.model.Docs;
import com.mayb.NovelDocs.service.DocsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocsServiceImpl implements DocsService {
	private final DocsDao docsDao;
	
	@Override
	public List<Docs> getDocs(String currentPath) {
		return docsDao.getDocs(currentPath);
	}
	@Override
	public Docs getDoc(Docs searcher) {
		return docsDao.getDoc(searcher);
	}
	@Override
	public Docs getDocByPath(Docs searcher) {
		return docsDao.getDocByPath(searcher);
	}
}
