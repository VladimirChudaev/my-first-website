-- Migration: add_visibility_and_position_to_media
-- Purpose: add fields for admin control over image visibility and display order
-- Affected tables: public.media
-- Notes:
--   - is_visible: allows hiding/showing images without deleting them
--   - position: enables drag-and-drop sorting in admin panel
--   - Default values ensure backward compatibility with existing records

-- Add is_visible column (default: true = visible)
alter table public.media
add column if not exists is_visible boolean not null default true;

-- Add position column (for drag-and-drop sorting in admin panel)
alter table public.media
add column if not exists position integer not null default 0;

-- Set default positions for existing records (by creation time)
update public.media
set position = sub.new_position
from (
  select 
    id,
    row_number() over (partition by category order by created_at asc) as new_position
  from public.media
) as sub
where public.media.id = sub.id;

-- Add comments for documentation
comment on column public.media.is_visible is 'Controls whether the image is displayed on the site (true = visible)';
comment on column public.media.position is 'Display order within category (lower = higher priority)';