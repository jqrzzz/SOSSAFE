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

        // Check for team invite in user metadata
        const invitePartnerId = user.user_metadata?.invite_partner_id
        const inviteRole = user.user_metadata?.invite_role || 'staff'

        if (invitePartnerId) {
          // Auto-link user to the partner's team
          await supabase.from('partner_memberships').insert({
            partner_id: invitePartnerId,
            user_id: user.id,
            role: inviteRole,
            is_primary_contact: false,
            accepted_at: new Date().toISOString(),
          })

          // Notify owner that a new member joined (fire and forget)
          const memberName = user.user_metadata?.full_name || user.email || "New member"
          fetch(`${origin}/api/notifications/certification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "team_member_joined",
              partnerId: invitePartnerId,
              memberName,
            }),
          }).catch(() => {})

          return NextResponse.redirect(`${origin}/dashboard`)
        }
      }

      // New user without invite - go to onboarding
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
