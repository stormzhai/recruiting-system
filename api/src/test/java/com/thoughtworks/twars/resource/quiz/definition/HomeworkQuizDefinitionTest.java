package com.thoughtworks.twars.resource.quiz.definition;

import com.thoughtworks.twars.bean.HomeworkQuiz;
import com.thoughtworks.twars.mapper.HomeworkQuizMapper;
import com.thoughtworks.twars.mapper.SectionMapper;
import com.thoughtworks.twars.mapper.SectionQuizMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class HomeworkQuizDefinitionTest {

    @Mock
    HomeworkQuizMapper mapper;

    @Mock
    HomeworkQuiz firstQuiz;

    @Mock
    HomeworkQuiz secondQuiz;

    @Mock
    SectionMapper sectionMapper;

    @Mock
    SectionQuizMapper sectionQuizMapper;

    @InjectMocks
    HomeworkQuizDefinitionService definition;

    @Test
    public void should_return_correct_uri_list() throws Exception {
        when(mapper.findBySectionId(1)).thenReturn(Arrays.asList(firstQuiz, secondQuiz));

        when(firstQuiz.getId()).thenReturn(1);
        when(secondQuiz.getId()).thenReturn(2);

        List<Map> result = definition.getQuizDefinition(1);

        assertThat(result.get(0).get("id"), is(1));
        assertThat(result.get(0).get("definition_uri"), is("homeworkQuizzes/1"));

        assertThat(result.get(1).get("id"), is(2));
        assertThat(result.get(1).get("definition_uri"), is("homeworkQuizzes/2"));
    }

    @Test
    public void should_return_uri_when_insert_paper_definition(){
        Map quiz = new HashMap<>();
        quiz.put("quizId", 1);
        quiz.put("quizType", "blankQuizzes");
        String description = "这是描述";

        int paperId = 2;

        int returnId = definition.insertQuizDefinition(quiz, description, paperId);
        assertThat(returnId, is(2));
    }
}