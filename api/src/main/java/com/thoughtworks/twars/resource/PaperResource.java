package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.Paper;
import com.thoughtworks.twars.mapper.PaperMapper;
import com.thoughtworks.twars.mapper.SectionMapper;
import com.thoughtworks.twars.resource.quiz.definition.BlankQuizDefinitionService;
import com.thoughtworks.twars.resource.quiz.definition.HomeworkQuizDefinitionService;

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
public class PaperResource extends Resource {

    @Inject
    private PaperMapper paperMapper;
    @Inject
    private SectionMapper sectionMapper;
    @Inject
    private HomeworkQuizDefinitionService homeworkQuizDefinition;
    @Inject
    private BlankQuizDefinitionService blankQuizDefinition;


    @GET
    @Produces(MediaType.APPLICATION_JSON)
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
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertPaper(Map data) {
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
    @Path("/{param}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOnePaper(@PathParam("param") int id) {
        Paper paper = paperMapper.getOnePaper(id);
        if (paper == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.status(Response.Status.OK)
                .entity(paper.getResponseInfo()).build();
    }


    @GET
    @Path("/enrollment")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEnrollmentPaper() {
        return getOnePaper(1);
    }
}


