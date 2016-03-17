package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.ThirdParty;
import com.thoughtworks.twars.bean.User;
import com.thoughtworks.twars.mapper.GithubUserMapper;
import com.thoughtworks.twars.mapper.UserMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

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
@Api

public class RegisterResource extends Resource {

    @Inject
    private UserMapper userMapper;

    @Inject
    private GithubUserMapper githubUserMapper;

    @POST
    @ApiResponses(value = {@ApiResponse(code = 200, message = "register successfully")})
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(
            @ApiParam(name = "user", value = "User example",required = true)
            User user) {
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

    @POST
    @Path("/third-party")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(ThirdParty thirdParty) {

        githubUserMapper.insertGithubUser(thirdParty);
        Map result = new HashMap<>();
        result.put("thirdPartyId", thirdParty.getId());
        return Response.status(Response.Status.CREATED).entity(result).build();
    }
}
