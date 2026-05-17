import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, phone, otp } = await req.json()
    const authKey = Deno.env.get('MSG91_AUTH_KEY')
    const templateId = Deno.env.get('MSG91_TEMPLATE_ID')
    
    if (!phone) throw new Error('Phone number is required')

    if (action === 'send') {
      const response = await fetch(`https://api.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${phone}&authkey=${authKey}`, {
        method: 'GET'
      })
      const data = await response.json()
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'verify') {
      const response = await fetch(`https://api.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${phone}&authkey=${authKey}`, {
        method: 'GET'
      })
      const data = await response.json()

      if (data.type === 'success') {
        // OTP verified by Msg91, now create/get user in Supabase
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Generate a magic link or use admin to create a session
        // For simplicity, we'll just check if user exists and create if not
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserByPhone(phone)
        
        let targetUser = userData?.user
        if (!targetUser) {
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            phone: phone,
            phone_confirm: true
          })
          if (createError) throw createError
          targetUser = newUser.user
        }

        // Generate a temporary login link that auto-logs them in
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          phone: phone
        })

        if (linkError) throw linkError

        return new Response(JSON.stringify({ 
          success: true, 
          message: 'OTP Verified',
          login_link: linkData.properties.action_link 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    throw new Error('Invalid action')
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
