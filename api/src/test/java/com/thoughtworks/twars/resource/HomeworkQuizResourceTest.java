package com.thoughtworks.twars.resource;

import com.thoughtworks.twars.bean.HomeworkQuiz;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.core.Response;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class HomeworkQuizResourceTest extends TestBase {
    @Mock
    HomeworkQuiz homeworkQuiz;

    String basePath = "/homeworkQuizzes";

    @Test
    public void should_return_one_homework_quiz() {
        when(homeworkQuizMapper.findById(1)).thenReturn(homeworkQuiz);
        when(homeworkQuiz.getDescription()).thenReturn("这是一道比较简单的题目");
        when(homeworkQuiz.getEvaluateScript()).thenReturn("www.baidu.com");
        when(homeworkQuiz.getTemplateRepository()).thenReturn("templateRepository");

        Response response = target(basePath + "/1").request().get();
        assertThat(response.getStatus(), is(200));
    }
}