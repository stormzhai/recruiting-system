package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.LoginDetail;
import com.thoughtworks.twars.bean.User;
import com.thoughtworks.twars.mapper.LoginDetailMapper;
import com.thoughtworks.twars.mapper.UserMapper;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/login")
public class LoginResource extends Resource {

    @Inject
    private UserMapper userMapper;

    @Inject
    private LoginDetailMapper loginDetailMapper;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(User user) {

        User resultUser = userMapper.getUserByEmailAndPassWord(user);

        if (resultUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        List<LoginDetail> loginDetails = loginDetailMapper
                .getLoginDetailByUserId(resultUser.getId());
        LoginDetail loginDetail = loginDetails.get(loginDetails.size() - 1);

        if (loginDetail.getFlag() == 1) {
            loginDetailMapper.updateLoginDetail(loginDetail.getToken());
        }

        loginDetailMapper.insertLoginDetail(loginDetail);

        Map<String, Object> map = new HashMap<>();
        Map<String, String> userInfo = new HashMap<>();

        map.put("id", resultUser.getId());
        userInfo.put("uri", "users/" + resultUser.getId());
        map.put("userInfo", userInfo);
        map.put("token", loginDetail.getToken());

        return Response.ok(map).header("token", loginDetail.getToken()).build();
    }
}
