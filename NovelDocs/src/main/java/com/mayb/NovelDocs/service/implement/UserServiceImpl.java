package com.mayb.NovelDocs.service.implement;

import org.springframework.stereotype.Service;

import com.mayb.NovelDocs.dao.UserDao;
import com.mayb.NovelDocs.model.User;
import com.mayb.NovelDocs.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	private final UserDao userDao;
	
	@Override
	public User getUserByUsername(String username) {
		return userDao.getUserByUsername(username);
	}
	@Override
	public User getUserByNickname(String nickname) {
		return userDao.getUserByNickname(nickname);
	}
}
