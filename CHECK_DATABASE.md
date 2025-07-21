# 데이터베이스 테이블 확인 방법

## 1. MySQL 명령줄로 확인하기

### MySQL 접속
```bash
mysql -u ecograd -p
# 비밀번호 입력: EcoGrad_1234
```

### 데이터베이스 선택
```sql
USE ecograd;
```

### 테이블 목록 확인
```sql
SHOW TABLES;
```

### 테이블 구조 확인
```sql
-- users 테이블 구조 확인
DESCRIBE users;
-- 또는
SHOW CREATE TABLE users;

-- posts 테이블 구조 확인
DESCRIBE posts;
-- 또는
SHOW CREATE TABLE posts;
```

### 데이터 확인
```sql
-- users 테이블 데이터 확인
SELECT * FROM users;

-- posts 테이블 데이터 확인
SELECT * FROM posts;
```

## 2. MySQL Workbench로 확인하기 (GUI)

1. MySQL Workbench 실행
2. 새 연결 만들기:
   - Connection Name: EcoGrad
   - Hostname: localhost
   - Username: ecograd
   - Password: EcoGrad_1234
3. 연결 후 좌측 스키마 탭에서 'ecograd' 데이터베이스 확인
4. Tables 폴더를 펼쳐서 테이블 목록 확인

## 3. 웹 브라우저에서 확인하기

1. 개발 서버가 실행 중인지 확인
2. 브라우저에서 다음 URL 접속:
   ```
   http://localhost:3000/api/init-db
   ```
3. 성공 메시지 확인:
   ```json
   {"message":"Database initialized successfully"}
   ```

## 4. API 라우트로 테이블 정보 확인하기

테이블 정보를 확인하는 API 라우트를 만들어보겠습니다: