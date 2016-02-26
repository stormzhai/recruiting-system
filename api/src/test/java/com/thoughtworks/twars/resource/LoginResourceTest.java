package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.LoginDetail;
import com.thoughtworks.twars.bean.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class LoginResourceTest extends TestBase {
    String basePath = "/login";

    @Test
    public void should_create_user_when_login() throws Exception {

        User loginUser = new User();
        LoginDetail loginDetail = new LoginDetail();

        loginDetail.setId(1);
        loginDetail.setUserId(1);
        loginDetail.setToken("123456");

        List<LoginDetail> loginDetails = new ArrayList<>();
        loginDetails.add(loginDetail);

        when(userMapper.getUserByEmailAndPassWord(any(User.class))).thenReturn(loginUser);
        when(loginDetailMapper.getLoginDetailByUserId(1)).thenReturn(loginDetails);

        loginUser.setEmail("test@163.com");
        loginUser.setPassword("25d55ad283aa400af464c76d713c07ad");
        loginUser.setId(1);

        Entity entity = Entity.entity(loginUser, MediaType.APPLICATION_JSON_TYPE);
        Response response = target(basePath).request().post(entity);
        assertThat(response.getStatus(), is(200));

        Map result = response.readEntity(Map.class);

        int userId = (int) result.get("id");
        String userInfoUri = (String) ((Map) result.get("userInfo")).get("uri");
        String token = (String) result.get("token");

        assertThat(userId, is(1));
        assertThat(userInfoUri, is("users/1"));
        assertThat(token, is("123456"));
    }

    @Test
    public void should_return_404_when_not_find_user() throws Exception {
        User loginUser = new User();
        loginUser.setEmail("test7@163.com");
        loginUser.setPassword("25d55ad283aa400af464c76d713c07ad");

        Entity entity = Entity.entity(loginUser, MediaType.APPLICATION_JSON_TYPE);
        Response response = target(basePath).request().post(entity);
        assertThat(response.getStatus(), is(401));
    }

}