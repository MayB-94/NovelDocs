package com.mayb.NovelDocs.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.mayb.NovelDocs.model.Directory;
import com.mayb.NovelDocs.model.Docs;
import com.mayb.NovelDocs.model.Openfile;
import com.mayb.NovelDocs.security.UserDetailsImpl;
import com.mayb.NovelDocs.service.DirectoryService;
import com.mayb.NovelDocs.service.DocsService;
import com.mayb.NovelDocs.service.OpenfileService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class HomeController {
	private final DirectoryService directoryService;
	private final DocsService docsService;
	private final OpenfileService openfileService;
	
	@RequestMapping(value = "/")
	public String index(@AuthenticationPrincipal UserDetailsImpl userDetails, Model model) {
		Directory searcher = new Directory();
		searcher.setParent("/");
		searcher.setReguser(userDetails.getUser().getId());
		Docs searcherDocs = new Docs();
		searcherDocs.setVirtual_dir("/");
		searcherDocs.setReguser(userDetails.getUser());
		List<Directory> subdirectories = directoryService.getSubdirectory(searcher);
		List<Docs> docs = docsService.getDocs(searcherDocs);
		List<Openfile> openfiles = openfileService.getOpenfiles(userDetails.getUser());
		model.addAttribute("subdirectories", subdirectories);
		model.addAttribute("docs", docs);
		model.addAttribute("openfiles", openfiles);
		return "index.layout";
	}
	@GetMapping(value = "/login")
	public String login() {
		return "login";
	}
}
