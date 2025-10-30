# Spring Security JWT認証サンプル

Spring Boot 3.x、Spring Security 6.x、JWTを使用した完全に動作するログイン・ダッシュボードアプリケーションです。

## 技術スタック

- **Spring Boot**: 3.2.0
- **Spring Security**: 6.x
- **JWT**: jjwt 0.12.3
- **データベース**: H2 (in-memory)
- **JPA/Hibernate**: データ永続化
- **Thymeleaf**: テンプレートエンジン
- **Bootstrap 5**: UIフレームワーク
- **Maven**: ビルドツール
- **Java**: 17

## 主な機能

- ✅ JWT (JSON Web Token) ベースの認証
- ✅ アクセストークンとリフレッシュトークン
- ✅ HttpOnly Cookieでのリフレッシュトークン管理
- ✅ セッションレス (STATELESS) アーキテクチャ
- ✅ ロールベースのアクセス制御 (ROLE_ADMIN, ROLE_USER)
- ✅ 自動トークンリフレッシュ機能
- ✅ ログアウト時のトークン削除
- ✅ レスポンシブなUIデザイン

## プロジェクト構成

```
src/
├── main/
│   ├── java/com/example/jwtdemo/
│   │   ├── config/
│   │   │   ├── DataInitializer.java        # 初期データ投入
│   │   │   ├── JwtConfig.java              # JWT設定
│   │   │   └── SecurityConfig.java         # Spring Security設定
│   │   ├── controller/
│   │   │   ├── AuthController.java         # 認証API
│   │   │   ├── DashboardController.java    # ダッシュボードAPI
│   │   │   └── WebController.java          # 画面表示
│   │   ├── dto/
│   │   │   ├── DashboardResponse.java
│   │   │   ├── LoginRequest.java
│   │   │   └── LoginResponse.java
│   │   ├── entity/
│   │   │   ├── RefreshToken.java           # リフレッシュトークン
│   │   │   └── User.java                   # ユーザー
│   │   ├── filter/
│   │   │   └── JwtAuthenticationFilter.java # JWT認証フィルター
│   │   ├── repository/
│   │   │   ├── RefreshTokenRepository.java
│   │   │   └── UserRepository.java
│   │   ├── service/
│   │   │   ├── AuthService.java            # 認証サービス
│   │   │   ├── CustomUserDetailsService.java
│   │   │   └── RefreshTokenService.java    # トークン管理
│   │   ├── util/
│   │   │   └── JwtTokenProvider.java       # JWT生成・検証
│   │   └── JwtDemoApplication.java
│   └── resources/
│       ├── static/
│       │   ├── css/
│       │   │   └── style.css
│       │   └── js/
│       │       ├── dashboard.js
│       │       └── login.js
│       ├── templates/
│       │   ├── dashboard.html
│       │   └── login.html
│       └── application.properties
└── test/
```

## セットアップと起動方法

### 前提条件

- Java 17以上
- Maven 3.6以上

### 1. リポジトリのクローン

```bash
git clone https://github.com/katsuyuki-kanai/spring-security-jwt-login-sample.git
cd spring-security-jwt-login-sample
```

### 2. アプリケーションのビルドと起動

```bash
mvn clean install
mvn spring-boot:run
```

### 3. アプリケーションへのアクセス

ブラウザで以下のURLにアクセス：
```
http://localhost:8080
```

## テストアカウント

初期データとして以下のユーザーが作成されます：

| ユーザー名 | パスワード | 権限 |
|-----------|----------|------|
| admin | admin123 | ROLE_ADMIN |
| user | user123 | ROLE_USER |

## API仕様

### 認証API

#### POST /api/auth/login
ログイン処理

**リクエスト:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**レスポンス:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "username": "admin",
  "role": "ROLE_ADMIN"
}
```

**Cookie:** `refreshToken` (HttpOnly, SameSite=Strict)

#### POST /api/auth/refresh
アクセストークンのリフレッシュ

**レスポンス:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer"
}
```

#### POST /api/auth/logout
ログアウト処理（要認証）

**レスポンス:**
```json
{
  "message": "Logged out successfully"
}
```

### ダッシュボードAPI

#### GET /api/dashboard
ダッシュボード情報取得（要認証）

**ヘッダー:**
```
Authorization: Bearer <accessToken>
```

**レスポンス:**
```json
{
  "message": "Welcome to the dashboard!",
  "username": "admin",
  "role": "ROLE_ADMIN"
}
```

## セキュリティ機能

### JWT トークン

- **アルゴリズム**: HS512
- **アクセストークン有効期限**: 1時間 (3600000ms)
- **リフレッシュトークン有効期限**: 7日間 (604800000ms)

### トークン管理

1. **アクセストークン**: localStorage に保存
2. **リフレッシュトークン**: HttpOnly Cookie に保存
3. トークン期限切れ時の自動リフレッシュ
4. ログアウト時のDBからのトークン削除

### セキュリティ設定

- CSRF: 無効化 (JWT使用のため)
- セッション: STATELESS (セッションレス)
- CORS: デフォルト設定
- パスワード: BCryptで暗号化

## H2コンソールへのアクセス

開発時にデータベースを確認できます：

```
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:testdb
Username: sa
Password: (空白)
```

## カスタマイズ

### JWT設定の変更

`src/main/resources/application.properties` を編集：

```properties
jwt.secret=your-secret-key-here
jwt.access-token-expiration=3600000
jwt.refresh-token-expiration=604800000
```

**注意**: 本番環境では必ず強力な秘密鍵を使用してください。

### データベースの変更

H2からPostgreSQL等への変更も可能です。`pom.xml` と `application.properties` を修正してください。

## 開発のヒント

### ログレベルの設定

```properties
logging.level.com.example.jwtdemo=DEBUG
```

### デバッグモード

IDEでデバッグする場合は、`JwtDemoApplication.java` をデバッグモードで実行してください。

## トラブルシューティング

### ポート8080が既に使用されている

`application.properties` にポート設定を追加：
```properties
server.port=8081
```

### JWTトークンが無効

- ブラウザのlocalStorageをクリア
- Cookieをクリア
- 再度ログイン

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。
