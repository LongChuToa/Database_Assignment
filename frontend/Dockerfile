# Sử dụng Node.js nhẹ
FROM node:18-alpine

WORKDIR /app

# Copy file package để cài thư viện trước (tận dụng cache)
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Chạy web
CMD ["npm", "start"]