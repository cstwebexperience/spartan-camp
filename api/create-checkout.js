const Stripe = require('stripe');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { country, qty, flyIn, name, email, phone, ref, lang } = req.body || {};

    if (!name || !email || !ref) return res.status(400).json({ error: 'Missing required fields' });

    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    const prices = {
        ron: { amount: 400000, currency: 'ron' },
        gbp: { amount: 68000,  currency: 'gbp' },
        eur: { amount: 80000,  currency: 'eur' },
    };

    const p = prices[country] || prices['eur'];
    const numQty = Math.max(1, parseInt(qty) || 1);
    const unitAmount = flyIn ? Math.round(p.amount * 0.85) : p.amount;

    const baseUrl = 'https://spartan-expedition.com';
    const successPath = lang === 'ro' ? '/ro/success.html' : '/success.html';

    const successUrl = baseUrl + successPath +
        '?ref=' + encodeURIComponent(ref) +
        '&name=' + encodeURIComponent(name) +
        '&email=' + encodeURIComponent(email) +
        '&phone=' + encodeURIComponent(phone || '') +
        '&qty=' + numQty +
        '&country=' + (country || 'eur') +
        '&flyIn=' + (flyIn ? 'true' : 'false') +
        '&session_id={CHECKOUT_SESSION_ID}';

    const cancelUrl = baseUrl + (lang === 'ro' ? '/ro/' : '/') + '#tickets';

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: p.currency,
                product_data: {
                    name: 'SPARTAN PREMIUM — Spartan Camp 2026',
                    description: '3-day adventure camp · June 19–21 2026 · Romania' +
                        (flyIn ? ' · Free airport transfer included' : ''),
                },
                unit_amount: unitAmount,
            },
            quantity: numQty,
        }],
        mode: 'payment',
        customer_email: email,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { ref, name, email, phone: phone || '', qty: numQty.toString(), country: country || 'eur', flyIn: flyIn ? 'true' : 'false' },
    });

    res.status(200).json({ url: session.url });
};
