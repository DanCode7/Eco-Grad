# EcoGrad Database Schema

## 데이터베이스 정보
- Database: ecograd
- User: ecograd
- Password: EcoGrad_1234

## 테이블 구조

### 1. users 테이블
사용자 정보를 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 사용자 고유 ID |
| username | VARCHAR(255) | UNIQUE, NOT NULL | 사용자 이메일 (로그인 ID) |
| password | VARCHAR(255) | NOT NULL | 해시된 비밀번호 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 계정 생성 시간 |

### 2. posts 테이블
판매 게시물 정보를 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 게시물 고유 ID |
| user_id | INT | NOT NULL, FOREIGN KEY | 작성자 ID (users.id 참조) |
| title | VARCHAR(50) | NOT NULL | 게시물 제목 |
| item_type | ENUM | NOT NULL | 아이템 종류 ('Gown', 'Cap', 'Stole', 'Set') |
| size | ENUM | NOT NULL | 사이즈 ('XS', 'S', 'M', 'L', 'XL', 'XXL') |
| condition_status | ENUM | NOT NULL | 상태 ('New', 'Like New', 'Worn') |
| price | DECIMAL(10,2) | NOT NULL | 가격 |
| contact_info | TEXT | NOT NULL | 연락처 정보 |
| image_path | VARCHAR(500) | NULL | 이미지 파일 경로 |
| image_filename | VARCHAR(255) | NULL | 이미지 파일명 |
| image_url | VARCHAR(500) | NULL | 이미지 접근 URL |
| status | ENUM | DEFAULT 'active' | 판매 상태 ('active', 'sold') |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | 수정 시간 |

### 인덱스
- idx_status: status 컬럼 인덱스 (빠른 필터링)
- idx_user_id: user_id 컬럼 인덱스 (사용자별 조회)
- idx_item_type: item_type 컬럼 인덱스 (아이템 타입 필터)
- idx_size: size 컬럼 인덱스 (사이즈 필터)
- idx_condition: condition_status 컬럼 인덱스 (상태 필터)
- idx_price: price 컬럼 인덱스 (가격 정렬)

### 관계
- posts.user_id → users.id (ON DELETE CASCADE)
  - 사용자 삭제 시 해당 사용자의 모든 게시물도 삭제됨

## 사용 예시

### 사용자의 게시물 조회
```sql
SELECT * FROM posts 
WHERE user_id = ? AND status = 'active'
ORDER BY created_at DESC;
```

### 전체 활성 게시물 조회 (Buy 페이지)
```sql
SELECT p.*, u.username 
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.status = 'active'
ORDER BY p.created_at DESC;
```

### 필터링된 게시물 조회
```sql
SELECT * FROM posts 
WHERE status = 'active'
  AND item_type IN ('Gown', 'Cap')
  AND size IN ('M', 'L')
  AND condition_status = 'Like New'
  AND price BETWEEN 20 AND 100
ORDER BY price ASC;
```