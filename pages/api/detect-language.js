// API to detect user's preferred language based on IP geolocation
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP address
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
    
    // For development/localhost, default to English
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.')) {
      return res.status(200).json({ 
        language: 'en', 
        country: 'US',
        source: 'default' 
      });
    }

    // Use ipapi.co for IP geolocation (free tier: 1000 requests/day)
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoResponse.json();

    if (geoData.error) {
      // Fallback to English if geolocation fails
      return res.status(200).json({ 
        language: 'en', 
        country: 'US',
        source: 'fallback' 
      });
    }

    // Determine language based on country
    const chineseCountries = ['CN', 'TW', 'HK', 'MO', 'SG'];
    const language = chineseCountries.includes(geoData.country_code) ? 'zh' : 'en';

    return res.status(200).json({
      language,
      country: geoData.country_code,
      countryName: geoData.country_name,
      source: 'geolocation'
    });

  } catch (error) {
    console.error('Language detection error:', error);
    // Fallback to English on any error
    return res.status(200).json({ 
      language: 'en', 
      country: 'US',
      source: 'error_fallback' 
    });
  }
}
