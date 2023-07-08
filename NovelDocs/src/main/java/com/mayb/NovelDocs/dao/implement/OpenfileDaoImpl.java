package com.mayb.NovelDocs.dao.implement;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.mayb.NovelDocs.dao.OpenfileDao;
import com.mayb.NovelDocs.model.Openfile;
import com.mayb.NovelDocs.model.User;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OpenfileDaoImpl implements OpenfileDao {
	private final SqlSession session;
	
	@Override
	public Integer insertOpenfile(Openfile openfile) {
		return session.insert("insertOpenfile", openfile);
	}
	@Override
	public List<Openfile> getOpenfiles(User user) {
		return session.selectList("getOpenfiles", user);
	}
}
