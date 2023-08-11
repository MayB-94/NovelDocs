package com.mayb.NovelDocs.dao.implement;

import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.mayb.NovelDocs.dao.UpdatefileDao;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UpdatefileDaoImpl implements UpdatefileDao {
	private final SqlSession session;
	
	@Override
	public void updateDocs(Map<String, Object> param) {
		session.selectOne("saveDoc", param);
	}
}
