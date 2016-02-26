package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.LoginDetail;

import java.util.List;

public interface LoginDetailMapper {

    List<LoginDetail> getLoginDetailByUserId(int userId);

    int insertLoginDetail(LoginDetail loginDetail);

    int updateLoginDetail(String token);

    LoginDetail getLoginDetailByToken(String token);

}
