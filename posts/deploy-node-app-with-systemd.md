


使用systemd服务来启动node程序。

#### #Config
```
[Unit]
Description=MT.NODE Systemd Service
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=simple
User=mt

StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=mt
SyslogFacility=local0

WorkingDirectory=/home/mt/www
Environment=PATH=$PATH:/home/mt/.nvm/versions/node/v0.12.7 NODE_ENV=production NODE_PATH=/home/mt/.nvm/versions/node/v0.12.7/lib/node_modules
ExecStart=/home/mt/.nvm/versions/node/v0.12.7/bin/npm start
Restart=always

NoNewPrivileges=true
PrivateNetworks=true

[Install]
WantedBy=multi-user.target
```

#### #Refer

- https://ejjohnson.net/securing-ghost-with-systemd-on-centos7/
- https://www.digitalocean.com/community/tutorials/how-to-deploy-node-js-applications-using-systemd-and-nginx