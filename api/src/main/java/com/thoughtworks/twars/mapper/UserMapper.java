package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.User;
import com.thoughtworks.twars.bean.UserDetail;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper {

    int insertUser(User user);

    User getUserById(int id);

    User getUserByEmail(String email);

    User getUserByMobilePhone(String mobilePhone);

    User getUserByEmailAndPassWord(User user);

    User getUserByMobilePhoneAndPassWord(User user);

    UserDetail getUserDetailById(int userId);

    int updateUserDetail(UserDetail detail);

    int updatePassword(
            @Param("id") int id,
            @Param("oldPassword") String oldPassword,
            @Param("password") String password);

    int resetPassword(User user);

    List<UserDetail> findUserDetailsByUserIds(List<Integer> userIds);

    List<User> findUsersByUserIds(List<Integer> userIds);
}
