'use strict';

var express = require('express');
var session = require('supertest-session');
var app = require('../../app');
var request = require('../../services/api-request');
var httpStatusCode = require('../../mixin/constant').httpCode;

var testSession = null;

describe('GET /quiz', function () {

  it('can sign in', function (done) {

    testSession = session(app);

    spyOn(request, 'post').and.callFake(function (url, body, callback) {
      callback(null, {
        body: {userInfo: {uri: 'user/1'}, id: 1},
        status: httpStatusCode.OK,
        headers: 'yes'
      });
    });

    testSession.post('/login')
        .set('Content-Type', 'application/json')
        .send({
          account: 'test@it.com',
          password: 'evanleesucks'
        })
        .expect(httpStatusCode.OK)
        .end(function (err, res) {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });
  });

  it('can get quiz when this quiz is not in mongoDB', function (done) {

    testSession
        .get('/homework/quiz')
        .set('Content-Type', 'application/json')
        .query({
          orderId: 1
        })
        .expect(httpStatusCode.OK)
        .expect({
          status: httpStatusCode.OK,
          quiz: {
            quizStatus: 2,
            desc: '## 编程题答题说明\n点击编程题进入答题页面后，您可以看到导航栏处三个标签，分别为：**题目说明**，**提交作业**，**运行结果**\n### 题目说明\n题目说明标签内包含：\n![All text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/desc1.jpg)\n![Alt text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/desc2.jpg)\n![Alt text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/desc3.jpg)\nNOTE：编程题模板库是便于用户的答题操作，根据题目的难易程度可能提供或者不提供\n### 提交作业\n提交作业标签内包含：\n**编程题模板库地址**，**github仓库地址**，**github仓库分支**\n![Alt text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/commit.jpg)\n\n用户在本地做完每道编程题后在此标签内提交编程题的github地址\n### 运行结果\n- 用户在提交题目后，系统会自行进行处理\n![Alt text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/light.jpg)\n- 若结果正确，则下一题解锁，用户继续完成下一题目\n![Alt text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/success.jpg)\n- 若错误，请继续完成本题目，直至正确或答题超时\n![Alt text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/fail.jpg)\n  \n## 编程题答题注意事项\n- 每道题设有答题时间期限，超时后用户将失去答题资格\n- 因题目难度不同，**答题流程也不太相同**\n- 因题目难度不同，**题目运行结果时间不定**，请耐心等待\n- 因题目难度不同，**编程题模板库可能不提供**\n\n---------------------------------------------------\n以下为本题内容\n\n## 题目要求\n- 请在开始答题后 `7` 天内完成\n\n#### 题目描述\n根据如下顺序完成题目：\n- 请新建一个github账户\n- 请初始化一个github仓库\n- 请在该库内新建一个名为`readme.md`的文件(注意全部小写)\n\n## 答题流程\n1. 请用户仔细阅读题目要求和题目描述\n2. 使用以下命令初始化git（如果不会使用git和github，请先学习参考资料的内容）\n\t```\n\tgit init\n\t```\n3. 使用以下命令设置github远程仓库地址 (url代表你自己的新的github地址)\n\t```\n\t git remote add origin url\n\t```\n4. 请使用**git提交(commit)**并**上传(push)**，之后将此github仓库地址(用户自建的) eg:（https://github.com/username/repo） 填入到提交地址一栏 \n\n5. 获取分支\n\n6. 提交\n\n7. 等待结果\n\n## 考察要点\n- github仓库的使用\n- git基础\n\n## 编程题模板库地址\n本题不存在编程题模板库地址\n\n## 参考资料\n1. [Git for Windows](https://github.com/doggy8088/Learn-Git-in-30-days/blob/master/docs/02%20%E5%9C%A8%20Windows%20%E5%B9%B3%E5%8F%B0%E5%BF%85%E8%A3%9D%E7%9A%84%E4%B8%89%E5%A5%97%20Git%20%E5%B7%A5%E5%85%B7.markdown)\n2. [try git](https://try.github.io/levels/1/challenges/1)\n3. [Git 参考手册](http://gitref.org/zh/index.html)\n4. [github用法](https://guides.github.com/activities/hello-world/)\n',
            templateRepo: ''
          }
        })
        .end(function (err, res) {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });

  });

  it('can get quiz when this quiz is already in mongoDB', function (done) {

    testSession
        .get('/homework/quiz')
        .set('Content-Type', 'application/json')
        .query({
          orderId: 1
        })
        .expect(httpStatusCode.OK)
        .expect({
          status: httpStatusCode.OK,
          quiz: {
            quizStatus: 2,
            desc: '## 编程题答题说明\n点击编程题进入答题页面后，您可以看到导航栏处三个标签，分别为：**题目说明**，**提交作业**，**运行结果**\n### 题目说明\n题目说明标签内包含：\n![All text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/desc1.jpg)\n![Alt text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/desc2.jpg)\n![Alt text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/desc3.jpg)\nNOTE：编程题模板库是便于用户的答题操作，根据题目的难易程度可能提供或者不提供\n### 提交作业\n提交作业标签内包含：\n**编程题模板库地址**，**github仓库地址**，**github仓库分支**\n![Alt text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/commit.jpg)\n\n用户在本地做完每道编程题后在此标签内提交编程题的github地址\n### 运行结果\n- 用户在提交题目后，系统会自行进行处理\n![Alt text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/light.jpg)\n- 若结果正确，则下一题解锁，用户继续完成下一题目\n![Alt text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/success.jpg)\n- 若错误，请继续完成本题目，直至正确或答题超时\n![Alt text](https://raw.githubusercontent.com/sialvsic/TwicePic/master/fail.jpg)\n  \n## 编程题答题注意事项\n- 每道题设有答题时间期限，超时后用户将失去答题资格\n- 因题目难度不同，**答题流程也不太相同**\n- 因题目难度不同，**题目运行结果时间不定**，请耐心等待\n- 因题目难度不同，**编程题模板库可能不提供**\n\n---------------------------------------------------\n以下为本题内容\n\n## 题目要求\n- 请在开始答题后 `7` 天内完成\n\n#### 题目描述\n根据如下顺序完成题目：\n- 请新建一个github账户\n- 请初始化一个github仓库\n- 请在该库内新建一个名为`readme.md`的文件(注意全部小写)\n\n## 答题流程\n1. 请用户仔细阅读题目要求和题目描述\n2. 使用以下命令初始化git（如果不会使用git和github，请先学习参考资料的内容）\n\t```\n\tgit init\n\t```\n3. 使用以下命令设置github远程仓库地址 (url代表你自己的新的github地址)\n\t```\n\t git remote add origin url\n\t```\n4. 请使用**git提交(commit)**并**上传(push)**，之后将此github仓库地址(用户自建的) eg:（https://github.com/username/repo） 填入到提交地址一栏 \n\n5. 获取分支\n\n6. 提交\n\n7. 等待结果\n\n## 考察要点\n- github仓库的使用\n- git基础\n\n## 编程题模板库地址\n本题不存在编程题模板库地址\n\n## 参考资料\n1. [Git for Windows](https://github.com/doggy8088/Learn-Git-in-30-days/blob/master/docs/02%20%E5%9C%A8%20Windows%20%E5%B9%B3%E5%8F%B0%E5%BF%85%E8%A3%9D%E7%9A%84%E4%B8%89%E5%A5%97%20Git%20%E5%B7%A5%E5%85%B7.markdown)\n2. [try git](https://try.github.io/levels/1/challenges/1)\n3. [Git 参考手册](http://gitref.org/zh/index.html)\n4. [github用法](https://guides.github.com/activities/hello-world/)\n',
            templateRepo: ''
          }
        })
        .end(function (err, res) {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });

  });

});


