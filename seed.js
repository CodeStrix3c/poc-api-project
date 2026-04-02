import { getDb, closeDb } from "./db.js";
import { existsSync, unlinkSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, "forum.db");

if (process.argv.includes("--reset") && existsSync(DB_PATH)) {
  unlinkSync(DB_PATH);
  console.log("🗑️  Old database deleted");
}

const db = getDb();

const count = db.prepare("SELECT COUNT(*) AS cnt FROM Users").get();
if (count.cnt > 0) {
  console.log("ℹ️  Data already exists. Use: npm run reset");
  closeDb();
  process.exit(0);
}

console.log("🌱 Seeding database...\n");

// ── USERS ──
const insertUser = db.prepare(`INSERT INTO Users (Username,DisplayName,Email,Avatar,Bio,Reputation,GoldBadges,SilverBadges,BronzeBadges,Location,Website,IsOnline,JoinedAt,LastSeen) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
const users = [
  ["dev_ninja","Arjun Mehta","arjun.mehta@example.com","https://i.pravatar.cc/150?img=11","Full-stack developer | .NET Core | React | Cloud Architecture",15420,5,22,48,"Bangalore, India","https://arjunmehta.dev",1,"2021-03-15 08:30:00","2026-03-31 14:22:00"],
  ["code_queen","Sara Chen","sara.chen@example.com","https://i.pravatar.cc/150?img=5","Python | ML Engineer | Open Source Contributor",28750,12,45,89,"San Francisco, CA","https://sarachen.io",1,"2020-01-10 10:00:00","2026-04-01 09:15:00"],
  ["js_wizard","Liam O'Connor","liam.oconnor@example.com","https://i.pravatar.cc/150?img=12","JavaScript enthusiast | Node.js | TypeScript | DevOps",9870,2,15,33,"Dublin, Ireland","",0,"2022-06-20 14:45:00","2026-03-30 18:00:00"],
  ["rust_ranger","Yuki Tanaka","yuki.tanaka@example.com","https://i.pravatar.cc/150?img=15","Systems programmer | Rust | C++ | Performance optimization",34200,18,67,120,"Tokyo, Japan","https://yukitanaka.dev",1,"2019-11-05 06:20:00","2026-04-01 03:45:00"],
  ["cloud_architect","Priya Sharma","priya.sharma@example.com","https://i.pravatar.cc/150?img=9","AWS Certified Solutions Architect | Kubernetes | Terraform",21300,8,35,72,"Hyderabad, India","https://priyasharma.cloud",0,"2020-08-12 11:30:00","2026-03-31 20:10:00"],
  ["data_alchemist","Marcus Johnson","marcus.j@example.com","https://i.pravatar.cc/150?img=53","Data Engineer | Apache Spark | Kafka | PostgreSQL",11890,3,19,41,"Austin, TX","",0,"2021-09-01 16:00:00","2026-03-29 22:30:00"],
  ["mobile_maven","Fatima Al-Hassan","fatima.alhassan@example.com","https://i.pravatar.cc/150?img=25","React Native | Flutter | iOS & Android Developer",7650,1,11,28,"Dubai, UAE","https://fatima.dev",1,"2023-01-18 09:15:00","2026-04-01 07:00:00"],
  ["security_sentinel","Alex Rivera","alex.rivera@example.com","https://i.pravatar.cc/150?img=33","Cybersecurity | Penetration Testing | OWASP | DevSecOps",18900,7,29,55,"Berlin, Germany","https://alexrivera.sec",0,"2020-04-22 13:00:00","2026-03-31 16:45:00"],
];
db.transaction(() => { for (const u of users) insertUser.run(...u); })();
console.log(`  → ${users.length} users`);

// ── TAGS ──
const insertTag = db.prepare(`INSERT INTO Tags (Name,Description,Color,QuestionsCount) VALUES (?,?,?,?)`);
const tags = [
  ["javascript","ECMAScript and its dialects","#f7df1e",2456],["python","Dynamically typed multi-purpose language","#3776ab",3102],
  ["react","JavaScript library for building UIs","#61dafb",1847],["dotnet","Free cross-platform developer platform","#512bd4",1203],
  ["csharp","Multi-paradigm language by Microsoft","#239120",1567],["postgresql","Open-source relational DBMS","#336791",987],
  ["docker","Container-based app deployment","#2496ed",1456],["typescript","Typed superset of JavaScript","#3178c6",1678],
  ["aws","Amazon Web Services cloud platform","#ff9900",2103],["machine-learning","AI branch focused on learning from data","#ff6f00",1534],
  ["kubernetes","Open-source container orchestration","#326ce5",892],["nodejs","JavaScript runtime on V8 engine","#339933",1345],
  ["rust","Systems programming focused on safety","#dea584",678],["fastapi","Modern Python web framework for APIs","#009688",456],
  ["security","App security, auth, and authorization","#d32f2f",1890],["sql","Structured Query Language for RDBMS","#e38d13",2345],
  ["git","Distributed version control system","#f05032",1123],["css","Cascading Style Sheets","#264de4",1789],
  ["api-design","RESTful and GraphQL API best practices","#7b1fa2",567],["testing","Software testing methodologies","#388e3c",890],
];
db.transaction(() => { for (const t of tags) insertTag.run(...t); })();
console.log(`  → ${tags.length} tags`);

// ── USER TAGS ──
const insertUT = db.prepare(`INSERT OR IGNORE INTO UserTags (UserId,TagId) VALUES (?,?)`);
const utData = [[1,5],[1,4],[1,3],[1,6],[2,2],[2,10],[2,14],[3,1],[3,12],[3,8],[3,7],[4,13],[4,5],[5,9],[5,11],[5,7],[6,6],[6,16],[6,2],[7,3],[7,1],[7,8],[8,15],[8,19],[8,8]];
db.transaction(() => { for (const [u,t] of utData) insertUT.run(u,t); })();
console.log(`  → user-tag links`);

// ── QUESTIONS ──
const insertQ = db.prepare(`INSERT INTO Questions (Title,Body,UserId,Votes,Views,AnswersCount,Status,IsBounty,BountyAmount,Favorites,IsProtected,CreatedAt,UpdatedAt,LastActivityAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
const insertQT = db.prepare(`INSERT INTO QuestionTags (QuestionId,TagId) VALUES (?,?)`);

const questions = [
  { t:"How to implement JWT refresh token rotation in .NET Core Web API?", b:"I'm building a .NET Core 8 Web API and need secure JWT auth with refresh token rotation.\n\n```csharp\npublic class AuthService {\n    public string GenerateAccessToken(User user) {\n        var claims = new[] {\n            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),\n            new Claim(ClaimTypes.Email, user.Email)\n        };\n    }\n}\n```\n\nBest practices for: 1) Storing refresh tokens (DB vs Redis?) 2) Implementing rotation safely 3) Handling concurrent requests", u:1, v:47, vi:1823, a:4, s:"answered", ib:0, ba:0, f:23, p:0, c:"2026-03-28 10:15:00", up:"2026-03-29 08:30:00", la:"2026-03-30 14:20:00", tags:[4,5,15,19] },
  { t:"React useEffect cleanup causing memory leak in WebSocket connection", b:"Memory leak in React when using WebSocket inside useEffect.\n\n```jsx\nuseEffect(() => {\n  const ws = new WebSocket('wss://api.example.com/live');\n  ws.onmessage = (event) => {\n    setMessages(prev => [...prev, JSON.parse(event.data)]);\n  };\n  return () => { ws.close(); };\n}, []);\n```\n\nIssue gets worse with rapid page navigation.", u:3, v:89, vi:4521, a:6, s:"answered", ib:1, ba:100, f:56, p:1, c:"2026-03-25 16:45:00", up:"2026-03-26 09:00:00", la:"2026-03-31 11:15:00", tags:[3,1,8] },
  { t:"Best approach for implementing RAG with pgvector in PostgreSQL?", b:"Building a RAG pipeline with pgvector.\n\n```sql\nCREATE EXTENSION IF NOT EXISTS vector;\nCREATE TABLE document_embeddings (\n    id SERIAL PRIMARY KEY,\n    document_id UUID NOT NULL,\n    chunk_text TEXT NOT NULL,\n    embedding vector(1536),\n    metadata JSONB DEFAULT '{}'\n);\n```\n\n1) Table structure for similarity search? 2) Best embedding model for tech docs? 3) Chunking strategy? 4) Production-ready at 500K docs?", u:2, v:134, vi:8920, a:8, s:"answered", ib:1, ba:250, f:89, p:1, c:"2026-03-20 08:00:00", up:"2026-03-22 14:30:00", la:"2026-04-01 06:00:00", tags:[6,2,10,14] },
  { t:"Docker multi-stage build failing with .NET 8 AOT compilation", b:"Multi-stage Docker build with Native AOT fails in CI.\n\n```dockerfile\nFROM mcr.microsoft.com/dotnet/sdk:8.0 AS build\nRUN dotnet publish -c Release -r linux-x64 /p:PublishAot=true -o /app\nFROM mcr.microsoft.com/dotnet/runtime-deps:8.0-jammy-chiseled\nCOPY --from=build /app .\n```\n\nError: `lld-link: error: undefined symbol: __security_cookie`", u:1, v:32, vi:2145, a:3, s:"answered", ib:0, ba:0, f:15, p:0, c:"2026-03-27 14:20:00", up:"2026-03-27 14:20:00", la:"2026-03-29 10:00:00", tags:[7,4,5] },
  { t:"Optimizing React rendering performance with large data tables (10k+ rows)", b:"Data dashboard with 10,000+ rows. Basic map() rendering makes page unresponsive.\n\n```tsx\nconst filtered = useMemo(() =>\n  data.filter(row => Object.values(row).some(v =>\n    String(v).toLowerCase().includes(filter)))\n  .sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1),\n  [data, filter, sortBy]\n);\n```\n\nShould I use virtualization? Which library for React 19?", u:7, v:67, vi:5678, a:7, s:"open", ib:1, ba:150, f:41, p:0, c:"2026-03-22 11:30:00", up:"2026-03-24 16:00:00", la:"2026-03-31 20:45:00", tags:[3,1,8,18] },
  { t:"Kubernetes pod keeps restarting - CrashLoopBackOff with exit code 137", b:"Deployment crashes with CrashLoopBackOff. Pod runs ~30s before OOMKilled (exit code 137).\n\n```yaml\nresources:\n  requests: { memory: '256Mi', cpu: '250m' }\n  limits: { memory: '512Mi', cpu: '500m' }\n```\n\nNode.js Express API. Memory spikes during JSON parsing of large payloads.", u:5, v:56, vi:3456, a:5, s:"answered", ib:0, ba:0, f:28, p:0, c:"2026-03-26 09:00:00", up:"2026-03-26 09:00:00", la:"2026-03-30 16:30:00", tags:[11,7,12,9] },
  { t:"How to properly set up OAuth 2.0 PKCE flow for a React SPA?", b:"Need OAuth 2.0 with PKCE for React SPA.\n\n```typescript\nconst generateCodeVerifier = (): string => {\n  const array = new Uint8Array(32);\n  crypto.getRandomValues(array);\n  return base64UrlEncode(array);\n};\n```\n\n1) Generate code_verifier every login? 2) Where to store it? 3) Handle callback URL in SPA? 4) oidc-client-ts or @auth0/auth0-react?", u:8, v:78, vi:6789, a:5, s:"answered", ib:0, ba:0, f:67, p:1, c:"2026-03-18 13:00:00", up:"2026-03-19 10:00:00", la:"2026-03-28 09:15:00", tags:[3,15,8,19] },
  { t:"PostgreSQL JSONB query performance degradation after 1M records", b:"PostgreSQL 16 with JSONB columns. 1.2M records = 3-5s queries.\n\n```sql\nSELECT u.id, p.data->>'firstName'\nFROM users u JOIN user_profiles p ON u.id = p.user_id\nWHERE p.data @> '{\"preferences\": {\"theme\": \"dark\"}}'\nORDER BY u.created_at DESC LIMIT 50;\n```\n\nWhat indexing strategy for complex JSONB at scale?", u:6, v:45, vi:3210, a:4, s:"answered", ib:0, ba:0, f:34, p:0, c:"2026-03-24 07:30:00", up:"2026-03-25 11:00:00", la:"2026-03-29 15:00:00", tags:[6,16,4] },
  { t:"Rust lifetime errors when building an async web scraper with Tokio", b:"Async web scraper in Rust with Tokio. Lifetime issues with shared state.\n\n```rust\nimpl Scraper {\n    async fn scrape_all(&self, urls: Vec<String>) {\n        for url in urls {\n            tokio::spawn(async move {\n                self.scrape_url(&url).await // ERROR: self does not live long enough\n            });\n        }\n    }\n}\n```", u:4, v:38, vi:1876, a:3, s:"open", ib:0, ba:0, f:19, p:0, c:"2026-03-29 05:00:00", up:"2026-03-29 05:00:00", la:"2026-03-31 12:00:00", tags:[13,19,20] },
  { t:"Building a real-time collaborative code editor - architecture advice needed", b:"Want to build collaborative code editor (like VS Code Live Share).\n\nStack: React + Monaco Editor, Node.js + WebSocket, CRDT (Yjs) or OT (ShareDB), PostgreSQL + Redis.\n\n1) CRDT vs OT? 2) Multiple user cursors? 3) Conflict resolution? 4) WebSocket or WebRTC?", u:3, v:156, vi:12340, a:12, s:"answered", ib:1, ba:500, f:134, p:1, c:"2026-03-15 18:00:00", up:"2026-03-20 09:30:00", la:"2026-04-01 08:00:00", tags:[1,3,12,19] },
  { t:"What's the recommended way to handle file uploads in FastAPI with S3?", b:"Multipart file uploads in FastAPI → S3. Files up to 100MB.\n\n```python\n@app.post('/upload')\nasync def upload_file(file: UploadFile = File(...)):\n    contents = await file.read()  # Loads entire file in memory!\n    s3.put_object(Bucket='my-bucket', Key=f'uploads/{file.filename}', Body=contents)\n```\n\nProduction-ready approach for large files?", u:2, v:29, vi:1567, a:3, s:"open", ib:0, ba:0, f:12, p:0, c:"2026-03-30 12:00:00", up:"2026-03-30 12:00:00", la:"2026-03-31 18:30:00", tags:[2,14,9] },
  { t:"[Discussion] What's your preferred state management in React 2026?", b:"React 19 stable + Server Components. What state management in 2026?\n\n- Zustand — Simple, lightweight\n- Jotai — Atomic, fine-grained\n- Redux Toolkit — Robust but heavy\n- TanStack Query — Server state\n- React Context — Built-in but re-renders\n- Signals\n\nWhat's your team using and why?", u:7, v:203, vi:15670, a:24, s:"discussion", ib:0, ba:0, f:178, p:1, c:"2026-03-10 10:00:00", up:"2026-03-10 10:00:00", la:"2026-04-01 10:00:00", tags:[3,1,8] },
];

db.transaction(() => {
  for (const q of questions) {
    const info = insertQ.run(q.t,q.b,q.u,q.v,q.vi,q.a,q.s,q.ib,q.ba,q.f,q.p,q.c,q.up,q.la);
    for (const tid of q.tags) insertQT.run(info.lastInsertRowid, tid);
  }
})();
console.log(`  → ${questions.length} questions`);

// ── MEDIA (questions only, inserted before answers) ──
const insertMedia = db.prepare(`INSERT INTO Media (QuestionId,AnswerId,Type,Url,Thumbnail,AltText,Width,Height,Duration,Platform) VALUES (?,?,?,?,?,?,?,?,?,?)`);
const questionMediaItems = [
  [1,null,"image","https://placehold.co/800x400/1a1a2e/16213e?text=JWT+Token+Flow","https://placehold.co/200x100/1a1a2e/16213e?text=JWT","JWT refresh token rotation flow",800,400,null,null],
  [2,null,"image","https://placehold.co/800x400/1a1a2e/16213e?text=Chrome+Memory+Profiler","https://placehold.co/200x100/1a1a2e/16213e?text=Memory","Chrome DevTools memory leak",800,400,null,null],
  [3,null,"image","https://placehold.co/900x500/0d1117/58a6ff?text=RAG+Architecture","https://placehold.co/200x110/0d1117/58a6ff?text=RAG","RAG Architecture diagram",900,500,null,null],
  [4,null,"image","https://placehold.co/800x300/2d1b1b/ff6b6b?text=CI+Pipeline+Error","https://placehold.co/200x75/2d1b1b/ff6b6b?text=CI","CI pipeline error log",800,300,null,null],
  [5,null,"video","https://www.youtube.com/watch?v=dQw4w9WgXcQ","https://placehold.co/320x180/0f0f0f/ffffff?text=Perf+Demo","Rendering lag demo",null,null,"00:02:34","youtube"],
  [6,null,"image","https://placehold.co/800x450/0d1117/4fc3f7?text=kubectl+describe+pod","https://placehold.co/200x112/0d1117/4fc3f7?text=Pod","kubectl OOMKilled events",800,450,null,null],
  [6,null,"image","https://placehold.co/800x350/1a1a2e/00e676?text=Grafana+Memory","https://placehold.co/200x87/1a1a2e/00e676?text=Grafana","Grafana memory spike",800,350,null,null],
  [7,null,"image","https://placehold.co/900x600/f5f5f0/333333?text=OAuth+PKCE+Flow","https://placehold.co/200x133/f5f5f0/333333?text=PKCE","OAuth PKCE flow diagram",900,600,null,null],
  [8,null,"image","https://placehold.co/900x400/1a1a1a/00ff88?text=EXPLAIN+ANALYZE","https://placehold.co/200x88/1a1a1a/00ff88?text=Query","EXPLAIN ANALYZE output",900,400,null,null],
  [8,null,"video","https://youtu.be/example-pg-debug","https://placehold.co/320x180/2d2d2d/ffffff?text=pgAdmin","pgAdmin debug walkthrough",null,null,"00:04:12","youtube"],
  [9,null,"image","https://placehold.co/800x350/1e1e1e/ff5555?text=Rust+Compiler+Error","https://placehold.co/200x87/1e1e1e/ff5555?text=Error","Rust lifetime error",800,350,null,null],
  [10,null,"image","https://placehold.co/1000x600/0a192f/64ffda?text=Collab+Editor+Arch","https://placehold.co/200x120/0a192f/64ffda?text=Arch","Collaborative editor architecture",1000,600,null,null],
  [10,null,"video","https://vimeo.com/example-collab","https://placehold.co/320x180/1a1a2e/ffffff?text=Prototype","Editor prototype demo",null,null,"00:05:47","vimeo"],
  [10,null,"image","https://placehold.co/800x500/0a192f/e6f1ff?text=Data+Flow","https://placehold.co/200x125/0a192f/e6f1ff?text=Flow","Client sync data flow",800,500,null,null],
  [11,null,"image","https://placehold.co/900x500/2d3436/00b894?text=S3+Upload+Flow","https://placehold.co/200x111/2d3436/00b894?text=S3","FastAPI S3 upload architecture",900,500,null,null],
  [12,null,"image","https://placehold.co/700x400/ffffff/333333?text=State+Mgmt+Poll","https://placehold.co/200x114/ffffff/333333?text=Poll","State management poll 2026",700,400,null,null],
];
db.transaction(() => { for (const m of questionMediaItems) insertMedia.run(...m); })();
console.log(`  → ${questionMediaItems.length} media items`);

// ── ANSWERS ──
const insertA = db.prepare(`INSERT INTO Answers (QuestionId,UserId,Body,Votes,IsAccepted,CreatedAt,UpdatedAt) VALUES (?,?,?,?,?,?,?)`);
const answers = [
  [1,8,"Production-ready JWT refresh token rotation:\n\n```csharp\npublic async Task<TokenPair> RotateRefreshToken(string oldToken) {\n    var stored = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == oldToken);\n    if (stored == null) throw new SecurityTokenException(\"Invalid\");\n    if (stored.IsUsed) {\n        await InvalidateTokenFamily(stored.FamilyId);\n        throw new SecurityTokenException(\"Token reuse detected\");\n    }\n    stored.IsUsed = true;\n    var newToken = GenerateRefreshToken(stored.FamilyId);\n    _context.RefreshTokens.Add(newToken);\n    await _context.SaveChangesAsync();\n    return new TokenPair(GenerateAccessToken(stored.UserId), newToken.Token);\n}\n```\n\nUse optimistic concurrency with a version column for concurrent requests.",52,1,"2026-03-28 12:30:00","2026-03-28 14:00:00"],
  [2,2,"The fix: ws.close() is async and your component might re-mount before it completes.\n\n```tsx\nuseEffect(() => {\n  mountedRef.current = true;\n  const ws = new WebSocket(url);\n  ws.onmessage = (e) => { if (!mountedRef.current) return; };\n  return () => {\n    mountedRef.current = false;\n    ws.onclose = null; // KEY: prevents reconnection loops\n    ws.close(1000, 'Unmounting');\n  };\n}, [url]);\n```",95,1,"2026-03-25 18:30:00","2026-03-26 10:00:00"],
  [3,4,"Running pgvector with ~800K docs in production. Use HNSW:\n\n```sql\nCREATE INDEX idx_chunks_embedding ON document_chunks\n    USING hnsw (embedding vector_cosine_ops)\n    WITH (m = 16, ef_construction = 64);\n```\n\nEmbedding: text-embedding-3-large (1536 dims) or nomic-embed-text (open-source).\npgvector is production-ready at 500K. Set maintenance_work_mem = '2GB'.",142,1,"2026-03-20 14:00:00","2026-03-22 16:00:00"],
  [4,5,"The __security_cookie error = AOT needs clang in the build container.\n\n```dockerfile\nFROM mcr.microsoft.com/dotnet/sdk:8.0 AS build\nRUN apt-get update && apt-get install -y clang zlib1g-dev\nRUN dotnet publish -c Release -r linux-x64 /p:PublishAot=true /p:StripSymbols=true -o /app\n```\n\nFinal image ~30-50MB with chiseled base.",38,1,"2026-03-27 16:00:00","2026-03-27 16:00:00"],
  [5,4,"Use @tanstack/react-virtual:\n\n```tsx\nconst virtualizer = useVirtualizer({\n  count: data.length,\n  getScrollElement: () => parentRef.current,\n  estimateSize: () => 48,\n  overscan: 20,\n});\n```\n\nRenders only visible rows. Went from 3s to <16ms on 50K rows.",71,0,"2026-03-22 14:00:00","2026-03-23 09:00:00"],
  [6,3,"Exit code 137 = OOMKilled. Fix:\n\n```yaml\nlimits:\n  memory: '1Gi'\n```\n\nUse streaming for large JSON:\n```javascript\nreq.pipe(JSONStream.parse('*')).on('data', processChunk);\n```\n\nAlso set --max-old-space-size in container CMD.",44,1,"2026-03-26 11:00:00","2026-03-26 11:00:00"],
  [10,4,"Built something similar. Go with CRDT (Yjs):\n\n1. Conflict-free by design\n2. y-monaco bindings for Monaco Editor\n3. Works offline, syncs on reconnect\n\nUse Yjs awareness protocol for cursors. WebSocket over WebRTC — NAT traversal is painful.",89,1,"2026-03-16 09:00:00","2026-03-18 14:00:00"],
  [11,1,"Use boto3 with multipart upload for streaming:\n\n```python\nimport boto3\nfrom fastapi import UploadFile\n\n@app.post('/upload')\nasync def upload_file(file: UploadFile):\n    s3 = boto3.client('s3')\n    with file.file as f:\n        s3.upload_fileobj(f, 'my-bucket', file.filename)\n    return {'url': f'https://my-bucket.s3.amazonaws.com/{file.filename}'}\n```\n\nStreams directly to S3 without loading in memory. For 100MB+ files, use multipart upload.",67,1,"2026-03-30 13:45:00","2026-03-30 14:30:00"],
  [11,6,"Consider using python-multipart with streaming, not file.read():\n\n```python\nfrom fastapi import BackgroundTasks\n\n@app.post('/upload')\nasync def upload_file(file: UploadFile, background_tasks: BackgroundTasks):\n    filename = f'{uuid.uuid4()}_{file.filename}'\n    # Upload in background so response returns immediately\n    background_tasks.add_task(upload_to_s3, file, filename)\n    return {'status': 'Processing', 'filename': filename}\n\nasync def upload_to_s3(file: UploadFile, filename: str):\n    s3.upload_fileobj(file.file, 'bucket', filename)\n```\n\nBackground tasks + multipart = production-ready.",54,0,"2026-03-30 14:15:00","2026-03-30 15:00:00"],
  [11,8,"Use boto3 Presigned URLs for client-side upload:\n\n```python\n@app.post('/get-upload-url')\nasync def get_presigned_url(filename: str):\n    s3 = boto3.client('s3')\n    url = s3.generate_presigned_post(\n        'my-bucket',\n        filename,\n        ExpiresIn=3600\n    )\n    return url\n```\n\nClient uploads directly to S3 using the presigned URL. Your API never touches the file. No memory usage on backend.",78,0,"2026-03-30 15:30:00","2026-03-30 16:00:00"],
];


db.transaction(() => {
  for (const a of answers) {
    const info = insertA.run(...a);
    if (a[4] === 1) db.prepare(`UPDATE Questions SET AcceptedAnswerId = ? WHERE Id = ?`).run(info.lastInsertRowid, a[0]);
  }
})();
console.log(`  → ${answers.length} answers`);

// ── ANSWER MEDIA ──
const answerMediaItems = [
  [null,1,"image","https://placehold.co/800x400/0d1117/58a6ff?text=JWT+Rotation+Secure","https://placehold.co/200x100/0d1117/58a6ff?text=JWT","Secure JWT rotation diagram",800,400,null,null],
  [null,2,"image","https://placehold.co/800x300/0d1117/00e676?text=Fixed+Memory","https://placehold.co/200x75/0d1117/00e676?text=Fixed","Memory profile after fix",800,300,null,null],
  [null,3,"image","https://placehold.co/800x400/0d1117/58a6ff?text=pgvector+Benchmark","https://placehold.co/200x100/0d1117/58a6ff?text=Bench","pgvector p99 latency benchmark",800,400,null,null],
  [null,3,"image","https://placehold.co/900x400/0d1117/ffd700?text=HNSW+Performance","https://placehold.co/200x88/0d1117/ffd700?text=HNSW","HNSW index performance",900,400,null,null],
  [null,4,"image","https://placehold.co/800x350/1a1a2e/ff6b6b?text=Docker+AOT+Build","https://placehold.co/200x87/1a1a2e/ff6b6b?text=Build","Docker AOT compilation output",800,350,null,null],
  [null,5,"video","https://www.youtube.com/watch?v=virtualer","https://placehold.co/320x180/1a1a2e/00e5ff?text=React+Virtual","React Virtual demo",null,null,"00:03:45","youtube"],
  [null,6,"image","https://placehold.co/800x400/1a1a2e/00e676?text=Memory+Streaming","https://placehold.co/200x100/1a1a2e/00e676?text=Stream","Streaming memory profile",800,400,null,null],
  [null,7,"image","https://placehold.co/900x600/0a192f/64ffda?text=CRDT+Yjs+Diagram","https://placehold.co/200x133/0a192f/64ffda?text=CRDT","CRDT operation flow",900,600,null,null],
  [null,8,"image","https://placehold.co/800x400/2d3436/00b894?text=Boto3+Upload","https://placehold.co/200x100/2d3436/00b894?text=Boto3","Boto3 S3 multipart upload",800,400,null,null],
  [null,9,"image","https://placehold.co/800x400/2d3436/00b894?text=Background+Tasks","https://placehold.co/200x100/2d3436/00b894?text=BG","FastAPI background task flow",800,400,null,null],
  [null,10,"image","https://placehold.co/900x500/2d3436/00b894?text=Presigned+URL","https://placehold.co/200x111/2d3436/00b894?text=PreSign","S3 Presigned URL flow",900,500,null,null],
];
db.transaction(() => { for (const m of answerMediaItems) insertMedia.run(...m); })();

// ── COMMENTS ──
const insertC = db.prepare(`INSERT INTO Comments (UserId,QuestionId,AnswerId,Body,Votes,CreatedAt) VALUES (?,?,?,?,?,?)`);
const comments = [
  // Answer 1 comments (JWT)
  [1,null,1,"This is exactly what I needed! Do you recommend a specific expiry time for refresh tokens?",5,"2026-03-28 13:00:00"],
  [8,null,1,"@dev_ninja I use 7 days for web, 30 days for mobile. Sliding expiration works too.",8,"2026-03-28 13:15:00"],
  [5,null,1,"Also store IP and User-Agent with each refresh token for additional security validation.",12,"2026-03-28 15:00:00"],
  [6,null,1,"What about using Redis with expiry instead of database? Performance implications?",3,"2026-03-28 16:30:00"],
  // Answer 2 comments (WebSocket)
  [3,null,2,"Solved! Key was setting onclose to null before close(). Thank you!",15,"2026-03-25 19:00:00"],
  [7,null,2,"Also recommend AbortController pattern for fetch-based fallback.",7,"2026-03-26 08:00:00"],
  [8,null,2,"This approach works perfectly with SockJS as fallback too!",11,"2026-03-26 09:15:00"],
  // Answer 3 comments (pgvector)
  [2,null,3,"HNSW tip alone was worth the bounty. Recall improved from 78% to 94%.",28,"2026-03-20 16:00:00"],
  [6,null,3,"Same setup for multi-tenant SaaS? Concerns with RLS + pgvector?",9,"2026-03-21 08:00:00"],
  [4,null,3,"@data_alchemist Yes, add tenant_id and include in partial indexes. Minimal overhead.",14,"2026-03-21 09:30:00"],
  [1,null,3,"What happens when you exceed vector dimensions? Error or silent truncation?",6,"2026-03-22 10:00:00"],
  // Answer 4 comments (Docker AOT)
  [1,null,4,"Fixed! Final image is 42MB. Thank you!",6,"2026-03-27 17:30:00"],
  [3,null,4,"Clang requirement tripped us up for a week. Docs could be clearer.",4,"2026-03-27 18:00:00"],
  // Answer 5 comments (React virtualization)
  [2,5,null,"Tried react-window? Lighter than react-virtualized for simple tables.",4,"2026-03-22 12:00:00"],
  [7,5,null,"@dev_tools react-virtual is newer and much better. Recommend switching.",9,"2026-03-22 13:30:00"],
  // Answer 6 comments (K8s OOMKilled)
  [5,6,null,"The streaming tip is gold. Changed our Node.js upload from 400MB to 45MB peak!",22,"2026-03-26 12:00:00"],
  [1,6,null,"Any recommendations for monitoring memory in production?",3,"2026-03-26 13:00:00"],
  // Answer 7 comments (OAuth PKCE)
  [3,7,null,"Using auth0-react now. Much easier than manual PKCE implementation.",18,"2026-03-18 14:00:00"],
  [8,7,null,"Does this work with custom OAuth providers or just Auth0?",5,"2026-03-18 15:30:00"],
  // Answer 10 comments (Collaborative Editor - CRDT)
  [4,10,null,"Amazing project idea. Would love to see progress on GitHub!",11,"2026-03-15 20:00:00"],
  [7,10,null,"Building something similar. Is Yjs production-ready for 1000+ concurrent users?",8,"2026-03-16 10:00:00"],
  [1,10,null,"Database sync strategy with Yjs? How do you persist CRDT state?",6,"2026-03-17 08:00:00"],
  // Answer 8 comments (pgvector for S3)
  [8,8,null,"This query planner output is beautiful. How often do you ANALYZE?",7,"2026-03-24 08:30:00"],
  [2,8,null,"Can you share the JSONB schema optimization you mentioned?",4,"2026-03-25 09:00:00"],
  // Answer 11 comments (FastAPI boto3)
  [3,8,null,"Multi-part upload recommendation is production-grade. Been using this for 6 months.",14,"2026-03-30 14:45:00"],
  [5,8,null,"What's the chunk size you recommend for large files?",5,"2026-03-30 15:15:00"],
  [6,8,null,"Does boto3 handle retries automatically or need custom retry logic?",3,"2026-03-30 15:45:00"],
  // Answer 9 comments (FastAPI background tasks)
  [7,9,null,"Background tasks + multipart solves the timeout issue perfectly!",9,"2026-03-30 14:20:00"],
  [1,9,null,"How do you monitor background task failures in production?",4,"2026-03-30 14:50:00"],
  // Answer 10 comments (Presigned URLs)
  [2,10,null,"Presigned URLs are the way. No server-side bottleneck!",16,"2026-03-30 16:15:00"],
  [4,10,null,"Security question: Can users modify the presigned URL to upload elsewhere?",7,"2026-03-30 16:45:00"],
  [8,10,null,"@security_dev No, the signature prevents tampering. S3 validates the signature server-side.",10,"2026-03-30 17:00:00"],
  // Answer 12 comments (State management poll)
  [1,12,null,"Our team switched Redux → Zustand last year. Never looked back.",18,"2026-03-10 12:00:00"],
  [3,12,null,"Jotai's atomic design resonates with Recoil users. Great DX!",12,"2026-03-10 13:00:00"],
  [6,12,null,"Context API + useMemo is underrated. Works for most projects.",8,"2026-03-10 14:00:00"],
  [7,12,null,"TanStack Query changed how we handle server state. Highly recommend.",15,"2026-03-10 15:00:00"],
];
db.transaction(() => { for (const c of comments) insertC.run(...c); })();
console.log(`  → ${comments.length} comments`);

// ── VOTES, BOOKMARKS, NOTIFICATIONS, LINKS, SEARCH ──
const insertV = db.prepare(`INSERT INTO Votes (UserId,TargetType,TargetId,Value) VALUES (?,?,?,?)`);
const voteRows = [[2,"question",1,1],[3,"question",1,1],[4,"question",1,1],[5,"question",1,1],[1,"question",2,1],[2,"question",2,1],[4,"question",2,1],[1,"question",3,1],[3,"question",3,1],[5,"question",3,1],[1,"answer",1,1],[2,"answer",1,1],[3,"answer",1,1],[1,"answer",2,1],[4,"answer",2,1],[5,"answer",2,1],[7,"question",8,-1],[6,"answer",3,1]];
db.transaction(() => { for (const v of voteRows) insertV.run(...v); })();
console.log(`  → ${voteRows.length} votes`);

const insertB = db.prepare(`INSERT INTO Bookmarks (UserId,QuestionId) VALUES (?,?)`);
db.transaction(() => { for (const [u,q] of [[1,3],[1,10],[2,1],[3,7],[5,8],[7,2]]) insertB.run(u,q); })();
console.log(`  → 6 bookmarks`);

const insertN = db.prepare(`INSERT INTO Notifications (UserId,Type,Message,QuestionId,AnswerId,IsRead,CreatedAt) VALUES (?,?,?,?,?,?,?)`);
const notifs = [
  [1,"answer","Alex Rivera answered your question about JWT refresh token rotation",1,1,1,"2026-03-28 12:30:00"],
  [1,"comment","Priya Sharma commented on an answer to your question",1,1,1,"2026-03-28 15:00:00"],
  [1,"vote","Your question received 5 new upvotes",4,null,0,"2026-03-29 10:00:00"],
  [3,"badge","You earned the 'Popular Question' gold badge",10,null,0,"2026-03-30 06:00:00"],
  [2,"bounty","Your answer was awarded a 250 point bounty",3,3,1,"2026-03-22 16:00:00"],
  [7,"mention","Arjun Mehta mentioned you in a comment",5,null,0,"2026-03-31 14:00:00"],
];
db.transaction(() => { for (const n of notifs) insertN.run(...n); })();
console.log(`  → ${notifs.length} notifications`);

const insertLQ = db.prepare(`INSERT INTO LinkedQuestions (QuestionId,LinkedQuestionId) VALUES (?,?)`);
db.transaction(() => { for (const [a,b] of [[1,3],[1,8],[2,5],[3,1],[3,10],[7,1],[8,1],[8,3],[10,2],[10,3],[12,2],[12,5]]) insertLQ.run(a,b); })();
console.log(`  → 12 linked questions`);

const insertS = db.prepare(`INSERT INTO SearchSuggestions (Term,Weight) VALUES (?,?)`);
const suggestions = ["react useEffect cleanup","jwt refresh token rotation","pgvector performance tuning","docker multi-stage build .net","kubernetes crashloopbackoff","oauth 2.0 pkce react","postgresql jsonb indexing","rust async lifetime tokio","collaborative editor crdt","react state management 2026","fastapi file upload s3","websocket memory leak","dotnet aot compilation","kubernetes memory limits","react virtualization tables"];
db.transaction(() => { suggestions.forEach((s,i) => insertS.run(s, suggestions.length-i)); })();
console.log(`  → ${suggestions.length} search suggestions`);

console.log("\n✅ Seed complete! Database file: forum.db\n");
closeDb();
