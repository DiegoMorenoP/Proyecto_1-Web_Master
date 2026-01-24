import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { messages } = await req.json()
        const apiKey = Deno.env.get('OPENAI_API_KEY')

        if (!apiKey) {
            console.error('Missing OPENAI_API_KEY')
            throw new Error('Configuration error: Missing OPENAI_API_KEY in server environment.')
        }

        // Prepare messages for OpenAI
        // Add a system prompt to define Catbot's persona
        const systemPrompt = {
            role: 'system',
            content: `Eres Catbot 🐱⚡️, el asistente virtual experto en energía solar de SolarEcommerce.
Tu misión es ayudar a los usuarios a entender los beneficios de la energía solar, resolver dudas sobre kits solares, instalación y ahorro energético.
Tono: Amable, profesional, entusiasta y servicial. Usas ocasionalmente emojis relacionados con energía solar y gatos (pero sin abusar).
Reglas:
1. Responde de forma concisa y clara.
2. Si te preguntan precios exactos, da rangos aproximados y sugiere usar la calculadora o contactar ventas, a menos que tengas el dato exacto en el contexto (no inventes precios).
3. Si no sabes algo, admítelo y sugiere contactar a un humano.
4. Intenta dirigir al usuario a la calculadora solar si preguntan por ahorros específicos.`
        }

        const apiMessages = [systemPrompt, ...messages]

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: apiMessages,
                temperature: 0.7,
                max_tokens: 500,
            }),
        })

        const data = await response.json()

        if (data.error) {
            console.error('OpenAI Error:', data.error)
            const status = data.error.code === 'insufficient_quota' ? 402 :
                data.error.code === 'rate_limit_exceeded' ? 429 :
                    500;
            const error = new Error(`OpenAI API Error: ${data.error.message}`);
            (error as any).status = status;
            throw error;
        }

        const reply = data.choices[0].message.content

        return new Response(JSON.stringify({ reply }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error: any) {
        console.error('Function Error:', error)
        const status = error.status || 500;
        return new Response(JSON.stringify({ error: error.message }), {
            status: status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
