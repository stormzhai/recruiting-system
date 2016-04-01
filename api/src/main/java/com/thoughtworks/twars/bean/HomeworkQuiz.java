package com.thoughtworks.twars.bean;

public class HomeworkQuiz {
    private int id;
    private int sectionId;
    private String description;
    private String evaluateScript;
    private String templateRepository;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSectionId() {
        return sectionId;
    }

    public void setSectionId(int sectionId) {
        this.sectionId = sectionId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEvaluateScript() {
        return evaluateScript;
    }

    public void setEvaluateScript(String evaluateScript) {
        this.evaluateScript = evaluateScript;
    }

    public String getTemplateRepository() {
        return templateRepository;
    }

    public void setTemplateRepository(String templateRepository) {
        this.templateRepository = templateRepository;
    }
}
