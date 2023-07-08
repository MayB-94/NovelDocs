package com.mayb.NovelDocs.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mayb.NovelDocs.dao.OpenfileDao;
import com.mayb.NovelDocs.model.Openfile;
import com.mayb.NovelDocs.model.User;
import com.mayb.NovelDocs.service.OpenfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OpenfileServiceImpl implements OpenfileService {
	private final OpenfileDao openfileDao;
	
	@Override
	public Integer insertOpenfile(Openfile openfile) {
		return openfileDao.insertOpenfile(openfile);
	}
	@Override
	public List<Openfile> getOpenfiles(User user) {
		return openfileDao.getOpenfiles(user);
	}
}
