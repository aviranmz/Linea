-- Update all events to use the correct image path
UPDATE "Event" 
SET metadata = jsonb_set(metadata, '{heroImageUrl}', '"/images/design-events.jpg"')
WHERE metadata->>'heroImageUrl' LIKE '/images/events/%';
