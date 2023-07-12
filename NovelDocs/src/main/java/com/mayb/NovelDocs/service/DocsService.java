package com.mayb.NovelDocs.service;

import java.util.List;

import com.mayb.NovelDocs.model.Docs;

public interface DocsService {
	public List<Docs> getDocs(Docs searcher);
	public Docs getDoc(Docs searcher);
	public Docs getDocByPath(Docs searcher);
	public Integer createDoc(Docs doc);
	
}
