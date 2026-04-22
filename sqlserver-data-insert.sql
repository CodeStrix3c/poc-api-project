-- ================================================================
-- SQL Server Data Insert Script
-- Generated from forum-export.json
-- ================================================================

USE [discussion_forum];
GO
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO
BEGIN TRANSACTION;
GO

PRINT 'Loading discussion_forum_Users';
GO
SET IDENTITY_INSERT [discussion_forum_Users] ON;
GO
INSERT INTO [discussion_forum_Users] ([Id], [Username], [DisplayName], [Email], [Avatar], [Bio], [Reputation], [GoldBadges], [SilverBadges], [BronzeBadges], [Location], [Website], [IsOnline], [JoinedAt], [LastSeen]) VALUES (1, N'dev_ninja', N'Arjun Mehta', N'arjun.mehta@example.com', N'https://i.pravatar.cc/150?img=11', N'Full-stack developer | .NET Core | React | Cloud Architecture', 15420, 5, 22, 48, N'Bangalore, India', N'https://arjunmehta.dev', 1, N'2021-03-15 08:30:00', N'2026-03-31 14:22:00');
INSERT INTO [discussion_forum_Users] ([Id], [Username], [DisplayName], [Email], [Avatar], [Bio], [Reputation], [GoldBadges], [SilverBadges], [BronzeBadges], [Location], [Website], [IsOnline], [JoinedAt], [LastSeen]) VALUES (2, N'code_queen', N'Sara Chen', N'sara.chen@example.com', N'https://i.pravatar.cc/150?img=5', N'Python | ML Engineer | Open Source Contributor', 28750, 12, 45, 89, N'San Francisco, CA', N'https://sarachen.io', 1, N'2020-01-10 10:00:00', N'2026-04-01 09:15:00');
INSERT INTO [discussion_forum_Users] ([Id], [Username], [DisplayName], [Email], [Avatar], [Bio], [Reputation], [GoldBadges], [SilverBadges], [BronzeBadges], [Location], [Website], [IsOnline], [JoinedAt], [LastSeen]) VALUES (3, N'js_wizard', N'Liam O''Connor', N'liam.oconnor@example.com', N'https://i.pravatar.cc/150?img=12', N'JavaScript enthusiast | Node.js | TypeScript | DevOps', 9870, 2, 15, 33, N'Dublin, Ireland', N'', 0, N'2022-06-20 14:45:00', N'2026-03-30 18:00:00');
INSERT INTO [discussion_forum_Users] ([Id], [Username], [DisplayName], [Email], [Avatar], [Bio], [Reputation], [GoldBadges], [SilverBadges], [BronzeBadges], [Location], [Website], [IsOnline], [JoinedAt], [LastSeen]) VALUES (4, N'rust_ranger', N'Yuki Tanaka', N'yuki.tanaka@example.com', N'https://i.pravatar.cc/150?img=15', N'Systems programmer | Rust | C++ | Performance optimization', 34200, 18, 67, 120, N'Tokyo, Japan', N'https://yukitanaka.dev', 1, N'2019-11-05 06:20:00', N'2026-04-01 03:45:00');
INSERT INTO [discussion_forum_Users] ([Id], [Username], [DisplayName], [Email], [Avatar], [Bio], [Reputation], [GoldBadges], [SilverBadges], [BronzeBadges], [Location], [Website], [IsOnline], [JoinedAt], [LastSeen]) VALUES (5, N'cloud_architect', N'Priya Sharma', N'priya.sharma@example.com', N'https://i.pravatar.cc/150?img=9', N'AWS Certified Solutions Architect | Kubernetes | Terraform', 21300, 8, 35, 72, N'Hyderabad, India', N'https://priyasharma.cloud', 0, N'2020-08-12 11:30:00', N'2026-03-31 20:10:00');
INSERT INTO [discussion_forum_Users] ([Id], [Username], [DisplayName], [Email], [Avatar], [Bio], [Reputation], [GoldBadges], [SilverBadges], [BronzeBadges], [Location], [Website], [IsOnline], [JoinedAt], [LastSeen]) VALUES (6, N'data_alchemist', N'Marcus Johnson', N'marcus.j@example.com', N'https://i.pravatar.cc/150?img=53', N'Data Engineer | Apache Spark | Kafka | PostgreSQL', 11890, 3, 19, 41, N'Austin, TX', N'', 0, N'2021-09-01 16:00:00', N'2026-03-29 22:30:00');
INSERT INTO [discussion_forum_Users] ([Id], [Username], [DisplayName], [Email], [Avatar], [Bio], [Reputation], [GoldBadges], [SilverBadges], [BronzeBadges], [Location], [Website], [IsOnline], [JoinedAt], [LastSeen]) VALUES (7, N'mobile_maven', N'Fatima Al-Hassan', N'fatima.alhassan@example.com', N'https://i.pravatar.cc/150?img=25', N'React Native | Flutter | iOS & Android Developer', 7650, 1, 11, 28, N'Dubai, UAE', N'https://fatima.dev', 1, N'2023-01-18 09:15:00', N'2026-04-01 07:00:00');
INSERT INTO [discussion_forum_Users] ([Id], [Username], [DisplayName], [Email], [Avatar], [Bio], [Reputation], [GoldBadges], [SilverBadges], [BronzeBadges], [Location], [Website], [IsOnline], [JoinedAt], [LastSeen]) VALUES (8, N'security_sentinel', N'Alex Rivera', N'alex.rivera@example.com', N'https://i.pravatar.cc/150?img=33', N'Cybersecurity | Penetration Testing | OWASP | DevSecOps', 18900, 7, 29, 55, N'Berlin, Germany', N'https://alexrivera.sec', 0, N'2020-04-22 13:00:00', N'2026-03-31 16:45:00');
GO
SET IDENTITY_INSERT [discussion_forum_Users] OFF;
GO

PRINT 'Loading discussion_forum_Tags';
GO
SET IDENTITY_INSERT [discussion_forum_Tags] ON;
GO
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (1, N'javascript', N'ECMAScript and its dialects', N'#f7df1e', 2456);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (2, N'python', N'Dynamically typed multi-purpose language', N'#3776ab', 3102);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (3, N'react', N'JavaScript library for building UIs', N'#61dafb', 1847);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (4, N'dotnet', N'Free cross-platform developer platform', N'#512bd4', 1203);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (5, N'csharp', N'Multi-paradigm language by Microsoft', N'#239120', 1567);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (6, N'postgresql', N'Open-source relational DBMS', N'#336791', 987);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (7, N'docker', N'Container-based app deployment', N'#2496ed', 1456);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (8, N'typescript', N'Typed superset of JavaScript', N'#3178c6', 1678);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (9, N'aws', N'Amazon Web Services cloud platform', N'#ff9900', 2103);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (10, N'machine-learning', N'AI branch focused on learning from data', N'#ff6f00', 1534);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (11, N'kubernetes', N'Open-source container orchestration', N'#326ce5', 892);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (12, N'nodejs', N'JavaScript runtime on V8 engine', N'#339933', 1345);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (13, N'rust', N'Systems programming focused on safety', N'#dea584', 678);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (14, N'fastapi', N'Modern Python web framework for APIs', N'#009688', 456);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (15, N'security', N'App security, auth, and authorization', N'#d32f2f', 1890);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (16, N'sql', N'Structured Query Language for RDBMS', N'#e38d13', 2345);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (17, N'git', N'Distributed version control system', N'#f05032', 1123);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (18, N'css', N'Cascading Style Sheets', N'#264de4', 1789);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (19, N'api-design', N'RESTful and GraphQL API best practices', N'#7b1fa2', 567);
INSERT INTO [discussion_forum_Tags] ([Id], [Name], [Description], [Color], [QuestionsCount]) VALUES (20, N'testing', N'Software testing methodologies', N'#388e3c', 890);
GO
SET IDENTITY_INSERT [discussion_forum_Tags] OFF;
GO

PRINT 'Loading discussion_forum_Questions';
GO
SET IDENTITY_INSERT [discussion_forum_Questions] ON;
GO
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (1, N'How to implement JWT refresh token rotation in .NET Core Web API?', N'I''m building a .NET Core 8 Web API and need secure JWT auth with refresh token rotation.

```csharp
public class AuthService {
    public string GenerateAccessToken(User user) {
        var claims = new[] {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };
    }
}
```

Best practices for: 1) Storing refresh tokens (DB vs Redis?) 2) Implementing rotation safely 3) Handling concurrent requests', 1, 47, 1824, 5, 1, N'answered', 0, 0, 0, 0, 23, N'2026-03-28 10:15:00', N'2026-03-29 08:30:00', N'2026-04-02 09:12:54');
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (2, N'React useEffect cleanup causing memory leak in WebSocket connection', N'Memory leak in React when using WebSocket inside useEffect.

```jsx
useEffect(() => {
  const ws = new WebSocket(''wss://api.example.com/live'');
  ws.onmessage = (event) => {
    setMessages(prev => [...prev, JSON.parse(event.data)]);
  };
  return () => { ws.close(); };
}, []);
```

Issue gets worse with rapid page navigation.', 3, 89, 4521, 6, 2, N'answered', 1, 100, 0, 1, 56, N'2026-03-25 16:45:00', N'2026-03-26 09:00:00', N'2026-03-31 11:15:00');
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (3, N'Best approach for implementing RAG with pgvector in PostgreSQL?', N'Building a RAG pipeline with pgvector.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE document_embeddings (
    id SERIAL PRIMARY KEY,
    document_id UUID NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB DEFAULT ''{}''
);
```

1) Table structure for similarity search? 2) Best embedding model for tech docs? 3) Chunking strategy? 4) Production-ready at 500K docs?', 2, 134, 8920, 8, 3, N'answered', 1, 250, 0, 1, 89, N'2026-03-20 08:00:00', N'2026-03-22 14:30:00', N'2026-04-01 06:00:00');
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (4, N'Docker multi-stage build failing with .NET 8 AOT compilation', N'Multi-stage Docker build with Native AOT fails in CI.

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
RUN dotnet publish -c Release -r linux-x64 /p:PublishAot=true -o /app
FROM mcr.microsoft.com/dotnet/runtime-deps:8.0-jammy-chiseled
COPY --from=build /app .
```

Error: `lld-link: error: undefined symbol: __security_cookie`', 1, 32, 2145, 3, 4, N'answered', 0, 0, 0, 0, 15, N'2026-03-27 14:20:00', N'2026-03-27 14:20:00', N'2026-03-29 10:00:00');
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (5, N'Optimizing React rendering performance with large data tables (10k+ rows)', N'Data dashboard with 10,000+ rows. Basic map() rendering makes page unresponsive.

```tsx
const filtered = useMemo(() =>
  data.filter(row => Object.values(row).some(v =>
    String(v).toLowerCase().includes(filter)))
  .sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1),
  [data, filter, sortBy]
);
```

Should I use virtualization? Which library for React 19?', 7, 67, 5678, 7, NULL, N'open', 1, 150, 0, 0, 41, N'2026-03-22 11:30:00', N'2026-03-24 16:00:00', N'2026-03-31 20:45:00');
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (6, N'Kubernetes pod keeps restarting - CrashLoopBackOff with exit code 137', N'Deployment crashes with CrashLoopBackOff. Pod runs ~30s before OOMKilled (exit code 137).

```yaml
resources:
  requests: { memory: ''256Mi'', cpu: ''250m'' }
  limits: { memory: ''512Mi'', cpu: ''500m'' }
```

Node.js Express API. Memory spikes during JSON parsing of large payloads.', 5, 56, 3456, 5, 6, N'answered', 0, 0, 0, 0, 28, N'2026-03-26 09:00:00', N'2026-03-26 09:00:00', N'2026-03-30 16:30:00');
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (7, N'How to properly set up OAuth 2.0 PKCE flow for a React SPA?', N'Need OAuth 2.0 with PKCE for React SPA.

```typescript
const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
};
```

1) Generate code_verifier every login? 2) Where to store it? 3) Handle callback URL in SPA? 4) oidc-client-ts or @auth0/auth0-react?', 8, 78, 6789, 5, NULL, N'answered', 0, 0, 0, 1, 67, N'2026-03-18 13:00:00', N'2026-03-19 10:00:00', N'2026-03-28 09:15:00');
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (8, N'PostgreSQL JSONB query performance degradation after 1M records', N'PostgreSQL 16 with JSONB columns. 1.2M records = 3-5s queries.

```sql
SELECT u.id, p.data->>''firstName''
FROM users u JOIN user_profiles p ON u.id = p.user_id
WHERE p.data @> ''{"preferences": {"theme": "dark"}}''
ORDER BY u.created_at DESC LIMIT 50;
```

What indexing strategy for complex JSONB at scale?', 6, 45, 3210, 4, NULL, N'answered', 0, 0, 0, 0, 34, N'2026-03-24 07:30:00', N'2026-03-25 11:00:00', N'2026-03-29 15:00:00');
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (9, N'Rust lifetime errors when building an async web scraper with Tokio', N'Async web scraper in Rust with Tokio. Lifetime issues with shared state.

```rust
impl Scraper {
    async fn scrape_all(&self, urls: Vec<String>) {
        for url in urls {
            tokio::spawn(async move {
                self.scrape_url(&url).await // ERROR: self does not live long enough
            });
        }
    }
}
```', 4, 38, 1876, 3, NULL, N'open', 0, 0, 0, 0, 19, N'2026-03-29 05:00:00', N'2026-03-29 05:00:00', N'2026-03-31 12:00:00');
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (10, N'Building a real-time collaborative code editor - architecture advice needed', N'Want to build collaborative code editor (like VS Code Live Share).

Stack: React + Monaco Editor, Node.js + WebSocket, CRDT (Yjs) or OT (ShareDB), PostgreSQL + Redis.

1) CRDT vs OT? 2) Multiple user cursors? 3) Conflict resolution? 4) WebSocket or WebRTC?', 3, 156, 12340, 12, 7, N'answered', 1, 500, 0, 1, 134, N'2026-03-15 18:00:00', N'2026-03-20 09:30:00', N'2026-04-01 08:00:00');
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (11, N'What''s the recommended way to handle file uploads in FastAPI with S3?', N'Multipart file uploads in FastAPI → S3. Files up to 100MB.

```python
@app.post(''/upload'')
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()  # Loads entire file in memory!
    s3.put_object(Bucket=''my-bucket'', Key=f''uploads/{file.filename}'', Body=contents)
```

Production-ready approach for large files?', 2, 29, 1567, 3, 8, N'open', 0, 0, 0, 0, 12, N'2026-03-30 12:00:00', N'2026-03-30 12:00:00', N'2026-03-31 18:30:00');
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (12, N'[Discussion] What''s your preferred state management in React 2026?', N'React 19 stable + Server Components. What state management in 2026?

- Zustand — Simple, lightweight
- Jotai — Atomic, fine-grained
- Redux Toolkit — Robust but heavy
- TanStack Query — Server state
- React Context — Built-in but re-renders
- Signals

What''s your team using and why?', 7, 203, 15670, 24, NULL, N'discussion', 0, 0, 0, 1, 178, N'2026-03-10 10:00:00', N'2026-03-10 10:00:00', N'2026-04-01 10:00:00');
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (13, N'How to optimize database queries in Node.js?', N'I have a large database and my queries are getting slow. What are the best practices for optimization?', 1, 0, 0, 0, NULL, N'open', 0, 0, 0, 0, 0, N'2026-04-02 08:46:34', N'2026-04-02 08:46:34', N'2026-04-02 08:46:34');
INSERT INTO [discussion_forum_Questions] ([Id], [Title], [Body], [UserId], [Votes], [Views], [AnswersCount], [AcceptedAnswerId], [Status], [IsBounty], [BountyAmount], [IsClosed], [IsProtected], [Favorites], [CreatedAt], [UpdatedAt], [LastActivityAt]) VALUES (14, N'Database optimization', N'How to optimize queries?', 1, 0, 0, 0, NULL, N'open', 0, 0, 0, 0, 0, N'2026-04-02 09:02:12', N'2026-04-02 09:02:12', N'2026-04-02 09:02:12');
GO
SET IDENTITY_INSERT [discussion_forum_Questions] OFF;
GO

PRINT 'Loading discussion_forum_QuestionTags';
GO
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (1, 4);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (1, 5);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (1, 15);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (1, 19);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (2, 3);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (2, 1);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (2, 8);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (3, 6);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (3, 2);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (3, 10);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (3, 14);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (4, 7);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (4, 4);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (4, 5);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (5, 3);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (5, 1);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (5, 8);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (5, 18);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (6, 11);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (6, 7);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (6, 12);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (6, 9);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (7, 3);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (7, 15);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (7, 8);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (7, 19);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (8, 6);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (8, 16);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (8, 4);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (9, 13);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (9, 19);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (9, 20);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (10, 1);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (10, 3);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (10, 12);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (10, 19);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (11, 2);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (11, 14);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (11, 9);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (12, 3);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (12, 1);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (12, 8);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (13, 12);
INSERT INTO [discussion_forum_QuestionTags] ([QuestionId], [TagId]) VALUES (14, 12);
GO

PRINT 'Loading discussion_forum_Answers';
GO
SET IDENTITY_INSERT [discussion_forum_Answers] ON;
GO
INSERT INTO [discussion_forum_Answers] ([Id], [QuestionId], [UserId], [Body], [Votes], [IsAccepted], [CreatedAt], [UpdatedAt]) VALUES (1, 1, 8, N'Production-ready JWT refresh token rotation:

```csharp
public async Task<TokenPair> RotateRefreshToken(string oldToken) {
    var stored = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == oldToken);
    if (stored == null) throw new SecurityTokenException("Invalid");
    if (stored.IsUsed) {
        await InvalidateTokenFamily(stored.FamilyId);
        throw new SecurityTokenException("Token reuse detected");
    }
    stored.IsUsed = true;
    var newToken = GenerateRefreshToken(stored.FamilyId);
    _context.RefreshTokens.Add(newToken);
    await _context.SaveChangesAsync();
    return new TokenPair(GenerateAccessToken(stored.UserId), newToken.Token);
}
```

Use optimistic concurrency with a version column for concurrent requests.', 52, 1, N'2026-03-28 12:30:00', N'2026-03-28 14:00:00');
INSERT INTO [discussion_forum_Answers] ([Id], [QuestionId], [UserId], [Body], [Votes], [IsAccepted], [CreatedAt], [UpdatedAt]) VALUES (2, 2, 2, N'The fix: ws.close() is async and your component might re-mount before it completes.

```tsx
useEffect(() => {
  mountedRef.current = true;
  const ws = new WebSocket(url);
  ws.onmessage = (e) => { if (!mountedRef.current) return; };
  return () => {
    mountedRef.current = false;
    ws.onclose = null; // KEY: prevents reconnection loops
    ws.close(1000, ''Unmounting'');
  };
}, [url]);
```', 95, 1, N'2026-03-25 18:30:00', N'2026-03-26 10:00:00');
INSERT INTO [discussion_forum_Answers] ([Id], [QuestionId], [UserId], [Body], [Votes], [IsAccepted], [CreatedAt], [UpdatedAt]) VALUES (3, 3, 4, N'Running pgvector with ~800K docs in production. Use HNSW:

```sql
CREATE INDEX idx_chunks_embedding ON document_chunks
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
```

Embedding: text-embedding-3-large (1536 dims) or nomic-embed-text (open-source).
pgvector is production-ready at 500K. Set maintenance_work_mem = ''2GB''.', 142, 1, N'2026-03-20 14:00:00', N'2026-03-22 16:00:00');
INSERT INTO [discussion_forum_Answers] ([Id], [QuestionId], [UserId], [Body], [Votes], [IsAccepted], [CreatedAt], [UpdatedAt]) VALUES (4, 4, 5, N'The __security_cookie error = AOT needs clang in the build container.

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
RUN apt-get update && apt-get install -y clang zlib1g-dev
RUN dotnet publish -c Release -r linux-x64 /p:PublishAot=true /p:StripSymbols=true -o /app
```

Final image ~30-50MB with chiseled base.', 38, 1, N'2026-03-27 16:00:00', N'2026-03-27 16:00:00');
INSERT INTO [discussion_forum_Answers] ([Id], [QuestionId], [UserId], [Body], [Votes], [IsAccepted], [CreatedAt], [UpdatedAt]) VALUES (5, 5, 4, N'Use @tanstack/react-virtual:

```tsx
const virtualizer = useVirtualizer({
  count: data.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 48,
  overscan: 20,
});
```

Renders only visible rows. Went from 3s to <16ms on 50K rows.', 71, 0, N'2026-03-22 14:00:00', N'2026-03-23 09:00:00');
INSERT INTO [discussion_forum_Answers] ([Id], [QuestionId], [UserId], [Body], [Votes], [IsAccepted], [CreatedAt], [UpdatedAt]) VALUES (6, 6, 3, N'Exit code 137 = OOMKilled. Fix:

```yaml
limits:
  memory: ''1Gi''
```

Use streaming for large JSON:
```javascript
req.pipe(JSONStream.parse(''*'')).on(''data'', processChunk);
```

Also set --max-old-space-size in container CMD.', 44, 1, N'2026-03-26 11:00:00', N'2026-03-26 11:00:00');
INSERT INTO [discussion_forum_Answers] ([Id], [QuestionId], [UserId], [Body], [Votes], [IsAccepted], [CreatedAt], [UpdatedAt]) VALUES (7, 10, 4, N'Built something similar. Go with CRDT (Yjs):

1. Conflict-free by design
2. y-monaco bindings for Monaco Editor
3. Works offline, syncs on reconnect

Use Yjs awareness protocol for cursors. WebSocket over WebRTC — NAT traversal is painful.', 89, 1, N'2026-03-16 09:00:00', N'2026-03-18 14:00:00');
INSERT INTO [discussion_forum_Answers] ([Id], [QuestionId], [UserId], [Body], [Votes], [IsAccepted], [CreatedAt], [UpdatedAt]) VALUES (8, 11, 1, N'Use boto3 with multipart upload for streaming:

```python
import boto3
from fastapi import UploadFile

@app.post(''/upload'')
async def upload_file(file: UploadFile):
    s3 = boto3.client(''s3'')
    with file.file as f:
        s3.upload_fileobj(f, ''my-bucket'', file.filename)
    return {''url'': f''https://my-bucket.s3.amazonaws.com/{file.filename}''}
```

Streams directly to S3 without loading in memory. For 100MB+ files, use multipart upload.', 67, 1, N'2026-03-30 13:45:00', N'2026-03-30 14:30:00');
INSERT INTO [discussion_forum_Answers] ([Id], [QuestionId], [UserId], [Body], [Votes], [IsAccepted], [CreatedAt], [UpdatedAt]) VALUES (9, 11, 6, N'Consider using python-multipart with streaming, not file.read():

```python
from fastapi import BackgroundTasks

@app.post(''/upload'')
async def upload_file(file: UploadFile, background_tasks: BackgroundTasks):
    filename = f''{uuid.uuid4()}_{file.filename}''
    # Upload in background so response returns immediately
    background_tasks.add_task(upload_to_s3, file, filename)
    return {''status'': ''Processing'', ''filename'': filename}

async def upload_to_s3(file: UploadFile, filename: str):
    s3.upload_fileobj(file.file, ''bucket'', filename)
```

Background tasks + multipart = production-ready.', 54, 0, N'2026-03-30 14:15:00', N'2026-03-30 15:00:00');
INSERT INTO [discussion_forum_Answers] ([Id], [QuestionId], [UserId], [Body], [Votes], [IsAccepted], [CreatedAt], [UpdatedAt]) VALUES (10, 11, 8, N'Use boto3 Presigned URLs for client-side upload:

```python
@app.post(''/get-upload-url'')
async def get_presigned_url(filename: str):
    s3 = boto3.client(''s3'')
    url = s3.generate_presigned_post(
        ''my-bucket'',
        filename,
        ExpiresIn=3600
    )
    return url
```

Client uploads directly to S3 using the presigned URL. Your API never touches the file. No memory usage on backend.', 78, 0, N'2026-03-30 15:30:00', N'2026-03-30 16:00:00');
INSERT INTO [discussion_forum_Answers] ([Id], [QuestionId], [UserId], [Body], [Votes], [IsAccepted], [CreatedAt], [UpdatedAt]) VALUES (11, 1, 2, N'Use connection pooling and indexing for better performance', 0, 0, N'2026-04-02 09:12:54', N'2026-04-02 09:12:54');
GO
SET IDENTITY_INSERT [discussion_forum_Answers] OFF;
GO

PRINT 'Loading discussion_forum_Comments';
GO
SET IDENTITY_INSERT [discussion_forum_Comments] ON;
GO
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (1, 1, NULL, 1, N'This is exactly what I needed! Do you recommend a specific expiry time for refresh tokens?', 5, N'2026-03-28 13:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (2, 8, NULL, 1, N'@dev_ninja I use 7 days for web, 30 days for mobile. Sliding expiration works too.', 8, N'2026-03-28 13:15:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (3, 5, NULL, 1, N'Also store IP and User-Agent with each refresh token for additional security validation.', 12, N'2026-03-28 15:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (4, 6, NULL, 1, N'What about using Redis with expiry instead of database? Performance implications?', 3, N'2026-03-28 16:30:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (5, 3, NULL, 2, N'Solved! Key was setting onclose to null before close(). Thank you!', 15, N'2026-03-25 19:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (6, 7, NULL, 2, N'Also recommend AbortController pattern for fetch-based fallback.', 7, N'2026-03-26 08:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (7, 8, NULL, 2, N'This approach works perfectly with SockJS as fallback too!', 11, N'2026-03-26 09:15:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (8, 2, NULL, 3, N'HNSW tip alone was worth the bounty. Recall improved from 78% to 94%.', 28, N'2026-03-20 16:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (9, 6, NULL, 3, N'Same setup for multi-tenant SaaS? Concerns with RLS + pgvector?', 9, N'2026-03-21 08:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (10, 4, NULL, 3, N'@data_alchemist Yes, add tenant_id and include in partial indexes. Minimal overhead.', 14, N'2026-03-21 09:30:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (11, 1, NULL, 3, N'What happens when you exceed vector dimensions? Error or silent truncation?', 6, N'2026-03-22 10:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (12, 1, NULL, 4, N'Fixed! Final image is 42MB. Thank you!', 6, N'2026-03-27 17:30:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (13, 3, NULL, 4, N'Clang requirement tripped us up for a week. Docs could be clearer.', 4, N'2026-03-27 18:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (14, 2, 5, NULL, N'Tried react-window? Lighter than react-virtualized for simple tables.', 4, N'2026-03-22 12:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (15, 7, 5, NULL, N'@dev_tools react-virtual is newer and much better. Recommend switching.', 9, N'2026-03-22 13:30:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (16, 5, 6, NULL, N'The streaming tip is gold. Changed our Node.js upload from 400MB to 45MB peak!', 22, N'2026-03-26 12:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (17, 1, 6, NULL, N'Any recommendations for monitoring memory in production?', 3, N'2026-03-26 13:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (18, 3, 7, NULL, N'Using auth0-react now. Much easier than manual PKCE implementation.', 18, N'2026-03-18 14:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (19, 8, 7, NULL, N'Does this work with custom OAuth providers or just Auth0?', 5, N'2026-03-18 15:30:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (20, 4, 10, NULL, N'Amazing project idea. Would love to see progress on GitHub!', 11, N'2026-03-15 20:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (21, 7, 10, NULL, N'Building something similar. Is Yjs production-ready for 1000+ concurrent users?', 8, N'2026-03-16 10:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (22, 1, 10, NULL, N'Database sync strategy with Yjs? How do you persist CRDT state?', 6, N'2026-03-17 08:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (23, 8, 8, NULL, N'This query planner output is beautiful. How often do you ANALYZE?', 7, N'2026-03-24 08:30:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (24, 2, 8, NULL, N'Can you share the JSONB schema optimization you mentioned?', 4, N'2026-03-25 09:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (25, 3, 8, NULL, N'Multi-part upload recommendation is production-grade. Been using this for 6 months.', 14, N'2026-03-30 14:45:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (26, 5, 8, NULL, N'What''s the chunk size you recommend for large files?', 5, N'2026-03-30 15:15:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (27, 6, 8, NULL, N'Does boto3 handle retries automatically or need custom retry logic?', 3, N'2026-03-30 15:45:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (28, 7, 9, NULL, N'Background tasks + multipart solves the timeout issue perfectly!', 9, N'2026-03-30 14:20:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (29, 1, 9, NULL, N'How do you monitor background task failures in production?', 4, N'2026-03-30 14:50:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (30, 2, 10, NULL, N'Presigned URLs are the way. No server-side bottleneck!', 16, N'2026-03-30 16:15:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (31, 4, 10, NULL, N'Security question: Can users modify the presigned URL to upload elsewhere?', 7, N'2026-03-30 16:45:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (32, 8, 10, NULL, N'@security_dev No, the signature prevents tampering. S3 validates the signature server-side.', 10, N'2026-03-30 17:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (33, 1, 12, NULL, N'Our team switched Redux → Zustand last year. Never looked back.', 18, N'2026-03-10 12:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (34, 3, 12, NULL, N'Jotai''s atomic design resonates with Recoil users. Great DX!', 12, N'2026-03-10 13:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (35, 6, 12, NULL, N'Context API + useMemo is underrated. Works for most projects.', 8, N'2026-03-10 14:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (36, 7, 12, NULL, N'TanStack Query changed how we handle server state. Highly recommend.', 15, N'2026-03-10 15:00:00');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (37, 3, NULL, 11, N'Great explanation! Have you considered handling errors with retries?', 0, N'2026-04-21 21:32:38');
INSERT INTO [discussion_forum_Comments] ([Id], [UserId], [QuestionId], [AnswerId], [Body], [Votes], [CreatedAt]) VALUES (38, 3, NULL, 11, N'Great explanation! Have you considered handling errors with retries mechanism?', 0, N'2026-04-21 21:32:51');
GO
SET IDENTITY_INSERT [discussion_forum_Comments] OFF;
GO

PRINT 'Loading discussion_forum_Votes';
GO
SET IDENTITY_INSERT [discussion_forum_Votes] ON;
GO
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (1, 2, N'question', 1, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (2, 3, N'question', 1, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (3, 4, N'question', 1, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (4, 5, N'question', 1, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (5, 1, N'question', 2, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (6, 2, N'question', 2, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (7, 4, N'question', 2, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (8, 1, N'question', 3, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (9, 3, N'question', 3, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (10, 5, N'question', 3, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (11, 1, N'answer', 1, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (12, 2, N'answer', 1, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (13, 3, N'answer', 1, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (14, 1, N'answer', 2, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (15, 4, N'answer', 2, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (16, 5, N'answer', 2, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (17, 7, N'question', 8, -1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Votes] ([Id], [UserId], [TargetType], [TargetId], [Value], [CreatedAt]) VALUES (18, 6, N'answer', 3, 1, N'2026-04-02 08:42:36');
GO
SET IDENTITY_INSERT [discussion_forum_Votes] OFF;
GO

PRINT 'Loading discussion_forum_Media';
GO
SET IDENTITY_INSERT [discussion_forum_Media] ON;
GO
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (1, 1, NULL, N'image', N'https://placehold.co/800x400/1a1a2e/16213e?text=JWT+Token+Flow', N'https://placehold.co/200x100/1a1a2e/16213e?text=JWT', N'JWT refresh token rotation flow', 800, 400, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (2, 2, NULL, N'image', N'https://placehold.co/800x400/1a1a2e/16213e?text=Chrome+Memory+Profiler', N'https://placehold.co/200x100/1a1a2e/16213e?text=Memory', N'Chrome DevTools memory leak', 800, 400, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (3, 3, NULL, N'image', N'https://placehold.co/900x500/0d1117/58a6ff?text=RAG+Architecture', N'https://placehold.co/200x110/0d1117/58a6ff?text=RAG', N'RAG Architecture diagram', 900, 500, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (4, 4, NULL, N'image', N'https://placehold.co/800x300/2d1b1b/ff6b6b?text=CI+Pipeline+Error', N'https://placehold.co/200x75/2d1b1b/ff6b6b?text=CI', N'CI pipeline error log', 800, 300, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (5, 5, NULL, N'video', N'https://www.youtube.com/watch?v=dQw4w9WgXcQ', N'https://placehold.co/320x180/0f0f0f/ffffff?text=Perf+Demo', N'Rendering lag demo', NULL, NULL, N'00:02:34', N'youtube', NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (6, 6, NULL, N'image', N'https://placehold.co/800x450/0d1117/4fc3f7?text=kubectl+describe+pod', N'https://placehold.co/200x112/0d1117/4fc3f7?text=Pod', N'kubectl OOMKilled events', 800, 450, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (7, 6, NULL, N'image', N'https://placehold.co/800x350/1a1a2e/00e676?text=Grafana+Memory', N'https://placehold.co/200x87/1a1a2e/00e676?text=Grafana', N'Grafana memory spike', 800, 350, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (8, 7, NULL, N'image', N'https://placehold.co/900x600/f5f5f0/333333?text=OAuth+PKCE+Flow', N'https://placehold.co/200x133/f5f5f0/333333?text=PKCE', N'OAuth PKCE flow diagram', 900, 600, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (9, 8, NULL, N'image', N'https://placehold.co/900x400/1a1a1a/00ff88?text=EXPLAIN+ANALYZE', N'https://placehold.co/200x88/1a1a1a/00ff88?text=Query', N'EXPLAIN ANALYZE output', 900, 400, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (10, 8, NULL, N'video', N'https://youtu.be/example-pg-debug', N'https://placehold.co/320x180/2d2d2d/ffffff?text=pgAdmin', N'pgAdmin debug walkthrough', NULL, NULL, N'00:04:12', N'youtube', NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (11, 9, NULL, N'image', N'https://placehold.co/800x350/1e1e1e/ff5555?text=Rust+Compiler+Error', N'https://placehold.co/200x87/1e1e1e/ff5555?text=Error', N'Rust lifetime error', 800, 350, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (12, 10, NULL, N'image', N'https://placehold.co/1000x600/0a192f/64ffda?text=Collab+Editor+Arch', N'https://placehold.co/200x120/0a192f/64ffda?text=Arch', N'Collaborative editor architecture', 1000, 600, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (13, 10, NULL, N'video', N'https://vimeo.com/example-collab', N'https://placehold.co/320x180/1a1a2e/ffffff?text=Prototype', N'Editor prototype demo', NULL, NULL, N'00:05:47', N'vimeo', NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (14, 10, NULL, N'image', N'https://placehold.co/800x500/0a192f/e6f1ff?text=Data+Flow', N'https://placehold.co/200x125/0a192f/e6f1ff?text=Flow', N'Client sync data flow', 800, 500, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (15, 11, NULL, N'image', N'https://placehold.co/900x500/2d3436/00b894?text=S3+Upload+Flow', N'https://placehold.co/200x111/2d3436/00b894?text=S3', N'FastAPI S3 upload architecture', 900, 500, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (16, 12, NULL, N'image', N'https://placehold.co/700x400/ffffff/333333?text=State+Mgmt+Poll', N'https://placehold.co/200x114/ffffff/333333?text=Poll', N'State management poll 2026', 700, 400, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (17, NULL, 1, N'image', N'https://placehold.co/800x400/0d1117/58a6ff?text=JWT+Rotation+Secure', N'https://placehold.co/200x100/0d1117/58a6ff?text=JWT', N'Secure JWT rotation diagram', 800, 400, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (18, NULL, 2, N'image', N'https://placehold.co/800x300/0d1117/00e676?text=Fixed+Memory', N'https://placehold.co/200x75/0d1117/00e676?text=Fixed', N'Memory profile after fix', 800, 300, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (19, NULL, 3, N'image', N'https://placehold.co/800x400/0d1117/58a6ff?text=pgvector+Benchmark', N'https://placehold.co/200x100/0d1117/58a6ff?text=Bench', N'pgvector p99 latency benchmark', 800, 400, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (20, NULL, 3, N'image', N'https://placehold.co/900x400/0d1117/ffd700?text=HNSW+Performance', N'https://placehold.co/200x88/0d1117/ffd700?text=HNSW', N'HNSW index performance', 900, 400, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (21, NULL, 4, N'image', N'https://placehold.co/800x350/1a1a2e/ff6b6b?text=Docker+AOT+Build', N'https://placehold.co/200x87/1a1a2e/ff6b6b?text=Build', N'Docker AOT compilation output', 800, 350, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (22, NULL, 5, N'video', N'https://www.youtube.com/watch?v=virtualer', N'https://placehold.co/320x180/1a1a2e/00e5ff?text=React+Virtual', N'React Virtual demo', NULL, NULL, N'00:03:45', N'youtube', NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (23, NULL, 6, N'image', N'https://placehold.co/800x400/1a1a2e/00e676?text=Memory+Streaming', N'https://placehold.co/200x100/1a1a2e/00e676?text=Stream', N'Streaming memory profile', 800, 400, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (24, NULL, 7, N'image', N'https://placehold.co/900x600/0a192f/64ffda?text=CRDT+Yjs+Diagram', N'https://placehold.co/200x133/0a192f/64ffda?text=CRDT', N'CRDT operation flow', 900, 600, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (25, NULL, 8, N'image', N'https://placehold.co/800x400/2d3436/00b894?text=Boto3+Upload', N'https://placehold.co/200x100/2d3436/00b894?text=Boto3', N'Boto3 S3 multipart upload', 800, 400, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (26, NULL, 9, N'image', N'https://placehold.co/800x400/2d3436/00b894?text=Background+Tasks', N'https://placehold.co/200x100/2d3436/00b894?text=BG', N'FastAPI background task flow', 800, 400, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Media] ([Id], [QuestionId], [AnswerId], [Type], [Url], [Thumbnail], [AltText], [Width], [Height], [Duration], [Platform], [FileSize], [MimeType], [CreatedAt]) VALUES (27, NULL, 10, N'image', N'https://placehold.co/900x500/2d3436/00b894?text=Presigned+URL', N'https://placehold.co/200x111/2d3436/00b894?text=PreSign', N'S3 Presigned URL flow', 900, 500, NULL, NULL, NULL, NULL, N'2026-04-02 08:42:36');
GO
SET IDENTITY_INSERT [discussion_forum_Media] OFF;
GO

PRINT 'Loading discussion_forum_Bookmarks';
GO
SET IDENTITY_INSERT [discussion_forum_Bookmarks] ON;
GO
INSERT INTO [discussion_forum_Bookmarks] ([Id], [UserId], [QuestionId], [CreatedAt]) VALUES (1, 1, 3, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Bookmarks] ([Id], [UserId], [QuestionId], [CreatedAt]) VALUES (2, 1, 10, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Bookmarks] ([Id], [UserId], [QuestionId], [CreatedAt]) VALUES (3, 2, 1, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Bookmarks] ([Id], [UserId], [QuestionId], [CreatedAt]) VALUES (4, 3, 7, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Bookmarks] ([Id], [UserId], [QuestionId], [CreatedAt]) VALUES (5, 5, 8, N'2026-04-02 08:42:36');
INSERT INTO [discussion_forum_Bookmarks] ([Id], [UserId], [QuestionId], [CreatedAt]) VALUES (6, 7, 2, N'2026-04-02 08:42:36');
GO
SET IDENTITY_INSERT [discussion_forum_Bookmarks] OFF;
GO

PRINT 'Loading discussion_forum_Notifications';
GO
SET IDENTITY_INSERT [discussion_forum_Notifications] ON;
GO
INSERT INTO [discussion_forum_Notifications] ([Id], [UserId], [Type], [Message], [QuestionId], [AnswerId], [IsRead], [CreatedAt]) VALUES (1, 1, N'answer', N'Alex Rivera answered your question about JWT refresh token rotation', 1, 1, 1, N'2026-03-28 12:30:00');
INSERT INTO [discussion_forum_Notifications] ([Id], [UserId], [Type], [Message], [QuestionId], [AnswerId], [IsRead], [CreatedAt]) VALUES (2, 1, N'comment', N'Priya Sharma commented on an answer to your question', 1, 1, 1, N'2026-03-28 15:00:00');
INSERT INTO [discussion_forum_Notifications] ([Id], [UserId], [Type], [Message], [QuestionId], [AnswerId], [IsRead], [CreatedAt]) VALUES (3, 1, N'vote', N'Your question received 5 new upvotes', 4, NULL, 0, N'2026-03-29 10:00:00');
INSERT INTO [discussion_forum_Notifications] ([Id], [UserId], [Type], [Message], [QuestionId], [AnswerId], [IsRead], [CreatedAt]) VALUES (4, 3, N'badge', N'You earned the ''Popular Question'' gold badge', 10, NULL, 0, N'2026-03-30 06:00:00');
INSERT INTO [discussion_forum_Notifications] ([Id], [UserId], [Type], [Message], [QuestionId], [AnswerId], [IsRead], [CreatedAt]) VALUES (5, 2, N'bounty', N'Your answer was awarded a 250 point bounty', 3, 3, 1, N'2026-03-22 16:00:00');
INSERT INTO [discussion_forum_Notifications] ([Id], [UserId], [Type], [Message], [QuestionId], [AnswerId], [IsRead], [CreatedAt]) VALUES (6, 7, N'mention', N'Arjun Mehta mentioned you in a comment', 5, NULL, 0, N'2026-03-31 14:00:00');
GO
SET IDENTITY_INSERT [discussion_forum_Notifications] OFF;
GO

PRINT 'Loading discussion_forum_LinkedQuestions';
GO
INSERT INTO [discussion_forum_LinkedQuestions] ([QuestionId], [LinkedQuestionId]) VALUES (1, 3);
INSERT INTO [discussion_forum_LinkedQuestions] ([QuestionId], [LinkedQuestionId]) VALUES (1, 8);
INSERT INTO [discussion_forum_LinkedQuestions] ([QuestionId], [LinkedQuestionId]) VALUES (2, 5);
INSERT INTO [discussion_forum_LinkedQuestions] ([QuestionId], [LinkedQuestionId]) VALUES (3, 1);
INSERT INTO [discussion_forum_LinkedQuestions] ([QuestionId], [LinkedQuestionId]) VALUES (3, 10);
INSERT INTO [discussion_forum_LinkedQuestions] ([QuestionId], [LinkedQuestionId]) VALUES (7, 1);
INSERT INTO [discussion_forum_LinkedQuestions] ([QuestionId], [LinkedQuestionId]) VALUES (8, 1);
INSERT INTO [discussion_forum_LinkedQuestions] ([QuestionId], [LinkedQuestionId]) VALUES (8, 3);
INSERT INTO [discussion_forum_LinkedQuestions] ([QuestionId], [LinkedQuestionId]) VALUES (10, 2);
INSERT INTO [discussion_forum_LinkedQuestions] ([QuestionId], [LinkedQuestionId]) VALUES (10, 3);
INSERT INTO [discussion_forum_LinkedQuestions] ([QuestionId], [LinkedQuestionId]) VALUES (12, 2);
INSERT INTO [discussion_forum_LinkedQuestions] ([QuestionId], [LinkedQuestionId]) VALUES (12, 5);
GO

PRINT 'Loading discussion_forum_UserTags';
GO
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (1, 5);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (1, 4);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (1, 3);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (1, 6);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (2, 2);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (2, 10);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (2, 14);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (3, 1);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (3, 12);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (3, 8);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (3, 7);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (4, 13);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (4, 5);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (5, 9);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (5, 11);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (5, 7);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (6, 6);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (6, 16);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (6, 2);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (7, 3);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (7, 1);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (7, 8);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (8, 15);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (8, 19);
INSERT INTO [discussion_forum_UserTags] ([UserId], [TagId]) VALUES (8, 8);
GO

PRINT 'Loading discussion_forum_SearchSuggestions';
GO
SET IDENTITY_INSERT [discussion_forum_SearchSuggestions] ON;
GO
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (1, N'react useEffect cleanup', 15);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (2, N'jwt refresh token rotation', 14);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (3, N'pgvector performance tuning', 13);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (4, N'docker multi-stage build .net', 12);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (5, N'kubernetes crashloopbackoff', 11);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (6, N'oauth 2.0 pkce react', 10);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (7, N'postgresql jsonb indexing', 9);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (8, N'rust async lifetime tokio', 8);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (9, N'collaborative editor crdt', 7);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (10, N'react state management 2026', 6);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (11, N'fastapi file upload s3', 5);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (12, N'websocket memory leak', 4);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (13, N'dotnet aot compilation', 3);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (14, N'kubernetes memory limits', 2);
INSERT INTO [discussion_forum_SearchSuggestions] ([Id], [Term], [Weight]) VALUES (15, N'react virtualization tables', 1);
GO
SET IDENTITY_INSERT [discussion_forum_SearchSuggestions] OFF;
GO

PRINT 'Loading discussion_forum_QuestionViews';
GO
-- No rows for discussion_forum_QuestionViews
GO

COMMIT TRANSACTION;
GO
PRINT 'Data load completed successfully.';
GO
