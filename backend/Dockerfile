# src/backend/Dockerfile
FROM python:3.9-slim-bullseye

WORKDIR /app

# 1. Cài đặt gói hệ thống, Driver SQL VÀ GÓI NGÔN NGỮ (LOCALES)
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    apt-transport-https \
    unixodbc-dev \
    g++ \
    locales \  
    && sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen \
    && locale-gen \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    && rm -rf /var/lib/apt/lists/*

# Thiết lập biến môi trường cho Unicode
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# 2. Cài thư viện Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. Copy mã nguồn
COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]