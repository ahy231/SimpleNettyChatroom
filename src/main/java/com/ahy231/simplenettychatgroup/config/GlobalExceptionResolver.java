package com.ahy231.simplenettychatgroup.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Configuration
public class GlobalExceptionResolver implements HandlerExceptionResolver {

    public static final String DEFAULT_VIEW_NAME = "error";

    @Override
    public ModelAndView resolveException(@NotNull HttpServletRequest httpServletRequest, @NotNull HttpServletResponse httpServletResponse, Object o, @NotNull Exception e) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("msg", e);
        modelAndView.setViewName(DEFAULT_VIEW_NAME);

        return modelAndView;
    }
}
