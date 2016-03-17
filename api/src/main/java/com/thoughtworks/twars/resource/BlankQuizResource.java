package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.BlankQuiz;
import com.thoughtworks.twars.bean.QuizItem;
import com.thoughtworks.twars.mapper.BlankQuizMapper;
import com.thoughtworks.twars.mapper.QuizItemMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Path("/blankQuizzes")
@Api

public class BlankQuizResource {
    @Inject
    private BlankQuizMapper blankQuizMapper;

    @Inject
    private QuizItemMapper quizItemMapper;

    @GET
    @ApiResponses(value = {@ApiResponse(code = 200, message = "get all blankQuizzes successful"),
            @ApiResponse(code = 404, message = "get all blankQuizzes failed")})
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllBlankQuizzes() {

        List<BlankQuiz> blankQuizzes = blankQuizMapper.findAll();

        if (blankQuizzes == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        List<Map> result = blankQuizzes
                .stream()
                .map(item -> {
                    Map map = new HashMap();

                    map.put("uri", "blankQuizzes/" + item.getId());

                    return map;
                })
                .collect(Collectors.toList());

        return Response.status(Response.Status.OK).entity(result).build();
    }


    @POST
    @ApiResponses(value = {@ApiResponse(code = 201, message = "insert blankQuiz successful")})
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertBlankQuiz(
            @ApiParam(name = "blankQuiz", value = "BlankQuiz example",required = true)
            BlankQuiz blankQuiz) {

        blankQuizMapper.insertBlankQuiz(blankQuiz);

        Map map = new HashMap<>();
        map.put("id", blankQuiz.getId());
        map.put("uri", "blankQuizzes/" + blankQuiz.getId());

        return Response.status(Response.Status.CREATED).entity(map).build();
    }


    @GET
    @ApiResponses(value = {@ApiResponse(code = 200, message = "successful"),
            @ApiResponse(code = 404, message = "blankQuiz not found")})
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{param}")
    public Response getBlankQuizzesBySectionId(
            @ApiParam(value = "sectionId",allowableValues = "int",required = true)
            @PathParam("param") int sectionId
    ) {

        List<BlankQuiz> blankQuizzes = blankQuizMapper
                .findBySectionId(sectionId);

        if (blankQuizzes == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        List<Map> result = blankQuizzes.stream()
                .map(item -> {
                    Map map = new HashMap();

                    map.put("id", item.getId());
                    map.put("hardCount", item.getHardCount());
                    map.put("normalCount", item.getNormalCount());
                    map.put("easyCount", item.getEasyCount());
                    map.put("exampleCount", item.getExampleCount());

                    return map;
                })
                .collect(Collectors.toList());

        return Response.status(Response.Status.OK).entity(result).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "successful"),
            @ApiResponse(code = 404, message = "blankQuizItems not found")})
    @Path("/{param}/items")
    public Response getItems(
            @ApiParam(value = "blankQuizId",allowableValues = "int",required = true)
            @PathParam("param") int blankQuizId) {

        BlankQuiz blankQuiz = blankQuizMapper.findOne(blankQuizId);

        if (blankQuiz == null) {
            Map errorInfo = new HashMap<>();
            errorInfo.put("errorInfo", "findBlankQuizError");

            return Response.status(Response.Status.NOT_FOUND)
                    .entity(errorInfo).build();
        }

        List<QuizItem> easyItems = quizItemMapper
                .getEasyItems(blankQuiz.getEasyCount());

        if (easyItems == null) {
            Map errorInfo = new HashMap<>();
            errorInfo.put("errorInfo", "getEasyItems");

            return Response.status(Response.Status.NOT_FOUND)
                    .entity(errorInfo).build();
        }

        List<QuizItem> normalItems = quizItemMapper.getNormalItems(blankQuiz
                .getNormalCount());

        if (normalItems == null) {
            Map errorInfo = new HashMap<>();
            errorInfo.put("errorInfo", "getNormalItems");

            return Response.status(Response.Status.NOT_FOUND)
                    .entity(errorInfo).build();
        }

        List<QuizItem> hardItems = quizItemMapper.getHardItems(blankQuiz
                .getHardCount());

        if (hardItems == null) {
            Map errorInfo = new HashMap<>();
            errorInfo.put("errorInfo", "getHardItems");

            return Response.status(Response.Status.NOT_FOUND)
                    .entity(errorInfo).build();
        }

        List<QuizItem> exampleItems = quizItemMapper
                .getExampleItems(blankQuiz.getExampleCount());

        if (exampleItems == null) {
            Map errorInfo = new HashMap<>();
            errorInfo.put("errorInfo", "getExampleItems");

            return Response.status(Response.Status.NOT_FOUND)
                    .entity(errorInfo).build();
        }

        List<QuizItem> quizItems = new ArrayList<>();

        quizItems.addAll(easyItems);
        quizItems.addAll(normalItems);
        quizItems.addAll(hardItems);

        List quizList = quizItems
                .stream()
                .map(BlankQuizResource::buildItemMap)
                .collect(Collectors.toList());

        List exampleList = exampleItems
                .stream()
                .map(BlankQuizResource::buildExampleMap)
                .collect(Collectors.toList());

        Map<String, List> result = new HashMap<>();
        result.put("quizItems", quizList);
        result.put("exampleItems", exampleList);

        return Response.status(Response.Status.OK).entity(result).build();
    }

    private static Map buildItemMap(QuizItem quizItem) {

        Map<String, Object> result = new HashMap<>();

        result.put("id", quizItem.getId());
        result.put("initializedBox", quizItem.getInitializedBox());
        result.put("question", quizItem.getQuestionZh());
        result.put("chartPath", quizItem.getChartPath());
        result.put("description", quizItem.getDescriptionZh());

        return result;
    }

    private static Map buildExampleMap(QuizItem quizItem) {

        Map<String, Object> result = new HashMap<>();

        result.put("id", quizItem.getId());
        result.put("initializedBox", quizItem.getInitializedBox());
        result.put("question", quizItem.getQuestionZh());
        result.put("chartPath", quizItem.getChartPath());
        result.put("description", quizItem.getDescriptionZh());
        result.put("answer", quizItem.getAnswer());

        return result;
    }

}
