package com.ahy231.simplenettychatgroup.service;

import com.ahy231.simplenettychatgroup.pojo.User;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public User getUser(String name) {
        return new User(name, 19888888888L);
    }

    public User getUser(Long phone) {
        return new User("ahy231", phone);
    }
}
