-- Add seed data for preview
INSERT INTO public.teams (team_name, captain_name, captain_email, captain_phone, players, skill_level, rules_acknowledged, media_release, payment_status, amount, stripe_payment_intent_id) VALUES
('Fire Dragons', 'Alex Johnson', 'alex@example.com', '555-0101', ARRAY['Sam Wilson', 'Maria Garcia'], 'Advanced', true, true, 'paid', 7500, 'pi_test_paid_1'),
('Thunder Bolts', 'Sarah Chen', 'sarah@example.com', '555-0102', ARRAY['Mike Davis', 'Lisa Park', 'Tom Brown'], 'Intermediate', true, true, 'paid', 7500, 'pi_test_paid_2'),
('Storm Chasers', 'David Lee', 'david@example.com', '555-0103', ARRAY['Emma White', 'Josh Miller'], 'Beginner', true, true, 'paid', 7500, 'pi_test_paid_3'),
('Lightning Strikes', 'Rachel Adams', 'rachel@example.com', '555-0104', ARRAY['Kevin Jones', 'Amy Taylor'], 'Intermediate', true, true, 'unpaid', 7500, null),
('Wind Warriors', 'James Wilson', 'james@example.com', '555-0105', ARRAY['Nicole Green', 'Ryan Clark', 'Zoe Lewis'], 'Advanced', true, true, 'unpaid', 7500, null),
('Rain Runners', 'Michelle Brown', 'michelle@example.com', '555-0106', ARRAY['Carlos Rodriguez', 'Ashley Kim'], 'Beginner', true, true, 'unpaid', 7500, null)
ON CONFLICT (team_name) DO NOTHING;

INSERT INTO public.rsvps (full_name, email, zip_code, party_size) VALUES
('John Smith', 'john@example.com', '12345', 2),
('Emily Johnson', 'emily@example.com', '12346', 1),
('Michael Brown', 'michael@example.com', '12347', 4),
('Jessica Davis', 'jessica@example.com', '12348', 3),
('Robert Wilson', 'robert@example.com', '12349', 1),
('Amanda Garcia', 'amanda@example.com', '12350', 5),
('Christopher Lee', 'chris@example.com', '12351', 2),
('Jennifer Miller', 'jennifer@example.com', '12352', 1)
ON CONFLICT (email) DO NOTHING;