package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.LoginDetail;
import com.thoughtworks.twars.mapper.LoginDetailMapper;

import javax.inject.Inject;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

@Path("/logout")
public class LogoutResource extends Resource {

    @Inject
    private LoginDetailMapper loginDetailMapper;

    @POST
    public Response logoutUser(@Context HttpHeaders headers) {

        String token = headers.getRequestHeaders().getFirst("token");
        LoginDetail loginDetail = loginDetailMapper.getLoginDetailByToken(token);

        if (token == null || loginDetail == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        loginDetailMapper.updateLoginDetail(token);

        return Response.status(Response.Status.CREATED).build();
    }
}
