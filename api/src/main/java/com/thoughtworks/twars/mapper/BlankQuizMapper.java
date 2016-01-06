package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.BlankQuiz;

import java.util.List;

public interface BlankQuizMapper {
  List<BlankQuiz> findAll();
  List<BlankQuiz> findBySectionId(int sectionId);
  BlankQuiz findById(int id);
}
