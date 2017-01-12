


Conf PositiveSSL For Nginx.

#### #key & csr

```
openssl req -new -newkey rsa:2048 -nodes -keyout example_com.key -out example_com.csr
```

- example_com.key -- your Private key. You'll need this later to configure ngxinx.
- example_com.csr -- Your CSR file.

#### #crt  

- .crt
- .ca-bundle

```
cat www_yourdomain_com.crt www_yourdomain_com.ca-bundle > ssl-bundle.crt
```

#### #config nginx

```
ssl on;
ssl_certificate /etc/ssl/certs/ssl-bundle.crt;
ssl_certificate_key /etc/ssl/private/mysite.key;
```

#### #reference

- [Certificate Installation: NGINX](https://support.comodo.com/index.php?/Knowledgebase/Article/View/789/0/certificate-installation-nginx)
- [install-comodo-ssl-cert-for-nginx](https://gist.github.com/bradmontgomery/6487319)
- [Installing a certificate on Nginx](https://www.namecheap.com/support/knowledgebase/article.aspx/9419/0/nginx)