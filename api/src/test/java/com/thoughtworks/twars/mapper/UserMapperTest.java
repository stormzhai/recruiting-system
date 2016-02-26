package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.User;
import com.thoughtworks.twars.bean.UserDetail;
import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class UserMapperTest extends TestBase {

    private UserMapper userMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        userMapper = session.getMapper(UserMapper.class);
    }

    @Test
    public void should_return_user_by_id() throws Exception {
        User user = userMapper.getUserById(1);
        assertThat(user.getMobilePhone(), is("12345678901"));
    }

    @Test
    public void should_return_user_by_email() throws Exception {
        User user = userMapper.getUserByEmail("test@163.com");
        assertThat(user.getMobilePhone(), is("12345678901"));
    }

    @Test
    public void should_return_user_by_mobile_phone() throws Exception {
        User user = userMapper.getUserByMobilePhone("12345678901");
        assertThat(user.getEmail(), is("test@163.com"));
    }

    @Test
    public void should_return_user_by_email_and_password() throws Exception {
        User user = new User();
        user.setEmail("test@163.com");
        user.setPassword("25d55ad283aa400af464c76d713c07ad");

        User resultUser = userMapper.getUserByEmailAndPassWord(user);
        assertThat(resultUser.getMobilePhone(), is("12345678901"));
    }

    @Test
    public void should_add_user() throws Exception {
        User user = new User();

        user.setEmail("test3@163.com");
        user.setMobilePhone("123456789012");
        user.setPassword("18928392811");

        userMapper.insertUser(user);

        assertThat(user.getId(), is(7));
    }

    @Test
    public void should_update_user_detail() throws Exception {
        UserDetail userDetail = new UserDetail();

        userDetail.setGender("F");
        userDetail.setUserId(1);
        userDetail.setDegree("benke");
        userDetail.setMajor("cs");
        userDetail.setSchool("xi'an");
        userDetail.setName("purple");
        userDetail.setBirthday(2);

        userMapper.updateUserDetail(userDetail);

        assertThat(userDetail.getUserId(),is(1));
    }

    @Test
    public void should_insert_user_detail() throws Exception {
        UserDetail userDetail = new UserDetail();

        userDetail.setBirthday(3);
        userDetail.setGender("F");
        userDetail.setDegree("benke");
        userDetail.setSchool("shannxi");
        userDetail.setUserId(5);
        userDetail.setMajor("sc");
        userDetail.setName("purple");

        userMapper.updateUserDetail(userDetail);

        assertThat(userDetail.getUserId(),is(5));
    }

    @Test
    public void should_return_user_detail_by_id() throws Exception {
        UserDetail detail = userMapper.getUserDetailById(1);

        assertThat(detail.getUserId(), is(1));
        assertThat(detail.getSchool(), is("思沃学院"));
        assertThat(detail.getName(), is("测试一"));
        assertThat(detail.getMajor(), is("计算机"));
        assertThat(detail.getDegree(), is("本科"));
        assertThat(detail.getGender(), is("F"));
        assertThat(detail.getBirthday(), is(0));
    }

    @Test
    public void should_encrypt_password_when_create_new_user () throws Exception {
        User newUser = new User();
        newUser.setEmail("jingjing@qq.com");
        newUser.setMobilePhone("13576826262");
        newUser.setPassword("123");
        int result = userMapper.insertUser(newUser);
        int userId = newUser.getId();
        User addedUser = userMapper.getUserById(userId);

        assertThat(result, is(1));

        assertThat(addedUser.getPassword(), is("202cb962ac59075b964b07152d234b70"));
    }


    @Test
    public void should_update_password() throws Exception {

        Map<String, Object> passwordMap = new HashMap();

        int id = 1;
        String oldPassword = "25d55ad283aa400af464c76d713c07ad";
        String password = "123";

        int result = userMapper.updatePassword(id, oldPassword, password);

        User resultUser = userMapper.getUserById(1);

        assertThat(result, is(1));
        assertThat(resultUser.getPassword(), is("202cb962ac59075b964b07152d234b70"));
    }
}
