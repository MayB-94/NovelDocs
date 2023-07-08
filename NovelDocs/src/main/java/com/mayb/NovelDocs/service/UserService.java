package com.mayb.NovelDocs.service;

import com.mayb.NovelDocs.model.User;

public interface UserService {
	public User getUserByUsername(String username);
	public User getUserByNickname(String nickname);
	
}
