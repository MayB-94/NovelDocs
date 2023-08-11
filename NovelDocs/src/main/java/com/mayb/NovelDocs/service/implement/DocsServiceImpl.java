package com.mayb.NovelDocs.service.implement;

import java.util.List;
import java.util.Map;

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
	public List<Docs> getDocs(Docs searcher) {
		return docsDao.getDocs(searcher);
	}
	@Override
	public Docs getDoc(Docs searcher) {
		return docsDao.getDoc(searcher);
	}
	@Override
	public Docs getDocByPath(Docs searcher) {
		return docsDao.getDocByPath(searcher);
	}
	@Override
	public Integer createDoc(Docs doc) {
		return docsDao.createDoc(doc);
	}
	@Override
	public void updateTitle(Map<String, Object> param) {
		docsDao.updateTitle(param);
	}
}
