package com.mayb.NovelDocs.dao.implement;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.mayb.NovelDocs.dao.DirectoryDao;
import com.mayb.NovelDocs.model.Directory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DirectoryDaoImpl implements DirectoryDao {
	private final SqlSession session;
	
	@Override
	public List<Directory> getSubdirectory(Directory searcher) {
		return session.selectList("getSubdirectory", searcher);
	}
	@Override
	public Integer createSubdirectory(Directory directory) {
		try { return session.insert("createSubdirectory", directory); }
		catch (Exception e) { return 0; }
	}
	@Override
	public List<Directory> getConnectedDirectories(Directory searcher) {
		return session.selectList("getConnectedDirectories", searcher);
	}
}
