package com.thoughtworks.twars.resource.quiz.scoresheet;

import com.thoughtworks.twars.bean.HomeworkPostHistory;
import com.thoughtworks.twars.bean.HomeworkSubmit;
import com.thoughtworks.twars.mapper.HomeworkPostHistoryMapper;
import com.thoughtworks.twars.mapper.HomeworkSubmitMapper;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class HomeworkQuizScoreSheetService implements IScoreSheetService {
    @Inject
    private HomeworkSubmitMapper homeworkSubmitMapper;

    @Inject
    private HomeworkPostHistoryMapper homeworkPostHistoryMapper;

    public void setHomeworkSubmitMapper(HomeworkSubmitMapper homeworkSubmitMapper) {
        this.homeworkSubmitMapper = homeworkSubmitMapper;
    }

    public void setHomeworkPostHistoryMapper(HomeworkPostHistoryMapper homeworkPostHistoryMapper) {
        this.homeworkPostHistoryMapper = homeworkPostHistoryMapper;
    }

    @Override
    public List<Map> getQuizScoreSheet(int scoreSheetId) {
        return homeworkSubmitMapper.findByScoreSheetId(scoreSheetId)
                .stream()
                .map(homeworkQuizSubmit -> {
                    Map<String, Object> homeworkQuizUri = new HashMap<>();
                    homeworkQuizUri.put("uri", "homeworkQuiz/"
                            + homeworkQuizSubmit.getHomeworkQuizId());
                    Map<String, Object> homeworkQuizSubmitUri = new HashMap<>();
                    homeworkQuizSubmitUri.put("homeworkQuiz", homeworkQuizUri);
                    homeworkQuizSubmitUri.put("homeworkSubmitPostHistory",
                            findByHomeworkSubmitId(homeworkQuizSubmit.getId()));
                    return homeworkQuizSubmitUri;
                })
                .collect(Collectors.toList());
    }

    public List<Map> findByHomeworkSubmitId(int homeworkSubmitId) {
        return homeworkPostHistoryMapper.findByHomeworkSubmitId(homeworkSubmitId)
                .stream()
                .map(homeworkPostHistory -> {
                    Map<String, Object> homeworkPostHistoryUri = new HashMap<>();
                    homeworkPostHistoryUri.put("homeworkURL", homeworkPostHistory.getHomeworkURL());
                    homeworkPostHistoryUri.put("branch", homeworkPostHistory.getBranch());
                    homeworkPostHistoryUri.put("version", homeworkPostHistory.getVersion());
                    homeworkPostHistoryUri.put("timeStamp", homeworkPostHistory.getTimestamp());
                    homeworkPostHistoryUri.put("status", homeworkPostHistory.getStatus());
                    return homeworkPostHistoryUri;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void insertQuizScoreSheet(Map data, int scoreSheetId) {

        List<Map> homeworkSubmits = (List<Map>) data.get("homeworkSubmits");

        homeworkSubmits.forEach(item -> {
            int homeworkQuizId = (int) item.get("homeworkQuizId");

            HomeworkSubmit homeworkSubmit = new HomeworkSubmit();
            homeworkSubmit.setScoreSheetId(scoreSheetId);
            homeworkSubmit.setHomeworkQuizId(homeworkQuizId);

            homeworkSubmitMapper.insertHomeworkSubmit(homeworkSubmit);

            Map homeworkSubmitPostHistory = (Map) item
                    .get("homeworkSubmitPostHistory");

            HomeworkPostHistory homeworkPostHistory = new HomeworkPostHistory();
            homeworkPostHistory.setBranch((String) homeworkSubmitPostHistory.get("branch"));
            homeworkPostHistory.setVersion((String) homeworkSubmitPostHistory.get("version"));
            homeworkPostHistory.setHomeworkURL((String) homeworkSubmitPostHistory
                    .get("homeworkURL"));
            homeworkPostHistory.setStatus((Integer) homeworkSubmitPostHistory.get("status"));
            homeworkPostHistory.setHomeworkSubmitId(homeworkSubmit.getId());

            homeworkPostHistoryMapper.insertHomeworkPostHistory(homeworkPostHistory);
        });



    }

}
