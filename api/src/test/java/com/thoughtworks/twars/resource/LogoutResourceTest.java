package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.LoginDetail;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.core.Response;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class LogoutResourceTest extends TestBase {
    String basePath = "/logout";

    @Test
    public void should_update_user_detail_when_logout() throws Exception {

        LoginDetail loginDetail = new LoginDetail();

        when(loginDetailMapper.getLoginDetailByToken("123456")).thenReturn(loginDetail);

        Response response = target(basePath).request().header("token","123456").post(null);
        assertThat(response.getStatus(), is(201));
    }

    @Test
    public void should_return_401_when_not_found_token(){

        Response response = target(basePath).request().header("token", null).post(null);
        assertThat(response.getStatus(), is(401));
    }
}