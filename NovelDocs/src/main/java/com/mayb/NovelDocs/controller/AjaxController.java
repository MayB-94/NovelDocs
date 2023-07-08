package com.mayb.NovelDocs.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mayb.NovelDocs.model.Directory;
import com.mayb.NovelDocs.model.Docs;
import com.mayb.NovelDocs.model.User;
import com.mayb.NovelDocs.security.UserDetailsImpl;
import com.mayb.NovelDocs.service.DirectoryService;
import com.mayb.NovelDocs.service.DocsService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping(value = "/ajax")
@RequiredArgsConstructor
public class AjaxController {
	private final DirectoryService directoryService;
	private final DocsService docsService;
	
	@ResponseBody
	@PostMapping(value = "/getDirectoryInfo")
	public Map<String, Object> getDirectoryInfo(@RequestBody Map<String, Object> data) {
		Map<String, Object> result = new HashMap<>();
		String currentPath = (String)data.get("path");
		List<Directory> subdirectory = directoryService.getSubdirectory(currentPath);
		List<Docs> doc = docsService.getDocs(currentPath);
		result.put("subdirectories", subdirectory);
		result.put("docs", doc);
		return result;
	}
	@ResponseBody
	@PostMapping(value = "/getDocInfo")
	public Map<String, Object> getDocInfo(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Map<String, Object> data) {
		Map<String, Object> result = new HashMap<>();
		User user = new User();
		user.setId(userDetails.getUser().getId());
		String virtual_dir = (String)data.get("directory");
		String title = (String)data.get("filename");
		Docs searcher = new Docs();
		searcher.setVirtual_dir(virtual_dir);
		searcher.setTitle(title);
		searcher.setReguser(user);
		Docs doc = docsService.getDocByPath(searcher);
		if (doc != null) {
			result.put("docs_id", doc.getDocs_id());
			result.put("writer", doc.getReguser().getNickname());
		}
		return result;
	}
}
