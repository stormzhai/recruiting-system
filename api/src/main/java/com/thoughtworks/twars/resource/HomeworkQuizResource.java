package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.HomeworkQuiz;
import com.thoughtworks.twars.mapper.HomeworkQuizMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;

@Path("/homeworkQuizzes")
@Api
public class HomeworkQuizResource {
    @Inject
    private HomeworkQuizMapper homeworkQuizMapper;

    @GET
    @ApiResponses(value = {@ApiResponse(code = 200, message = "successful"),
            @ApiResponse(code = 404, message = "not found")})
    @Path("/{param}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOneHomeworkQuiz(
            @ApiParam(value = "homeworkQuizId", allowableValues = "int", required = true)
            @PathParam("param") int id) {
        HomeworkQuiz homeworkQuiz = homeworkQuizMapper.findById(id);

        if (homeworkQuiz == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Map homeworkItem = new HashMap<>();

        homeworkItem.put("id", id);
        homeworkItem.put("description", homeworkQuiz.getDescription());
        homeworkItem.put("evaluateScript", homeworkQuiz.getEvaluateScript());
        homeworkItem.put("evaluateRepository", homeworkQuiz.getEvaluateRepository());
        homeworkItem.put("templateRepository", homeworkQuiz.getTemplateRepository());

        return Response.status(Response.Status.OK).entity(homeworkItem).build();
    }
}
