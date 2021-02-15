package com.ahy231.simplenettychatgroup.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        HttpSession session = request.getSession();

        if (session.getAttribute("login") == null) {
            request.setAttribute("tip", "没有权限，请先登录！");
            request.getRequestDispatcher("/").forward(request, response);
            return false;
        }

        return true;
    }
}
