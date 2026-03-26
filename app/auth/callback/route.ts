import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check if user already has a partner profile
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: membership } = await supabase
          .from('partner_memberships')
          .select('partner_id')
          .eq('user_id', user.id)
          .single()
        
        // If already onboarded, go to dashboard
        if (membership?.partner_id) {
          return NextResponse.redirect(`${origin}/dashboard`)
        }
      }
      
      // New user - go to onboarding
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
