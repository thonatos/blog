



for the reason that we need test the func in internal network, we use dnsmasq to set up internal dns.

## #Tools

- dnsmasq
- ubuntu 14.x/Centos7.x

## #Steps

### #install

```
#intall
apt-get install dnsmasq -y 
# yum install dnsmasq -y

#start & autostart
systemctl start dnsmasq
systemctl enable dnsmasq
```

### #conf

```
#/etc/dnsmasq.conf 
resolv-file=/etc/resolv.dnsmasq.conf
strict-order
listen-address=192.168.2.121,127.0.0.1

# /etc/resolv.conf
echo 'nameserver 127.0.0.1' > /etc/resolv.conf

# /etc/resolv.dnsmasq.conf
cp /etc/resolv.conf /etc/resolv.dnsmasq.conf
echo 'nameserver 119.29.29.29' > /etc/resolv.dnsmasq.conf

# /etc/dnsmasq.d/dnsmasq.hosts
cp /etc/hosts /etc/dnsmasq.d/dnsmasq.hosts
echo 'addn-hosts=/etc/dnsmasq.d/dnsmasq.hosts' >> /etc/dnsmasq.conf
```

### #restart & test
```
# restart
systemctl restart dnsmasq

# check status
netstat -tunlp|grep 53

# ping test
ping baidu.com
```


### #more

```
# nslookup an domain(not exist) & get the ip
bogus-nxdomain={ip}

# speedup
server=/cn/114.114.114.114
server=/taobao.com/114.114.114.114
server=/taobaocdn.com/114.114.114.114

# foreign
server=/google.com/223.5.5.5

# block ads
address=/ad.youku.com/127.0.0.1
address=/ad.iqiyi.com/127.0.0.1

# redirect site
address=/freehao123.com/123.123.123.123
```