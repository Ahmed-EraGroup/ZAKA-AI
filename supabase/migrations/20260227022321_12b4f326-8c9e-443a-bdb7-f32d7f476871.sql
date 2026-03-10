
-- Add user_id column to track ownership
ALTER TABLE public.leads
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Drop the overly restrictive policies
DROP POLICY IF EXISTS "No one can update leads from client" ON public.leads;
DROP POLICY IF EXISTS "No one can delete leads from client" ON public.leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

-- Allow users to update their own leads
CREATE POLICY "Users can update their own leads"
ON public.leads
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their own leads
CREATE POLICY "Users can delete their own leads"
ON public.leads
FOR DELETE
USING (auth.uid() = user_id);

-- Allow authenticated users to insert leads with ownership
CREATE POLICY "Authenticated users can insert leads"
ON public.leads
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
