import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { HmacSha256 } from "https://deno.land/std@0.160.0/hash/sha256.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await req.json()

    // 1. Verify the signature securely on the backend
    const secret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!secret) throw new Error("RAZORPAY_KEY_SECRET not set in Supabase")

    const data = razorpay_order_id + "|" + razorpay_payment_id
    const generated_signature = new HmacSha256(secret).update(data).toString()

    if (generated_signature !== razorpay_signature) {
      console.error("Signature mismatch! Potential fraud detected.")
      throw new Error("Invalid payment signature")
    }

    console.log("✓ Signature Verified for Order:", order_id);

    // 2. Connect to Supabase with Service Role (Admin)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. Update order status to 'paid'
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'paid',
        payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id)

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Verification Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
