-- Update 5 Points Cup 2026: brick hero, date TBD, Underground Atlanta
UPDATE public.events 
SET title = '5 Points Cup 2026',
    hero_image = '/lovable-uploads/5points-cup-brick.png',
    location = 'Underground Atlanta',
    description = '3v3 football tournament at Underground Atlanta. Compete for the crown in the heart of the city.'
WHERE id = 'fa4c42bf-d0bb-47af-a07b-d3c2bed9fadc';

-- Update Summer Kickoff -> 5 Points Session: concrete hero, date TBD, Underground Atlanta
UPDATE public.events 
SET title = '5 Points Session',
    hero_image = '/lovable-uploads/5points-cup-concrete.png',
    location = 'Underground Atlanta',
    description = 'Pickup session at Underground Atlanta. Come play in the heart of the city.'
WHERE id = '07b8222f-d9fe-4339-8423-4457534ef1ca';

-- Delete the Fall Classic so only 2 events remain
DELETE FROM public.events WHERE id = 'ee0004db-6315-457c-96b5-326569367d48';