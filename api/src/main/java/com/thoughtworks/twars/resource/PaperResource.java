package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.*;
import com.thoughtworks.twars.mapper.*;
import com.thoughtworks.twars.resource.quiz.definition.BlankQuizDefinitionService;
import com.thoughtworks.twars.resource.quiz.definition.HomeworkQuizDefinitionService;
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


@Path("/papers")
@Api
public class PaperResource extends Resource {

    @Inject
    private PaperMapper paperMapper;
    @Inject
    private UserMapper userMapper;
    @Inject
    private HomeworkQuizDefinitionService homeworkQuizDefinition;
    @Inject
    private BlankQuizDefinitionService blankQuizDefinition;
    @Inject
    private ScoreSheetMapper scoreSheetMapper;
    @Inject
    private BlankQuizSubmitMapper blankQuizSubmitMapper;
    @Inject
    private ItemPostMapper itemPostMapper;
    @Inject
    private QuizItemMapper quizItemMapper;


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "successful"),
            @ApiResponse(code = 404, message = "get all papers failed")})
    public Response getAllPapers() {

        List<Paper> papers = paperMapper.findAll();
        List<Map> result = new ArrayList<>();

        if (papers == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        for (int i = 0; i < papers.size(); i++) {
            Paper item = papers.get(i);
            Map<String, String> map = new HashMap<>();
            map.put("uri", "papers/" + item.getId());
            result.add(map);
        }

        return Response.status(Response.Status.OK).entity(result).build();
    }


    @POST
    @ApiResponses(value = {@ApiResponse(code = 200, message = "insert paper successfully"),
            @ApiResponse(code = 415, message = "insert paper failed")})
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertPaper(
            @ApiParam(name = "data", value = "include all info when insert paper", required = true)
            Map data) {
        int makerId = (int) data.get("makerId");
        List<Map> sections = (List<Map>) data.get("sections");

        try {
            Paper paper = new Paper();
            paper.setMakerId(makerId);

            paperMapper.insertPaper(paper);
            int paperId = paper.getId();

            List<Map> result = sections.stream()
                    .map(item -> {
                        Map map = new HashMap();
                        map.put("uri", insertDefinitionByQuizType(item, paperId));
                        return map;
                    })
                    .collect(Collectors.toList());
            session.commit();

            return Response.status(Response.Status.OK).entity(result.get(0)).build();
        } catch (Exception e) {
            session.rollback();
        }
        return Response.status(Response.Status.UNSUPPORTED_MEDIA_TYPE).build();
    }


    public String insertDefinitionByQuizType(Map item, int paperId) {
        List<Map> quizzes = (List<Map>) item.get("quizzes");
        String description = (String) item.get("description");

        quizzes.forEach(h -> {
            if ("blankQuizzes".equals(h.get("quizType"))) {
                blankQuizDefinition.insertQuizDefinition(h, description, paperId);
            } else if ("homeworkQuizzes".equals(h.get("quizType"))) {
                homeworkQuizDefinition.insertQuizDefinition(h, description, paperId);
            }
        });

        return "papers/" + paperId;
    }


    @GET
    @ApiResponses(value = {@ApiResponse(code = 200, message = "get one paper successfully"),
            @ApiResponse(code = 404, message = "get one paper failed")})
    @Path("/{param}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOnePaper(
            @ApiParam(name = "id", value = "paperId", required = true)
            @PathParam("param") int id) {
        Paper paper = paperMapper.getOnePaper(id);
        if (paper == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.status(Response.Status.OK)
                .entity(paper.getResponseInfo()).build();
    }

    @GET
    @Path("/{param}/usersDetail")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserDetailByPaperId(
            @PathParam("param") int id) {
        List<Integer> examerIds = scoreSheetMapper.findUserIdsByPaperId(id);
        List<UserDetail> userDetails = userMapper.findUserDetailsByUserIds(examerIds);
        List<User> users = userMapper.findUsersByUserIds(examerIds);
        List<Map> result = new ArrayList<>();
        for (int i = 0; i < userDetails.size(); i++) {
            Map userMap = new HashMap<>();
            userMap.put("userId", users.get(i).getId());
            userMap.put("mobilePhone", users.get(i).getMobilePhone());
            userMap.put("email", users.get(i).getEmail());
            userMap.put("birthday", userDetails.get(i).getBirthday());
            userMap.put("major", userDetails.get(i).getMajor());
            userMap.put("degree", userDetails.get(i).getDegree());
            userMap.put("gender", userDetails.get(i).getGender());
            userMap.put("name", userDetails.get(i).getName());
            result.add(userMap);
        }
        return Response.status(Response.Status.OK).entity(result).build();
    }

    @GET
    @ApiResponses(value = {@ApiResponse(code = 200, message = "get enrollment paper successfully"),
            @ApiResponse(code = 404, message = "get enrollment paper failed")})
    @Path("/enrollment")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEnrollmentPaper() {
        return getOnePaper(1);
    }


    @GET
    @ApiResponses(value = {@ApiResponse(code = 200, message = "get logicPuzzle successfully"),
            @ApiResponse(code = 404, message = "get logicPuzzle failed")})
    @Path("/{param}/logicPuzzle")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLogicPuzzleByPaperId(
            @ApiParam(name = "id", value = "paperId", required = true)
            @PathParam("param") int id
    ) {

        List<ScoreSheet> scoreSheets = scoreSheetMapper.findByPaperId(id);

        if (scoreSheets.size() == 0) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        List<Map> result = new ArrayList<>();

        scoreSheets.forEach(item -> {
            BlankQuizSubmit blankQuizSubmit = blankQuizSubmitMapper
                    .findByScoreSheetId(item.getId()).get(0);

            List<ItemPost> itemPostList = itemPostMapper
                    .findByBlankQuizSubmit(blankQuizSubmit.getId());

            List<String> correctList = new ArrayList<>();
            itemPostList.forEach(val -> {
                String answer = quizItemMapper.getQuizItemById(val.getQuizItemId()).getAnswer();
                if (val.getAnswer() != null && val.getAnswer().equals(answer)) {
                    correctList.add("true");
                }
            });

            Map map = new HashMap();
            map.put("userId", item.getExamerId());
            map.put("correctNumber", correctList.size());
            map.put("itemNumber", itemPostList.size());
            map.put("startTime", blankQuizSubmit.getStartTime());
            map.put("endTime", blankQuizSubmit.getEndTime());

            result.add(map);
        });
        return Response.status(Response.Status.OK).entity(result).build();
    }
}



