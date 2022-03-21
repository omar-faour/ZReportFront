// import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

 
export const supabase = createClient(
    'https://nkultscygvlhemvntund.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdWx0c2N5Z3ZsaGVtdm50dW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDYxNDExMjYsImV4cCI6MTk2MTcxNzEyNn0.xs6dF3-dB2qB293UeK0i2FrJu1oCFybc_9UeESooF1g'
)
