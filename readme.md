
# 使用说明：


### 配置

切换dev分支

```
git checkout dev
```

安装npm依赖包

```
npm install
```


### 使用

启动server

```
./gradlew startserver
```

用浏览器启动

```
http://localhost:3000/
```

### 注意

\** public目录里的文件通过source自动生成，请勿手动修改。 \*\*

### 数据库

添加database，命名为BronzeSword

CREATE DATABASE `BronzeSword` CHARACTER SET utf8 COLLATE utf8_general_ci;

给mysql添加用户,用户名: BronzeSword 密码：12345678

```
create user 'BronzeSword'@'%' identified by '12345678';
```

将BronzeSword的权限赋给BronzeSword用户

```
grant all privileges on BronzeSword.* to 'BronzeSword'@'%';
flush privileges;
```

### 配置文件

配置文件在app/config目录下 需要手动创建和.template的模板文件同名的json文件 格式参照模板