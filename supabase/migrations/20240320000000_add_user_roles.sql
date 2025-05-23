-- Add role column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'seeker' 
CHECK (role IN ('seeker', 'lister'));

-- Add index for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Add RLS policies for role-based access
CREATE POLICY "Listers can manage their properties"
ON properties
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'lister'
  )
  AND owner_id = auth.uid()
);

CREATE POLICY "Seekers can view properties"
ON properties
FOR SELECT
TO authenticated
USING (true);

-- Update existing users to have a role if they don't have one
UPDATE users
SET role = 'seeker'
WHERE role IS NULL; 