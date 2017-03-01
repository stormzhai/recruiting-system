#! /usr/bin/env bash

git remote -v
git remote set-url origin git@github.com:tws-system/recruiting-system.git 
git remote -v


cd web
git remote -v
git remote set-url origin git@github.com:tws-system/recruiting-system-web.git 
git remote -v
cd -

cd web-api
git remote -v
git remote set-url origin git@github.com:tws-system/recruiting-system-express-api.git 
git remote -v
cd -

cd paper-api
git remote -v
git remote set-url origin git@github.com:tws-system/recruiting-system-paper-api.git 
git remote -v
cd -

cd teacher-admin-web
git remote -v
git remote set-url origin git@github.com:tws-system/recruiting-system-teacher-web.git 
git remote -v
cd -

cd automated-test
git remote -v
git remote set-url origin git@github.com:tws-system/recruiting-system-automated-test.git 
git remote -v
cd -



