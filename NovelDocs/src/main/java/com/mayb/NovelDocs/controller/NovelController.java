package com.mayb.NovelDocs.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.mayb.NovelDocs.model.Docs;
import com.mayb.NovelDocs.model.Openfile;
import com.mayb.NovelDocs.model.User;
import com.mayb.NovelDocs.security.UserDetailsImpl;
import com.mayb.NovelDocs.service.DocsService;
import com.mayb.NovelDocs.service.OpenfileService;
import com.mayb.NovelDocs.service.UserService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/docs")
public class NovelController {
	private final DocsService docsService;
	private final OpenfileService openfileService;
	private final UserService userService;
	
	@GetMapping(value = "/{writer}/{docs_id}")
	public String write(@AuthenticationPrincipal UserDetailsImpl userDetails,
							@PathVariable String writer, @PathVariable Integer docs_id,
							Model model) {
		User user = userService.getUserByNickname(writer);
		Docs searcher = new Docs();
		searcher.setDocs_id(docs_id);
		searcher.setReguser(user);
		Docs docs = docsService.getDoc(searcher);
		if (!docs.getExposetype().equals("public") && (userDetails == null || !userDetails.getUser().getId().equals(user.getId()))) return "redirect:/";
		else {
			Openfile openfile = new Openfile();
			openfile.setDocs(docs);
			openfile.setOpenuser(userDetails.getUser()); // 비로그인 접근 시 여기서 문제 발생
			openfileService.insertOpenfile(openfile);
		}
		model.addAttribute("doc", docs);
		return "write.layout";
	}
}
