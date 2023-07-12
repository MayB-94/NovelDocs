package com.mayb.NovelDocs.dao;

import java.util.List;

import com.mayb.NovelDocs.model.Docs;

public interface DocsDao {
	public List<Docs> getDocs(Docs searcher);
	public Docs getDoc(Docs searcher);
	public Docs getDocByPath(Docs searcher);
	public Integer createDoc(Docs doc);
	
}
