package com.thoughtworks.twars.filter;

import org.apache.ibatis.session.SqlSessionManager;

import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.Response;
import java.io.IOException;

public class CloseSessionResponseFilter implements ContainerResponseFilter {

    @Inject
    SqlSessionManager session;

    @Override
    public void filter(ContainerRequestContext requestContext,
                       ContainerResponseContext responseContext) throws IOException {
        try {
            if (responseContext.getStatus() < Response.Status.BAD_REQUEST.getStatusCode()) {
                session.commit(true);
            } else {
                Boolean skipRollback = (Boolean) requestContext.getProperty("skipRollback");
                if (skipRollback != null && skipRollback) {
                    session.commit(true);
                } else {
                    session.rollback(true);
                }
            }
        } catch (Exception e) {

        } finally {
            try {
//                session.close();
            } catch (Exception e) {

            }
        }


    }
}
