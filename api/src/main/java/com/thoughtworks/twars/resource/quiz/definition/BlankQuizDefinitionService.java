package com.thoughtworks.twars.resource.quiz.definition;

import com.thoughtworks.twars.bean.BlankQuiz;
import com.thoughtworks.twars.bean.Section;
import com.thoughtworks.twars.bean.SectionQuiz;
import com.thoughtworks.twars.mapper.BlankQuizMapper;
import com.thoughtworks.twars.mapper.SectionMapper;
import com.thoughtworks.twars.mapper.SectionQuizMapper;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class BlankQuizDefinitionService implements IDefinitionService {

    @Inject
    BlankQuizMapper blankQuizMapper;

    @Inject
    SectionMapper sectionMapper;

    @Inject
    SectionQuizMapper sectionQuizMapper;

    public void setBlankQuizMapper(BlankQuizMapper blankQuizMapper) {
        this.blankQuizMapper = blankQuizMapper;
    }

    public void setSectionMapper(SectionMapper sectionMapper) {
        this.sectionMapper = sectionMapper;
    }

    public void setSectionQuizMapper(SectionQuizMapper sectionQuizMapper) {
        this.sectionQuizMapper = sectionQuizMapper;
    }

    @Override
    public int insertQuizDefinition(Map quiz, String decription, int paperId) {
        Section section = new Section();
        section.setPaperId(paperId);
        section.setDescription(decription);
        section.setType((String) quiz.get("quizType"));

        sectionMapper.insertSection(section);

        SectionQuiz sectionQuiz = new SectionQuiz();
        sectionQuiz.setQuizId((Integer) quiz.get("quizId"));
        sectionQuiz.setSectionId(section.getId());

        sectionQuizMapper.insertSectionQuiz(sectionQuiz);

        return paperId;
    }

    @Override
    public List<Map> getQuizDefinition(int sectionId) {

        List<BlankQuiz> list = blankQuizMapper.findBySectionId(sectionId);

        return list.stream()
                .map(b -> {
                    HashMap<String, Object> item = new HashMap<>();
                    item.put("id", b.getId());
                    item.put("definition_uri", "blankQuizzes/" + b.getId());
                    item.put("items_uri", "blankQuizzes/" + b.getId() + "/items");
                    return item;
                })
                .collect(Collectors.toList());
    }
}
