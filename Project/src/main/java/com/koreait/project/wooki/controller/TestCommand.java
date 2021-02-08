package com.koreait.project.wooki.controller;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.springframework.ui.Model;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

public class TestCommand {
	public Map<String, Object> test(MultipartHttpServletRequest multipartRequest, Model model) {
		
		// 1. multipartRequest에 저장된 첨부가 1개일 때는 getFile()을 씁니다.
		/*
			<input type="file" name="filename" /> 일 때
			MultipartFile file = multipartRequest.getFile("filename");
		*/
		
		// 2. multipartRequest에 저장된 첨부가 multiple일 때는 getFiles()를 씁니다.
		// 첨부타입이 multiple이면 첨부된 파일들은 List에 저장되어 넘어온
		// 각 첨부 파일들의 타입은 MultipartFile입니다.
		/*
			<input type="file" name="files" multiple />일 때
			List<MultipartFile> files = multipartRequest.getFiles ("files");
		*/
		MultipartFile file = multipartRequest.getFile("upload");
		Map<String, Object> map = new HashMap<>();

		// 첨부를 했는지 검사
		// 꺼낸 첨부가 있는지 검사
		if(file != null && !file.isEmpty()) {
			// MultipartFile file에서 첨부하는 파일명을 알아냅니다.
			String originalFilename = file.getOriginalFilename();

			// 업로드 할 파일명의 중복 방지 대책을 수립합니다.
			int pos = originalFilename.lastIndexOf(".");
			// 확장자
			String extension = originalFilename.substring(pos + 1);
			// 파일명
			String baseFilename = originalFilename.substring(0, pos);
			String uploadFilename = baseFilename + "_" + System.currentTimeMillis() + "." + extension;
			
			// 업로드 할 경로 구하기 resources/storage 디렉토리에 저장하기로 합니다.
			String realPath = multipartRequest.getServletContext().getRealPath("/resources/storage/boardsPhoto");
			
			// 업로드 할 경로가 없으면 storage 디렉토리를 만듭니다.
			File dir = new File(realPath);
			if(!dir.exists()) {
				dir.mkdirs();
			}
			
			// 이제 업로드 할 파일명(uploadFilename)과 경로(realPath)를 모두 알고 있습니다.
			File uploadFile = new File(realPath, uploadFilename);
			
			// 첨부한 파일(MultipartFile file) -> 업로드(uploadFile) 합니다.
			try {
				file.transferTo(uploadFile);
			} catch (Exception e) {
				e.printStackTrace();
			}
			map.put("filename", uploadFilename);
		}
		
		return map;
	}
}
