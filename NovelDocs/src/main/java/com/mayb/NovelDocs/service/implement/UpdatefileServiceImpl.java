package com.mayb.NovelDocs.service.implement;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.mayb.NovelDocs.dao.UpdatefileDao;
import com.mayb.NovelDocs.service.UpdatefileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdatefileServiceImpl implements UpdatefileService {
	private final UpdatefileDao updatefileDao;
	
	@Override
	public void updateDocs(Map<String, Object> param) {
		updatefileDao.updateDocs(param);
	}
}
