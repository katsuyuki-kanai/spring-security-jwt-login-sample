# Spring Security JWT認証サンプル

Spring Boot 3.x、Spring Security 6.x、JWTを使用したトークンベース認証のサンプルプロジェクトです。

## 特徴

- JWT（JSON Web Token）による認証
- アクセストークン（1時間有効）
- リフレッシュトークン（7日間有効、HttpOnly Cookie）
- REST API
- Thymeleaf + JavaScriptによるフロントエンド
- H2インメモリデータベース

## 起動方法

```bash
mvn spring-boot:run
```

## アクセスURL

- ログイン画面: http://localhost:8080/
- ダッシュボード: http://localhost:8080/dashboard
- H2コンソール: http://localhost:8080/h2-console

## テストユーザー

| ユーザー名 | パスワード | ロール |
|-----------|----------|--------|
| admin | admin123 | ROLE_ADMIN |
| user | user123 | ROLE_USER |

## API エンドポイント

### 認証API

#### ログイン
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt
```

#### トークンリフレッシュ
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -b cookies.txt
```

#### ログアウト
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -b cookies.txt
```

### 保護されたAPI

#### ダッシュボード情報取得
```bash
curl http://localhost:8080/api/dashboard \
  -H "Authorization: Bearer {accessToken}"
```

## 技術スタック

- Java 17
- Spring Boot 3.2.0
- Spring Security 6.x
- JWT (jjwt 0.12.3)
- Thymeleaf
- Bootstrap 5
- H2 Database
- Maven

## プロジェクト構造

```
src/main/java/com/example/jwtdemo/
├── JwtDemoApplication.java
├── config/
│   ├── SecurityConfig.java
│   └── JwtConfig.java
├── controller/
│   ├── AuthController.java
│   ├── DashboardController.java
│   └── WebController.java
├── dto/
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   └── DashboardResponse.java
├── entity/
│   ├── User.java
│   └── RefreshToken.java
├── repository/
│   ├── UserRepository.java
│   └── RefreshTokenRepository.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
├── service/
│   ├── AuthService.java
│   └── RefreshTokenService.java
└── init/
    └── DataInitializer.java
```

## JWT認証フロー

1. ユーザーがログイン画面でユーザー名とパスワードを入力
2. サーバーが認証し、アクセストークンとリフレッシュトークンを発行
3. アクセストークンはlocalStorageに保存
4. リフレッシュトークンはHttpOnly Cookieに保存
5. API呼び出し時にAuthorizationヘッダーでアクセストークンを送信
6. アクセストークン期限切れ時、リフレッシュトークンで新しいアクセストークンを取得

## セキュリティ

- パスワードはBCryptでハッシュ化
- リフレッシュトークンはHttpOnly Cookieで保存（XSS対策）
- セッションレス設計（STATELESS）
- CSRF保護は無効化（JWT認証のため）

## ライセンス

MIT
