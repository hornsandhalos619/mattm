import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://emdjxetqgiantgyhhgij.supabase.co'
const supabaseAnonKey = 'sb_publishable_1dKpmFSbuQUBbrw7VM0PTA_Az6yKwrj'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)