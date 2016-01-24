package com.thoughtworks.twars.service.quiz.definition;

import com.thoughtworks.twars.bean.BlankQuiz;
import com.thoughtworks.twars.mapper.BlankQuizMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class BlankQuizDefinitionTest {

    @Mock
    BlankQuizMapper mapper;

    @Mock
    BlankQuiz firstQuiz;

    @Mock
    BlankQuiz secondQuiz;


    @InjectMocks
    BlankQuizDefinition definition;

    @Test
    public void should_return_correct_uri_list() throws Exception {
        when(mapper.findBySectionId(1)).thenReturn(Arrays.asList(firstQuiz, secondQuiz));

        when(firstQuiz.getId()).thenReturn(1);
        when(secondQuiz.getId()).thenReturn(2);

        List<Map> result = definition.getQuizDefinition(1);

        assertThat(result.get(0).get("id"), is(1));
        assertThat(result.get(0).get("definition-uri"), is("blankQuizzes/1"));
        assertThat(result.get(0).get("items-uri"), is("blankQuizzes/1/items"));


        assertThat(result.get(1).get("id"), is(2));
        assertThat(result.get(1).get("definition-uri"), is("blankQuizzes/2"));
        assertThat(result.get(1).get("items-uri"), is("blankQuizzes/2/items"));
    }
}