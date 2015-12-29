package com.thoughtworks.twars;

import com.thoughtworks.twars.mapper.PaperMapper;
import com.thoughtworks.twars.mapper.UserMapper;
import com.thoughtworks.twars.util.DBUtil;
import org.apache.ibatis.session.SqlSession;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;

import javax.ws.rs.ApplicationPath;

@ApplicationPath("resources")
public class App extends ResourceConfig {

    public App() {

        SqlSession session = DBUtil.getSession();
        final UserMapper userMapper = session.getMapper(com.thoughtworks.twars.mapper.UserMapper.class);
        final PaperMapper paperMapper = session.getMapper(com.thoughtworks.twars.mapper.PaperMapper.class);

        packages("com.thoughtworks.twars.resource")
            .register(new AbstractBinder() {
                @Override
                protected void configure() {
                    bind(userMapper).to(UserMapper.class);
                    bind(paperMapper).to(PaperMapper.class);
                }
            });
    }
}