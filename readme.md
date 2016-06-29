## Fully clone the project
```
git clone git@github.com:thoughtworks-academy/recruiting-system.git
git submodule init
git submodule update
```

### Setup containers
```
cd assembly
docker-compose up -d
```
>It takes a long time to pull images from docker registry.
Use a cable can save lots of time.
```
./twars.sh my
```
![](http://ww1.sinaimg.cn/large/61412e43jw1f5c5hoccqjj20xw03sjsk.jpg)
Input password:'thoughtworks'.(Find it from `test.env`)
```
./twars.sh jk
```
It will initialize Jenkins by install plugins and create jobs.

```
./twars.sh rs
```
It will install tools on local machine and restart containers.

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
<http://192.168.99.100:8888/api/inspector>
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
## Visit
Visit <http://192.168.99.100:8888>[](http://)