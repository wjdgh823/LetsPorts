package com.koreait.project.hyejoon.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.koreait.project.hyejoon.command.UsersLoginCommand;
import com.koreait.project.hyejoon.config.HyeAppContext;
import com.koreait.project.wooki.dto.UsersDto;

@Controller
public class UsersController {
	
	@Autowired
	private SqlSession sqlSession;
	private AbstractApplicationContext ctx = new AnnotationConfigApplicationContext(HyeAppContext.class);
	
	
	// header페이지에서 '로그인' 버튼 클릭시 로그인 페이지로 이동한다.
	@RequestMapping(value="usersLoginPage.hey")
	public String usersLoginPage(UsersDto usersDto, 
									HttpServletRequest request, 
									RedirectAttributes redirect, 
									Model model) {
		UsersLoginCommand usersLoginCommand = ctx.getBean("usersLoginCommand", UsersLoginCommand.class);
		model.addAttribute("redirect", redirect);
		model.addAttribute("request", request);
		model.addAttribute("usersDto", usersDto);
		usersLoginCommand.execute(sqlSession, model);
		return "redirect:hyePages/usersLoginPage";
	}
	
}
