package com.thoughtworks.twars.util;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.apache.ibatis.session.SqlSessionManager;

import java.io.IOException;
import java.io.InputStream;

public final class DBUtil {

    private DBUtil() {}

    public static SqlSessionManager getSession() {
        String resource = "mybatis/mybatis-config.xml";
        SqlSessionManager session = null;

        try {
            InputStream is = Resources.getResourceAsStream(resource);
            SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
//            SqlSessionFactory sqlSessionFactory = builder.build(is);
//            sqlSessionFactory
//            session.startManagedSession();
            session = SqlSessionManager.newInstance(is);
//            session = sqlSessionFactory.openSession();


        } catch (IOException e) {
            e.printStackTrace();
        }

        return session;
    }

}
