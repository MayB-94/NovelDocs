package com.mayb.NovelDocs.dao;

import com.mayb.NovelDocs.model.User;

public interface UserDao {
	public User getUserByUsername(String username);
	public User getUserByNickname(String nickname);
	
}
