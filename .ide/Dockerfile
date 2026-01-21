# 指定使用 Ubuntu 22.04.5 LTS
FROM ubuntu:22.04

USER root

# 设置环境变量，避免安装过程中的交互提示
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Shanghai

# 1. 更新源并安装基础工具
# 使用腾讯云软件源镜像以加速下载
RUN sed -i 's/archive.ubuntu.com/mirrors.cloud.tencent.com/g' /etc/apt/sources.list && \
    apt-get update && apt-get install -y \
    git \
    net-tools \
    ssh \
    curl \
    xz-utils

# 2. 安装 MySQL Server   
RUN apt-get install -y \
    mysql-server 

# 配置免密
RUN echo "[client]\nuser=root\npassword=111\nport=3306" > /root/.my.cnf

# 3. 安装 Redis
RUN apt-get install -y \
    redis-server

# 4. 安装 PHP 8.1 (Ubuntu 22.04 默认版本就是 8.1)
RUN apt-get install -y \
    php8.1-mysql \
    php8.1-gd \
    php8.1-redis

# 5. 安装 Node.js
RUN curl -fsSL https://mirrors.cloud.tencent.com/nodejs-release/v18.17.1/node-v18.17.1-linux-x64.tar.xz | tar -xJ --strip-components=1 -C /usr/local

# 安装 pnpm 8.6.10 并设置腾讯云镜像源
RUN npm config set registry https://mirrors.cloud.tencent.com/npm/ && \
    npm install -g pnpm@8.6.10 && \
    pnpm config set registry https://mirrors.cloud.tencent.com/npm/

# 6. 安装 Apache 2.4
RUN apt-get install -y \
    apache2 \
    libapache2-mod-php8.1

# 开启 Apache 常用模块 (如 rewrite 用于美化 URL)
RUN a2dismod mpm_event

RUN a2enmod \
    rewrite \
    proxy \
    proxy_http \
    mpm_prefork \
    php8.1

# 7. 安装 code-server (IDE 界面)
RUN curl -fsSL https://code-server.dev/install.sh | sh

# 8. 设置工作目录
WORKDIR /workspace

# 暴露 80(前端), 8080(后端), 8000(IDE), 3306(MySQL), 6379(Redis)
EXPOSE 80 8080 8000 3306 6379

# 这是 VS Code 的浏览器版本。CNB 的“云原生开发”本质上就是在一个 Linux 容器里运行了这个程序，然后让你在浏览器里访问它。
CMD ["code-server", "--auth", "none", "--bind-addr", "0.0.0.0:8000", "/workspace"]
