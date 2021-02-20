package com.ahy231.simplenettychatgroup.controller;

import com.ahy231.simplenettychatgroup.pojo.User;
import com.ahy231.simplenettychatgroup.service.LoginService;
import com.ahy231.simplenettychatgroup.service.UserService;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    LoginService loginService;

    @Autowired
    UserService userService;

    @RequestMapping("/main.html")
    public String main(HttpServletRequest request, RedirectAttributes attr) {
        HttpSession session = request.getSession();
        String username = (String) session.getAttribute("username");
        String password = (String) attr.getAttribute("password");
        if (loginService.checkUser(username, password)) {
            return "user/main";
        } else {
            attr.addFlashAttribute("tip", "用户名或密码错误！");
            return "redirect:/";
        }
    }

    @ResponseBody
    @PostMapping("/logout")
    public String logout(HttpServletRequest request) {
        HttpSession session = request.getSession();
        String username = (String) session.getAttribute("username");
        return username + "登出成功！";
    }

    @ResponseBody
    @PostMapping("/search")
    public String search(String msg) throws CloneNotSupportedException {
        User user;
        if (msg.matches("^[0-9]*$")) {
            long phone = Long.parseLong(msg);
            user = userService.getUser(phone);
        } else {
            String name = msg;
            user = userService.getUser(name);
        }
        if (user != null) {
            List<User> users = new ArrayList<>();
            users.add(user);
            users.add(user.clone());
            users.add(user.clone());
            users.add(user.clone());
            users.add(user.clone());
            users.add(user.clone());
            users.add(user.clone());
            return packageUserArrayAsJson(users).toJSONString();
        } else {
            return "";
        }
    }

    private JSONArray packageUserArrayAsJson(List<User> users) {
        JSONArray jsonArray = new JSONArray();
        jsonArray.addAll(users);
        return jsonArray;
    }

    @ResponseBody
    @PostMapping("/send")
    public String send(String username, String text, String to) {
        System.out.println("username: " + username);
        System.out.println("text: " + text);
        System.out.println("to: " + to);
        return "OK";
    }
}
