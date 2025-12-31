-- Disable RLS for MVP (simplest)
alter table "Challenge" disable row level security;
alter table "Question" disable row level security;
alter table "DatasetUrl" disable row level security;
alter table "SubmissionSession" disable row level security;
alter table "Answer" disable row level security;

-- If you want RLS enabled later, use policies like below:
-- alter table "Challenge" enable row level security;
-- create policy "Challenge read" on "Challenge" for select using (true);
-- create policy "Challenge write" on "Challenge" for all using (true) with check (true);
