# ThoughtWorks Recruiting System

## Fully clone the project
```
git clone git@github.com:thoughtworks-academy/recruiting-system.git
git submodule init
git submodule update
```

## Setup containers
```
cd assembly
docker-compose up -d
```
> It takes a long time to pull images from docker registry.
Use a cable can save lots of time.

In `assembly` directory, run command `./twars.sh`, your'll see help information 
```
========= TWARS ===========

  0--0^^^^^^^^^^^^\________
  \__/||-------||---------~
      ``       ``

用法：(jk|rjk|bkjk|my|rs)
- command：
jk 初始化jenkins
rjk 更新jenkins
my 初始化数据库和用户
rs 重启所有服务
bkjk 备份jenkins
```

Firstly, run command  `./twars.sh my` and then input password: `thoughtworks` to initial database. (database configuration is local in `test.env`)

Secondly, run command `./twars.sh jk` to initialize **Jenkins** by install plugins and create jobs.

Finally,  run command `./twars.sh rs` to install tools on local machine and restart containers.

## The tricky part
Edit `web-api/app.js`:
Comment two lines related to captcha:
```
var captcha = require('./middleware/captcha');
app.use(captcha(params));
```
Then run `npm install canvas` in `web-api` container:
* Get a shell to `web-api`
```
docker exec -it $(docker ps | grep 'node' | cut -d' ' -f1) bash
```
* Install dependency
```
cd /var/app && npm install canvas
```
Exit the shell, uncomment the TWO lines of code.
Restart the `web-api` container.

## Check result
visit <http://localhost:8888/api/inspector>
The response should look like below:
```
{
  "app": "connected",
  "mysql": "connected",
  "api": "connected",
  "mongodb": "connected",
  "task-queue": {
    "code": "ENOTFOUND",
    "errno": "ENOTFOUND",
    "syscall": "getaddrinfo",
    "hostname": "task-queue",
    "host": "task-queue",
    "port": "4000"
  }
}
```
> Ignore the `task-queue` part. It is the OLD architect and should be removed from the response.

## Visit Homepage
Visit <http://localhost:8888>[](http://localhost:8888)
