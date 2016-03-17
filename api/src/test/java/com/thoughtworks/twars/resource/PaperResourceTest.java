package com.thoughtworks.twars.resource;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.thoughtworks.twars.bean.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.lang.reflect.Array;
import java.util.*;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PaperResourceTest extends TestBase {

    String basePath = "/papers";

    @Mock
    Section firstSection;

    @Mock
    Section secondSection;

    @Mock
    Paper firstPaper;

    @Mock
    Paper secondPaper;

    @Mock
    BlankQuiz firstBlankQuiz;

    @Mock
    HomeworkQuiz firstHomeworkQuiz;

    @Test
    public void should_list_all_papers() throws Exception {

        when(paperMapper.findAll()).thenReturn(Arrays.asList(firstPaper, secondPaper));
        when(firstPaper.getId()).thenReturn(1);
        when(secondPaper.getId()).thenReturn(5);


        Response response = target(basePath).request().get();
        assertThat(response.getStatus(), is(200));

        List<Map> result = response.readEntity(List.class);
        assertThat((String) result.get(0).get("uri"), is("papers/1"));
        assertThat((String) result.get(1).get("uri"), is("papers/5"));
    }

    @Test
    public void should_return_404_when_response_all_papers() throws Exception {

        when(paperMapper.findAll()).thenReturn(null);

        Response response = target(basePath).request().get();
        assertThat(response.getStatus(), is(404));
    }

    @Test
    public void should_return_404_when_request_one_paper() throws Exception {

        when(paperMapper.getOnePaper(3)).thenReturn(null);

        Response response = target(basePath + "/3").request().get();
        assertThat(response.getStatus(), is(404));
    }


    @Test
    public void should_return_uri_when_request_enrollment() throws Exception {

        Gson gson = new GsonBuilder().create();
        Paper paper = new Paper();
        when(paperMapper.getOnePaper(1)).thenReturn(paper);

        List<Integer> quizzes = new ArrayList<>();
        quizzes.add(1);
        quizzes.add(2);
        Section section = new Section();
        section.setId(3);
        section.setDescription("it is a description!");
        section.setPaperId(1);
        section.setQuizzes(quizzes);
        section.setType("blankQuizzes");

        List<Section> sections = new ArrayList<>();
        sections.add(section);
        paper.setId(1);
        paper.setMakerId(2);
        paper.setSections(sections);
        Map responseInfoSections = new HashMap<>();
        responseInfoSections.put("sections", sections);

        Response response = target(basePath + "/enrollment").request().get();

        assertThat(response.getStatus(), is(200));
        Map result = response.readEntity(Map.class);
        String jsonStr = gson.toJson(result);

        assertThat(jsonStr, is("{\"id\":1,\"sections\":[{\"description\":\"it is a description!\",\"id\":3,\"quizzes\":[{\"definition_uri\":\"blankQuizzes/1\",\"id\":1,\"items_uri\":\"blankQuizzes/1/items\"},{\"definition_uri\":\"blankQuizzes/2\",\"id\":2,\"items_uri\":\"blankQuizzes/2/items\"}],\"type\":\"blankQuizzes\"}]}"));

    }


    @Test
    public void should_return_uri_when_insert_paper_definition() {
        Map map1 = new HashMap<>();
        map1.put("quizId", 1);
        map1.put("quizType", "blankQuizzes");
        Map map2 = new HashMap<>();
        map2.put("quizId", 2);
        map2.put("quizType", "homeworkQuizzes");

        List quizzes = new ArrayList<>();
        quizzes.add(map1);
        quizzes.add(map2);

        Map section = new HashMap<>();
        section.put("description", "这是一个描述");
        section.put("quizzes", quizzes);

        List sections = new ArrayList<>();
        sections.add(section);

        Map map = new HashMap<>();
        map.put("makerId", 1);
        map.put("sections", sections);

        Entity entity = Entity.entity(map, MediaType.APPLICATION_JSON_TYPE);

        Response response = target(basePath).request().post(entity);
        assertThat(response.getStatus(), is(200));
    }

    @Test
    public void should_return_logic_puzzle_info_by_paper_id() {
        ScoreSheet scoreSheet = new ScoreSheet();
        scoreSheet.setExamerId(1);
        scoreSheet.setId(2);
        when(scoreSheetMapper.findByPaperId(1)).thenReturn(Arrays.asList(scoreSheet));

        BlankQuizSubmit blankQuizSubmit = new BlankQuizSubmit();
        blankQuizSubmit.setId(4);
        blankQuizSubmit.setBlankQuizId(5);
        blankQuizSubmit.setEndTime(123456);
        blankQuizSubmit.setStartTime(123456);
        blankQuizSubmit.setScoreSheetId(2);
        when(blankQuizSubmitMapper.findByScoreSheetId(2)).thenReturn(Arrays.asList(blankQuizSubmit));

        ItemPost itemPost = new ItemPost();
        itemPost.setId(6);
        itemPost.setBlankQuizSubmitsId(4);
        itemPost.setAnswer("111");
        itemPost.setQuizItemId(7);
        when(itemPostMapper.findByBlankQuizSubmit(4)).thenReturn(Arrays.asList(itemPost));

        QuizItem quizItem = new QuizItem();
        quizItem.setId(7);
        quizItem.setAnswer("111");
        when(quizItemMapper.getQuizItemById(7)).thenReturn(quizItem);

        Response response = target(basePath + "/1/logicPuzzle").request().get();
        assertThat(response.getStatus(), is(200));
    }
    @Test
    public void should_return_user_detail_list() {
        int examerId = 1;
        when(scoreSheetMapper.findUserIdsByPaperId(1)).thenReturn(Arrays.asList(examerId));
        UserDetail userDetail = new UserDetail();
        userDetail.setMajor("computer");
        userDetail.setBirthday(1);
        userDetail.setDegree("benke");
        userDetail.setGender("F");
        userDetail.setUserId(1);
        userDetail.setName("purple");
        userDetail.setSchool("siwo");
        User user = new User();
        user.setEmail("test@qq.com");
        user.setMobilePhone("13804030030");
        when(userMapper.findUserDetailsByUserIds(Arrays.asList(examerId))).thenReturn(Arrays.asList(userDetail));
        when(userMapper.findUsersByUserIds(Arrays.asList(examerId))).thenReturn(Arrays.asList(user));

        Response response = target(basePath + "/1/usersDetail").request().get();
        List<Map> result = response.readEntity(List.class);
        assertThat(response.getStatus(), is(200));
        assertThat(result.size(), is(1));
    }

}



