package com.thoughtworks.twars.mapper;

import com.thoughtworks.twars.bean.ThirdParty;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.*;

public class GithubUserMapperTest extends TestBase{
    private GithubUserMapper githubUserMapper;
    @Before
    public void setUp() throws Exception {
        super.setUp();
        githubUserMapper = session.getMapper(GithubUserMapper.class);
    }

    @Test
    public void shoule_add_github_user() throws Exception {
        ThirdParty githubUser = new ThirdParty();

        githubUser.setThirdPartyId(1);
        githubUser.setUserId(2);

        githubUserMapper.insertGithubUser(githubUser);

        assertThat(githubUser.getId(), is(1));
    }
}