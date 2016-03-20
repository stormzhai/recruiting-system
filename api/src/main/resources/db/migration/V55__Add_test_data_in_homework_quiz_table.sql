Update  homeworkQuiz set description="##Homework题目说明

点击编程题进入答题页面后，可以看到导航栏处三个标签，分别为**题目说明**，**提交作业**，**运行结果**。

![navigation](https://raw.githubusercontent.com/AnliHuer/Markdown-picture/master/homework-navigation.png)
***

###题目说明：

包含**题目描述**和**编程题目的模板库地址**。请认真阅读题目描述，理解题目要求。将题目模板克隆到本地，完成题目。

![titleDescription](https://raw.githubusercontent.com/AnliHuer/Markdown-picture/master/homework-description.png)
***

###提交作业：

完成编程题目后，请将题目地址填入图中的**github仓库地址**一栏。

![fillUrl](https://raw.githubusercontent.com/AnliHuer/Markdown-picture/master/homework-fill.png)
***

点击**获取分支**按钮，获取所有分支。

![getBranch](https://raw.githubusercontent.com/AnliHuer/Markdown-picture/master/homework-get-branch.png)
***

点击github分支栏的输入框选定分支(如果只存在一个分支，则无需选择)。

![selectBranch](https://raw.githubusercontent.com/AnliHuer/Markdown-picture/master/homework-select-branch.png)
***

点击**提交地址**按钮，提交答案。

![clickCommit](https://raw.githubusercontent.com/AnliHuer/Markdown-picture/master/homework-click-commit.png)
***

###运行结果：

提交题目后，可在**运行结果**栏查看题目的运行结果（因题目难度不同，题目运行时间不定，请耐心等待）。若结果正确，则下一题解锁，用户继续完成下一题目；若错误，请继续完成本题目，直至正确或答题超时。

![runResult](https://raw.githubusercontent.com/AnliHuer/Markdown-picture/master/homework-run-result.png)
***

#####**注：Homework题目的每一道题都有严格的答题时间限制，答题超时则下一题不能解锁，您将失去答题资格。因此，请务必在规定的时间范围内完成题目。**" WHERE  id = 1;
UPDATE homeworkQuiz SET description = "按如下要求分隔数据完成题目：

当输入格式为100   输出为 100;

当输入格式为1000   输出为 1,000;

当输入格式为1000000,输出为 1,000,000;

当输入格式为1000.0,输出为 1,000;

当输入格式为100.2342,输出为 100.2342" WHERE id = 2;
UPDATE homeworkQuiz SET description = "请在文件src/calculate-median.js中实现calculate_median函数;

函数作用：返回输入数组中所有第偶数个元素的中位数;

例如当传入[1,2,3,4] 则函数应该返回2和4的中位数——3" where id = 3;
UPDATE homeworkQuiz SET description = "选出A集合中元素的key属性，跟B对象中value属性中的元素相同的元素

例如:

A = [{key: 'a'}, {key: 'e'}, {key: 'h'}, {key: 't'}, {key: 'f'}, {key: 'c'}, {key: 'g'}, {key: 'b'}, {key: 'd'}];

B = {value: ['a', 'd', 'e', 'f']};

结果返回:['a', 'e', 'f', 'd']" where id = 4;
UPDATE homeworkQuiz SET description = "clone模板地址，得到题目文件;

进入文件目录下，使用npm install安装所需依赖;

specs存放题目和任务，你需要在practices写实现方法;

也可以使用使用npm test可以得信息，进入响应目录下使用javascript完成对应方法;

当npm test所有任务显示为通过的绿色时，提交到github上，并在编程题对应题目输入你的github地址，即可完成。", evaluateScript = "http://nginx/fs/homework-script/test-collection.sh", templateRepository = "https://github.com/wengjiaojiao/empty-flaten" where id = 5;
UPDATE homeworkQuiz SET description = "spec为测试文件夹,请根据此文件要求编写代码;

将代码写入src文件夹下的collect_all_even文件中", evaluateScript = "http://nginx/fs/homework-script/collection.sh",templateRepository = "https://github.com/AnliHuer/collection" WHERE id = 6;
INSERT INTO homeworkQuiz VALUES (NULL , "菲波那切数列  0, 1, 1, 2, 3, 5, 8, 13, 21, 34

写出一个生成前n个菲波那切数列的函数

例如：
n= 1 时，数列为：[0,1]
n= 2 时，数列为：[0,1,1]
n=10 时，数列为：[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]", "http://nginx/fs/homework-script/fibonacci_series.sh", "test.com/homework/5", "https://github.com/sialvsic/fibonacci_series.git
");
INSERT INTO homeworkQuiz VALUES (NULL , "clone模板地址，得到题目文件。

进入文件目录下，使用nam install安装所需依赖，

使用npm test可以得到题目和任务信息，进入相应目录下使用javascript完成对应方法，

当npm test所有任务显示为通过的绿色时，提交到github上，并在编程题对应题目输入你的github地址，即可完成。

祝你好运~", "http://nginx/fs/homework-script/pre-pos-sec.sh", "test.com/homework/5", "https://github.com/Lucky-LengYi/pre-pos-sec-1");

