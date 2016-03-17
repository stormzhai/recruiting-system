package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.LoginDetail;

import java.util.List;

public interface LoginDetailMapper {

    List<LoginDetail> getLoginDetailByUserId(int userId);

    int insertLoginDetail(int userId);

    int updateLoginDetail(String token);

    int updateLoginDetailById(int id);

    LoginDetail getLoginDetailByToken(String token);

}
