package com.mayb.NovelDocs.dao.implement;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.mayb.NovelDocs.dao.DocsDao;
import com.mayb.NovelDocs.model.Docs;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DocsDaoImpl implements DocsDao {
	private final SqlSession session;
	
	@Override
	public List<Docs> getDocs(Docs searcher) {
		return session.selectList("getDocs", searcher);
	}
	@Override
	public Docs getDoc(Docs searcher) {
		return session.selectOne("getDoc", searcher);
	}
	@Override
	public Docs getDocByPath(Docs searcher) {
		return session.selectOne("getDocByPath", searcher);
	}
	@Override
	public Integer createDoc(Docs doc) {
		try { return session.insert("createDoc", doc); }
		catch (Exception e) { return 0; }
	}
}
