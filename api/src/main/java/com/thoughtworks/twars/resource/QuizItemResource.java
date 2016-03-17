package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.QuizItem;
import com.thoughtworks.twars.mapper.QuizItemMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Path("/quizItems")
@Api
public class QuizItemResource extends Resource {

    @Inject
    private QuizItemMapper quizItemMapper;

    @GET
    @ApiResponses(value = {@ApiResponse(code = 200, message = "get all quizItems successful"),
            @ApiResponse(code = 404, message = "all quizItems not found")})
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllQuizItems() {
        List<QuizItem> quizItems = quizItemMapper.getAllQuizItems();

        if (quizItems == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        List<Map> result = quizItems
                .stream()
                .map(item -> {
                    Map map = new HashMap();
                    map.put("uri", "quizItems/" + item.getId());

                    return map;
                })
                .collect(Collectors.toList());

        return Response.status(Response.Status.OK).entity(result).build();
    }


    @POST
    @ApiResponses(value = {@ApiResponse(code = 201, message = "insert quizItems successful")})
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertQuizItem(
            @ApiParam(name = "quizItem", value = "QuizItem example",required = true)
            QuizItem quizItem) {

        quizItemMapper.insertQuizItem(quizItem);

        Map map = new HashMap();
        map.put("uri", "quizItems/" + quizItem.getId());

        return Response.status(Response.Status.CREATED).entity(map).build();
    }


    @GET
    @Path("/{param}")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "successful"),
            @ApiResponse(code = 404, message = "all blankQuizzes not found")})
    @Produces(MediaType.APPLICATION_JSON)
    public Response getQuizItem(
            @ApiParam(name = "quizItemId", value = "int",required = true)
            @PathParam("param") int id) {

        QuizItem quizItem = quizItemMapper.getQuizItemById(id);

        if (quizItem == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Map map = new HashMap();
        map.put("id", quizItem.getId());
        map.put("description", quizItem.getDescriptionZh());
        map.put("chartPath", quizItem.getChartPath());
        map.put("question", quizItem.getQuestionZh());
        map.put("initializedBox", quizItem.getInitializedBox());


        return Response.status(Response.Status.OK).entity(map).build();
    }

}
