package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.ScoreSheet;

import java.util.List;

public interface ScoreSheetMapper {

    List<ScoreSheet> findAll();

    ScoreSheet findOne(int id);

    int insertScoreSheet(ScoreSheet scoreSheet);

    ScoreSheet selectScoreSheet(ScoreSheet scoreSheet);

    ScoreSheet findOneByUserId(int userId);

    List<ScoreSheet> findByPaperId(int paperId);

    List<Integer> findUserIdsByPaperId(int paperId);
}
