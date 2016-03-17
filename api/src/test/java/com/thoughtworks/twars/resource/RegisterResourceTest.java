package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.ThirdParty;
import com.thoughtworks.twars.bean.User;
import org.junit.Test;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Mockito.when;

public class RegisterResourceTest extends TestBase {
    String basePath = "/register";

    @Test
    public void should_create_user_when_register() throws Exception {
        User newUser = new User();

        when(userMapper.insertUser(newUser)).thenReturn(1);
        newUser.setEmail("a@b.com");
        newUser.setMobilePhone("123");
        newUser.setId(108);
        newUser.setPassword("12345");

        Entity entity = Entity.entity(newUser, MediaType.APPLICATION_JSON);
        Response response = target(basePath).request().post(entity);
        assertThat(response.getStatus(), is(200));

        Map result = response.readEntity(Map.class);

        String userUri = (String) ((Map) result.get("user")).get("uri");
        String userInfoUri = (String) ((Map) result.get("userInfo")).get("uri");

        assertThat(userUri, is("user/108"));
        assertThat(userInfoUri, is("userInfo/108"));
    }

    @Test
    public void should_create_user_when_register_with_third_part_user() throws Exception {
        ThirdParty thirdParty = new ThirdParty();

        when(githubUserMapper.insertGithubUser(thirdParty)).thenReturn(1);
        thirdParty.setThirdPartyId(2);
        thirdParty.setUserId(4);
        thirdParty.setId(3);

        Entity entity = Entity.entity(thirdParty, MediaType.APPLICATION_JSON);
        Response response = target(basePath + "/third-party").request().post(entity);
        Map result = response.readEntity(Map.class);
        assertThat(response.getStatus(), is(201));
        assertThat(result.get("thirdPartyId"), is(3));
    }
}