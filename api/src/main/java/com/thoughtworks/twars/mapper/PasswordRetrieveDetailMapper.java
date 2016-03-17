package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.PasswordRetrieveDetail;

public interface PasswordRetrieveDetailMapper {

    int insertDetail(PasswordRetrieveDetail passwordRetrieveDetail);

    PasswordRetrieveDetail getDetailByToken(String token);

    PasswordRetrieveDetail getDetailByEmail(String email);

    int updateDetailByEmail(String email);

    int setNullToken(String email);
}
