package com.thoughtworks.twars.filter;

import org.apache.ibatis.session.SqlSessionManager;

import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import java.io.IOException;

public class OpenSessionRequestFilter  implements ContainerRequestFilter {
    @Inject
    SqlSessionManager sqlSessionManager;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        sqlSessionManager.startManagedSession();
    }
}
