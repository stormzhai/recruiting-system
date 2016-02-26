package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.User;
import com.thoughtworks.twars.mapper.UserMapper;

import java.util.HashMap;
import java.util.Map;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/register")
public class RegisterResource extends Resource {

    @Inject
    private UserMapper userMapper;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(User user) {
        userMapper.insertUser(user);
        session.commit();

        Map<String, Object> map = new HashMap<>();
        Map<String, String> userInfo = new HashMap<>();
        Map<String, String> theUser = new HashMap<>();

        map.put("id", user.getId());
        userInfo.put("uri", "userInfo/" + user.getId());
        theUser.put("uri", "user/" + user.getId());

        map.put("userInfo", userInfo);
        map.put("user", theUser);

        return Response.status(Response.Status.OK).entity(map).build();
    }
}
