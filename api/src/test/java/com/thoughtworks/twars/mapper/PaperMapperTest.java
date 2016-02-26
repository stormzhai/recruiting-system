package com.thoughtworks.twars.mapper;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.thoughtworks.twars.bean.Paper;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;

public class PaperMapperTest extends TestBase {

    private PaperMapper paperMapper;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        paperMapper = session.getMapper(PaperMapper.class);
    }

    @Test
    public void should_return_all_papers() throws Exception {
        List<Paper> papers = paperMapper.findAll();
        assertThat(papers.size(), is(4));
        assertThat(papers.get(0).getMakerId(), is(1));
    }

    @Test
    public void should_return_paper_with_data() throws Exception {
        Paper paper = paperMapper.getOnePaper(1);
        Gson gson = new GsonBuilder().create();
        String responseInfoStr = gson.toJson(paper.getResponseInfo());

        assertThat(paper.getId(), is(1));
        assertThat(paper.getMakerId(), is(1));
        assertThat(paper.getSections().size(), is(2));
        assertThat(responseInfoStr, is("{\"id\":1,\"sections\":[{\"description\":\"这是描述\",\"id\":1,\"quizzes\":[{\"definition_uri\":\"blankQuizzes/1\",\"id\":1,\"items_uri\":\"blankQuizzes/1/items\"},{\"definition_uri\":\"blankQuizzes/2\",\"id\":2,\"items_uri\":\"blankQuizzes/2/items\"}],\"type\":\"blankQuizzes\"},{\"description\":\"这是描述\",\"id\":2,\"quizzes\":[{\"definition_uri\":\"homeworkQuizzes/1\",\"id\":1},{\"definition_uri\":\"homeworkQuizzes/2\",\"id\":2},{\"definition_uri\":\"homeworkQuizzes/3\",\"id\":3},{\"definition_uri\":\"homeworkQuizzes/4\",\"id\":4}],\"type\":\"homeworkQuizzes\"}]}"));

    }

    @Test
    public void should_insert_paper() {
        Paper paper = new Paper();
        paper.setMakerId(3);

        paperMapper.insertPaper(paper);

        assertThat(paper.getId(), is(5));
    }
}