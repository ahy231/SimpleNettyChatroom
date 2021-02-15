package com.ahy231.simplenettychatgroup.service;

import org.springframework.stereotype.Service;

@Service
public class LoginService {

    public boolean checkUser(String name, String password) {
        if (name == null) return false;
        // TODO: check user in database
        if (name.equals("admin")) return false;
        return true;
    }
}
