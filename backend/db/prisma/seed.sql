TRUNCATE TABLE "Comment", "Post", "User" RESTART IDENTITY CASCADE;

INSERT INTO "User" (id, username, name, password) VALUES
  ('11111111-1111-4111-8111-111111111111', 'demo@gmail.com', 'Demo check', 'demo000'),
  ('22222222-2222-4222-8222-222222222222', 'reshme@reshme.com', 'Reshme Yadav', 'Reshme@123'),
  ('33333333-3333-4333-8333-333333333333', 'anika@papertrail.dev', 'Anika Rao', 'Anika#2026'),
  ('44444444-4444-4444-8444-444444444444', 'samir@cratecloud.dev', 'Samir Khan', 'Samir!2026'),
  ('55555555-5555-4555-8555-555555555555', 'lina@typefoundry.dev', 'Lina Bose', 'Lina@12345');

INSERT INTO "Post" (id, title, content, published, "authorId") VALUES
  (
    1,
    'Check Check From Endpoints',
    $$A quick smoke test from the API side: check check from endpoints.$$, 
    true,
    '11111111-1111-4111-8111-111111111111'
  ),
  (
    2,
    'Check Check From Frontend UI',
    $$This one is for the UI path. check check from frontend UI..$$, 
    true,
    '11111111-1111-4111-8111-111111111111'
  ),
  (
    3,
    'Tiny Endpoints, Big Confidence',
    $$The fastest way to trust a new deployment is to create a few posts, fetch them back, and compare the rendered list with what the database says. That is the whole story here: short, boring, and valuable.$$, 
    true,
    '11111111-1111-4111-8111-111111111111'
  ),
  (
    4,
    'Trying to check',
    $$Reshme Yadav's Working or not, not working.$$, 
    true,
    '22222222-2222-4222-8222-222222222222'
  ),
  (
    5,
    'Frontend Review, Then One More Pass',
    $$The second pass usually catches the small problems that slip through first glance: spacing, truncation, and whether the card still reads well once the title gets longer than expected.$$, 
    true,
    '22222222-2222-4222-8222-222222222222'
  ),
  (
    6,
    'Why Small Systems Still Need Careful Names',
    $$Anika's note is a reminder that even a tiny content demo benefits from consistent names, stable identifiers, and a predictable ownership model. It is not glamorous, but it keeps everything readable.$$, 
    true,
    '33333333-3333-4333-8333-333333333333'
  ),
  (
    7,
    'A Minimalist Checklist for Blog Seeds',
    $$Create the user, attach the post, render the author, and stop there. Good demo data does not need to pretend it is production; it just needs to be believable enough to exercise the paths people actually click.$$, 
    true,
    '33333333-3333-4333-8333-333333333333'
  ),
  (
    8,
    'Rate Limiting Is the Quiet Contract Behind Reliability',
    $$When the traffic spike started, it looked at first like a normal burst. Then the retries multiplied, the connection pool stayed busy, and the database began answering the same request over and over until the queue stopped draining. The lesson was simple: rate limiting is not about punishing users, it is about protecting the shared system from becoming a single bottleneck. A good limit smooths spikes, a cache absorbs repetition, and a circuit breaker prevents one hot path from dragging everything else down. If the service had kept growing without those boundaries, every impatient client would have turned one slow query into a cascade of duplicate work. The monitoring graphs made that plain within minutes, and the team moved fast to cut off the flood before the same pattern could spread to other endpoints. What happened next was less dramatic than the alert suggested, but it still proved the point: the more predictable the traffic, the more predictable the database, and the fewer surprises for everyone involved. The only missing piece was a proper backoff strategy that would have kept the clients from hammering the server while the system recovered, and that was the next item on the list because the last incident had shown how quickly repeated calls can turn a healthy app into a stalled one and the next incident would have been even worse if the limits had not been there to hold the line while the$$,
    true,
    '44444444-4444-4444-8444-444444444444'
  ),
  (
    9,
    'A Short Note on Readability',
    $$Lina's entry is a compact reminder that readable prose and readable code usually ask for the same thing: fewer surprises, cleaner structure, and a clear path from headline to detail.$$, 
    true,
    '55555555-5555-4555-8555-555555555555'
  );

INSERT INTO "Comment" (content, "authorId", "postId") VALUES
  ('Clean endpoint test. The response looks stable and the card renders correctly.', '22222222-2222-4222-8222-222222222222', 1),
  ('Frontend UI check passed. The author card and blog preview look fine.', '33333333-3333-4333-8333-333333333333', 2),
  ('This is the kind of seed data that makes a smoke test feel real.', '11111111-1111-4111-8111-111111111111', 4),
  ('The rate-limiting piece reads like a real incident note, which is useful for the demo.', '55555555-5555-4555-8555-555555555555', 8),
  ('Good structure. Short, readable, and easy to scan in the feed.', '44444444-4444-4444-8444-444444444444', 9),
  ('A second check from another user to show that threaded comments work.', '22222222-2222-4222-8222-222222222222', 1),
  ('I can see the blog detail page without any extra changes, which is exactly what we wanted.', '33333333-3333-4333-8333-333333333333', 2);