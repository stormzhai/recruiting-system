package com.thoughtworks.twars.resource.quiz.definition;

import java.util.List;
import java.util.Map;

public interface IDefinitionService {

    public int insertQuizDefinition(Map quiz, String decription, int paperId);

    public List<Map> getQuizDefinition(int sectionId);
}
