package com.ahy231.simplenettychatgroup.pojo;

import lombok.Data;

@Data
public class User implements Cloneable {
    private String name;
    private Long phone;

    public User() {
    }

    public User(String name, Long phone) {
        this.name = name;
        this.phone = phone;
    }

    @Override
    public User clone() throws CloneNotSupportedException {
        return (User) super.clone();
    }
}
