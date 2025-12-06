# Dùng bản slim-bullseye (Debian 11) để tương thích tốt với driver SQL Server
FROM python:3.9-slim-bullseye

WORKDIR /app

# 1. Cài đặt các gói hệ thống cần thiết (Thêm gnupg, apt-transport-https)
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    apt-transport-https \
    unixodbc-dev \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 2. Tải và cài đặt Microsoft ODBC Driver 17 for SQL Server (Dành cho Debian 11)
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17

# 3. Cài thư viện Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy mã nguồn
COPY . .

# 5. Chạy server
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]