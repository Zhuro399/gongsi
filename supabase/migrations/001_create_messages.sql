-- 联系表单消息表
CREATE TABLE messages (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 开启 Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户插入（联系表单提交）
CREATE POLICY "allow_public_insert" ON messages
  FOR INSERT TO anon WITH CHECK (true);
