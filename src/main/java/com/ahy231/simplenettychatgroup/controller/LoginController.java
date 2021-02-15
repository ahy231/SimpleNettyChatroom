package com.ahy231.simplenettychatgroup.controller;

import com.ahy231.simplenettychatgroup.service.LoginService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Log4j2
@Controller
@RequestMapping("/")
public class LoginController {

    @Autowired
    LoginService loginService;

    @RequestMapping("/")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String register1() {
        return "register";
    }

    @PutMapping("/register")
    public String register2() {
        // TODO: register an account in database
        return "login";
    }

    @PostMapping("/login")
    public String login(HttpServletRequest request, String username, String password, RedirectAttributes attr) throws ServletException, IOException {
        HttpSession session = request.getSession();
        session.setAttribute("username", username);
        attr.addFlashAttribute("password", password);
        return "redirect:/user/main.html";
    }
}
