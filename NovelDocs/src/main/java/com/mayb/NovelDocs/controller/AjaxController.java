package com.mayb.NovelDocs.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.codec.binary.Base64;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
	public Map<String, Object> getDirectoryInfo(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Map<String, Object> data) {
		Map<String, Object> result = new HashMap<>();
		String currentPath = (String)data.get("path");
		Directory searcher = new Directory();
		searcher.setParent(currentPath);
		searcher.setReguser(userDetails.getUser().getId());
		List<Directory> subdirectory = directoryService.getSubdirectory(searcher);
		Docs searcherDocs = new Docs();
		searcherDocs.setVirtual_dir(currentPath);
		searcherDocs.setReguser(userDetails.getUser());
		List<Docs> doc = docsService.getDocs(searcherDocs);
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
			result.put("writer", doc.getReguser().getId());
		}
		return result;
	}
	@ResponseBody
	@PostMapping(value = "/createDoc")
	public Map<String, Object> createDoc(@AuthenticationPrincipal UserDetailsImpl userDetails,
													 @RequestBody Map<String, Object> data) {
		Map<String, Object> result = new HashMap<>();
		
		String docTitle = (String)data.get("doc-title");
		String docDir = (String)data.get("doc-dir");
		String exposetype = (String)data.get("exposetype");
		Docs doc = new Docs();
		doc.setTitle(docTitle);
		doc.setVirtual_dir(docDir);
		doc.setReguser(userDetails.getUser());
		doc.setExposetype(exposetype);
		Integer queryResult = 0;
		queryResult = docsService.createDoc(doc);
		
		result.put("result", queryResult);
		return result;
	}
	@ResponseBody
	@PostMapping(value = "/createSubdirectory")
	public Map<String, Object> createSubdirectory(@AuthenticationPrincipal UserDetailsImpl userDetails,
																@RequestBody Map<String, Object> data) {
		Map<String, Object> result = new HashMap<>();
		
		String directoryName = (String)data.get("directory-name");
		String directoryParent = (String)data.get("directory-parent");
		Directory directory = new Directory();
		directory.setName(directoryName);
		directory.setParent(directoryParent);
		directory.setReguser(userDetails.getUser().getId());
		Integer queryResult = 0;
		queryResult = directoryService.createSubdirectory(directory);
		
		result.put("result", queryResult);
		return result;
	}
	private void compress(File file, String filename, ZipOutputStream zipOut) throws IOException {
		if (file.isHidden()) return;
		if (file.isDirectory()) {
			if (filename.endsWith("/")) {
				zipOut.putNextEntry(new ZipEntry(filename));
				zipOut.closeEntry();
			} else {
				zipOut.putNextEntry(new ZipEntry(filename + "/"));
				zipOut.closeEntry();
			}
			File[] children = file.listFiles();
			for (File child : children) compress(child, filename + "/" + child.getName(), zipOut);
			return;
		}
		FileInputStream fis = new FileInputStream(file);
		ZipEntry zipEntry = new ZipEntry(filename);
		zipOut.putNextEntry(zipEntry);
		byte[] bytes = new byte[1024];
		int length;
		while ((length = fis.read(bytes)) >= 0) zipOut.write(bytes, 0, length);
		fis.close();
	}
	@ResponseBody
	@PostMapping(value = "/downloadDirectory")
	public Map<String, Object> downloadDirectory(@AuthenticationPrincipal UserDetailsImpl userDetails,
															    HttpServletRequest request, HttpServletResponse response,
															    @RequestBody Map<String, Object> data) {
		response.setCharacterEncoding("UTF-8");
		Map<String, Object> result = new HashMap<>();
		
		String ancestor = (String)data.get("path");
		Directory dirSearcher = new Directory();
		dirSearcher.setParent(ancestor);
		dirSearcher.setReguser(userDetails.getUser().getId());
		Docs searcherDocs = new Docs();
		searcherDocs.setVirtual_dir(ancestor);
		searcherDocs.setReguser(userDetails.getUser());
		List<Directory> subdirectories = directoryService.getConnectedDirectories(dirSearcher);
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss");
		String lastDir = (ancestor.equals("/") ? "root" : ancestor).split("/")[(ancestor.equals("/") ? "root" : ancestor).split("/").length - 1];
		String rootDir = String.format("%s_%s_%s", userDetails.getUser().getNickname(), (ancestor.equals("/") ? "root" : lastDir), sdf.format(new Date()));
		File workDir = new File(request.getServletContext().getRealPath("/workbench") + File.separator + rootDir);
		workDir.mkdir();
		String realPath = request.getServletContext().getRealPath("/workbench/" + rootDir);
		try {
			List<Docs> rootDocs = docsService.getDocs(searcherDocs);
			for (Docs doc : rootDocs) {
				Path docPath = Paths.get((realPath + (doc.getVirtual_dir().equals("/") ? "" : "/" + doc.getVirtual_dir().substring(ancestor.length())) + "/" + doc.getTitle() + ".txt").replace("/", File.separator));
				Files.writeString(docPath, doc.getContent() == null ? "" : doc.getContent(), StandardCharsets.UTF_8);
			}
			for (Directory dir : subdirectories) {
				String dirPath = realPath + (dir.getParent().equals("/") ? "" : "/" + dir.getParent().substring(ancestor.length())).replace("/", File.separator) + File.separator + dir.getName();
				File subdir = new File(dirPath);
				if (!subdir.exists()) subdir.mkdir();
				searcherDocs.setVirtual_dir((dir.getParent().equals("/") ? "" : dir.getParent()) + "/" + dir.getName());
				List<Docs> docs = docsService.getDocs(searcherDocs);
				for (Docs doc : docs) {
					Path docPath = Paths.get((realPath + (doc.getVirtual_dir().equals("/") ? "" : "/" + doc.getVirtual_dir().substring(ancestor.length())) + "/" + doc.getTitle() + ".txt").replace("/", File.separator));
					Files.writeString(docPath, doc.getContent() == null ? "" : doc.getContent(), StandardCharsets.UTF_8);
				}
			}
			// Zip file로 만들어서 byte[]로 변환 후, base64 Encoding
			String source = workDir.getAbsolutePath();
			FileOutputStream fos = new FileOutputStream(request.getServletContext().getRealPath("/workbench/") + rootDir + ".zip");
			ZipOutputStream zipOut = new ZipOutputStream(fos, StandardCharsets.UTF_8);
			File file = new File(source);
			compress(file, file.getName(), zipOut);
			zipOut.close();
			fos.close();
			// Zip file Download
			byte[] fileByte = Files.readAllBytes(Paths.get(request.getServletContext().getRealPath("/workbench/") + rootDir + ".zip"));
			result.put("data", new String(Base64.encodeBase64(fileByte)));
			result.put("filename", rootDir + ".zip");
			result.put("result", 1);
			return result;
		} catch (IOException e) {
			e.printStackTrace();
			result.put("result", 0);
			return result;
		} finally {
			try {
				if (Files.exists(Paths.get(realPath))) {
					Files.walk(workDir.toPath()).sorted(Comparator.reverseOrder()).map(Path::toFile).forEach(File::delete);
				} else Files.deleteIfExists(Paths.get(realPath));
				Files.deleteIfExists(Paths.get(request.getServletContext().getRealPath("/workbench/") + rootDir + ".zip"));
			} catch (IOException e) { e.printStackTrace(); }
		}
	}
	@ResponseBody
	@PostMapping(value = "/downloadDocs")
	public Map<String, Object> downloadDocs(@AuthenticationPrincipal UserDetailsImpl userDetails,
															HttpServletRequest request, HttpServletResponse response,
															@RequestBody Map<String, Object> data) {
		response.setCharacterEncoding("UTF-8");
		Map<String, Object> result = new HashMap<>();
		
		String ancestor = (String)data.get("path");
		Docs searcherDocs = new Docs();
		searcherDocs.setVirtual_dir(ancestor);
		searcherDocs.setReguser(userDetails.getUser());
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss");
		String lastDir = (ancestor.equals("/") ? "root" : ancestor).split("/")[(ancestor.equals("/") ? "root" : ancestor).split("/").length - 1];
		String rootDir = String.format("%s_%s_%s", userDetails.getUser().getNickname(), (ancestor.equals("/") ? "root" : lastDir), sdf.format(new Date()));
		File workDir = new File(request.getServletContext().getRealPath("/workbench") + File.separator + rootDir);
		workDir.mkdir();
		String realPath = request.getServletContext().getRealPath("/workbench/" + rootDir);
		try {
			List<Docs> rootDocs = docsService.getDocs(searcherDocs);
			for (Docs doc : rootDocs) {
				Path docPath = Paths.get((realPath + (doc.getVirtual_dir().equals("/") ? "" : "/" + doc.getVirtual_dir().substring(ancestor.length())) + "/" + doc.getTitle() + ".txt").replace("/", File.separator));
				Files.writeString(docPath, doc.getContent() == null ? "" : doc.getContent(), StandardCharsets.UTF_8);
			}
			// Zip file로 만들어서 byte[]로 변환 후, base64 Encoding
			String source = workDir.getAbsolutePath();
			FileOutputStream fos = new FileOutputStream(request.getServletContext().getRealPath("/workbench/") + rootDir + ".zip");
			ZipOutputStream zipOut = new ZipOutputStream(fos, StandardCharsets.UTF_8);
			File file = new File(source);
			compress(file, file.getName(), zipOut);
			zipOut.close();
			fos.close();
			// Zip file Download
			byte[] fileByte = Files.readAllBytes(Paths.get(request.getServletContext().getRealPath("/workbench/") + rootDir + ".zip"));
			result.put("data", new String(Base64.encodeBase64(fileByte)));
			result.put("filename", rootDir + ".zip");
			result.put("result", 1);
			return result;
		} catch (IOException e) {
			result.put("result", 0);
			return result;
		} finally {
			try {
				if (Files.exists(Paths.get(realPath))) {
					Files.walk(workDir.toPath()).sorted(Comparator.reverseOrder()).map(Path::toFile).forEach(File::delete);
				} else Files.deleteIfExists(Paths.get(realPath));
				Files.deleteIfExists(Paths.get(request.getServletContext().getRealPath("/workbench/") + rootDir + ".zip"));
			} catch (IOException e) { e.printStackTrace(); }
		}
	}
	@ResponseBody
	@PostMapping(value = "/downloadSelection")
	public Map<String, Object> downloadSelection(@AuthenticationPrincipal UserDetailsImpl userDetails,
																HttpServletRequest request, HttpServletResponse response,
																@RequestBody Map<String, Object> data) {
		Map<String, Object> result = new HashMap<>();
		
		String path = (String)data.get("path");
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss");
		String workFolderName = String.format("%s_%s_%s", userDetails.getUser().getNickname(), "download", sdf.format(new Date()));
		File workDir = new File(request.getServletContext().getRealPath("/workbench") + File.separator + workFolderName);
		if (!workDir.exists()) workDir.mkdirs();
		@SuppressWarnings("unchecked")
		List<LinkedHashMap<String, Object>> itemsData = (ArrayList<LinkedHashMap<String, Object>>)data.get("items");
		if (itemsData.size() == 1 && itemsData.get(0).get("type").equals("file")) {
			// 텍스트 파일로 내보내기
			try {
				String type = (String)itemsData.get(0).get("type");
				String name = (String)itemsData.get(0).get("name");
				Docs searcher = new Docs();
				searcher.setTitle(name);
				searcher.setVirtual_dir(path);
				searcher.setReguser(userDetails.getUser());
				Docs doc = docsService.getDocByPath(searcher);
				Files.writeString(Paths.get(workDir.getAbsolutePath() + File.separator + name + ".txt"), doc.getContent() == null ? "" : doc.getContent(), StandardCharsets.UTF_8);
				byte[] fileData = Files.readAllBytes(Paths.get(workDir.getAbsolutePath() + File.separator + name + ".txt"));
				result.put("data", new String(Base64.encodeBase64(fileData)));
				result.put("filename", name + ".txt");
				result.put("result", 1);
			} catch (IOException e) {
				result.put("result", 0);
			} finally {
				try {
					if (Files.exists(Paths.get(workDir.getAbsolutePath()))) {
						Files.walk(workDir.toPath()).sorted(Comparator.reverseOrder()).map(Path::toFile).forEach(File::delete);
					} else Files.deleteIfExists(Paths.get(workDir.getAbsolutePath()));
				}
				catch (Exception e) { e.printStackTrace(); }
			}
		} else {
			for (LinkedHashMap<String, Object> item : itemsData) {
				String type = (String)item.get("type");
				String name = (String)item.get("name");
				switch (type) {
					case "folder":
						Directory searcher = new Directory();
						searcher.setName(name);
						searcher.setParent((path.equals("/") ? "" : path) + "/" + name);
						searcher.setReguser(userDetails.getUser().getId());
						List<Directory> dirList = directoryService.getConnectedDirectories(searcher);
						File currentFolder = new File(workDir.getAbsolutePath() + File.separator + name);
						if (!currentFolder.exists()) currentFolder.mkdir();
						Docs searchDoc = new Docs();
						searchDoc.setVirtual_dir((searcher.getParent().equals("/") ? "" : searcher.getParent()));
						searchDoc.setReguser(userDetails.getUser());
						List<Docs> initialDocs = docsService.getDocs(searchDoc);
						for (Docs doc : initialDocs) {
							String filePath = currentFolder.getAbsolutePath() + File.separator + doc.getTitle() + ".txt";
							try { Files.writeString(Paths.get(filePath), doc.getContent() == null ? "" : doc.getContent(), StandardCharsets.UTF_8); }
							catch (IOException e) {  }
						}
						for (Directory dir : dirList) {
							String currentPath = dir.getParent() + "/" + dir.getName();
							String relativePath = "/" + currentPath.substring(path.length());
							File folder = new File((workDir.getAbsolutePath() + relativePath).replace("/", File.separator));
							if (!folder.exists()) folder.mkdir();
							Docs searcherSubDoc = new Docs();
							searcherSubDoc.setVirtual_dir(currentPath);
							searcherSubDoc.setReguser(userDetails.getUser());
							List<Docs> subdirDocs = docsService.getDocs(searcherSubDoc);
							for (Docs doc : subdirDocs) {
								String filePath = folder.toPath().toAbsolutePath() + File.separator + doc.getTitle() + ".txt";
								try { Files.writeString(Paths.get(filePath), doc.getContent() == null ? "" : doc.getContent(), StandardCharsets.UTF_8); }
								catch (IOException e) {  }
							}
						}
						break;
					case "file":
						Docs searcherDoc = new Docs();
						searcherDoc.setTitle(name);
						searcherDoc.setVirtual_dir(path);
						searcherDoc.setReguser(userDetails.getUser());
						Docs doc = docsService.getDocByPath(searcherDoc);
						try { Files.writeString(Paths.get(workDir.getAbsolutePath() + File.separator + name + ".txt"), doc.getContent() == null ? "" : doc.getContent(), StandardCharsets.UTF_8); }
						catch (IOException e) {  }
						break;
					default: break;
				}
			}
			try {
				// Zip file로 만들어서 byte[]로 변환 후, base64 Encoding
				String source = workDir.getAbsolutePath();
				FileOutputStream fos = new FileOutputStream(workDir.getAbsolutePath() + ".zip");
				ZipOutputStream zipOut = new ZipOutputStream(fos, StandardCharsets.UTF_8);
				File file = new File(source);
				compress(file, file.getName(), zipOut);
				zipOut.close();
				fos.close();
				// Zip file Download
				byte[] fileByte = Files.readAllBytes(Paths.get(workDir.getAbsolutePath() + ".zip"));
				result.put("data", new String(Base64.encodeBase64(fileByte)));
				result.put("filename", workFolderName + ".zip");
				result.put("result", 1);
			} catch (Exception e) {
				result.put("result", 0);
			} finally {
				try {
					if (Files.exists(Paths.get(workDir.getAbsolutePath()))) {
						Files.walk(workDir.toPath()).sorted(Comparator.reverseOrder()).map(Path::toFile).forEach(File::delete);
					} else Files.deleteIfExists(Paths.get(workDir.getAbsolutePath()));
					Files.deleteIfExists(Paths.get(workDir.getAbsolutePath() + ".zip"));
				}
				catch (Exception e) { e.printStackTrace(); }
			}
		}
		
		return result;
	}
	
	@ResponseBody
	@PostMapping(value = "/saveDocument")
	public Map<String, Object> saveDocument(@AuthenticationPrincipal UserDetailsImpl userDetails,
														   @RequestBody Map<String, Object> data) {
		Map<String, Object> result = new HashMap<>();
		String id = (String)data.get("id");
		Integer docNum = (Integer)data.get("docNum");
		String content = (String)data.get("content");
		
		
		
		return result;
	}
}
