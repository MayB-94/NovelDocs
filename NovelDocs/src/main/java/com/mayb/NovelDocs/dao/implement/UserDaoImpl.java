package com.mayb.NovelDocs.dao.implement;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.mayb.NovelDocs.dao.UserDao;
import com.mayb.NovelDocs.model.User;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserDaoImpl implements UserDao {
	private final SqlSession session;
	
	@Override
	public User getUserByUsername(String username) {
		return session.selectOne("getUserByUsername", username);
	}
	@Override
	public User getUserByNickname(String nickname) {
		return session.selectOne("getUserByNickname", nickname);
	}
}
