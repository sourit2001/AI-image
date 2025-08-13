import axios from 'axios';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // Handle GET requests for polling prediction status
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: '缺少预测ID' });
    }
    
    try {
      const response = await axios.get(
        `https://api.replicate.com/v1/predictions/${id}`,
        {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        }
      );
      // Return the full prediction payload so the frontend can access output URLs
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ error: error?.response?.data || error.message });
    }
  }
  
  // Handle POST requests for creating predictions
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { image, action, params = {} } = req.body;
  let version, input;

  // Map actions to Replicate models
  if (action === 'remove_bg') {
    // background removal
    version = '851-labs/background-remover:a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc';
    input = { image, ...params };
  } else if (action === 'add_bg') {
    // Use Replicate new API for flux-kontext-pro (no version hash needed)
    const model = 'black-forest-labs/flux-kontext-pro';
    input = {
      image,
      prompt: params.prompt || ''
      // 可根据需要添加更多参数
    };
    try {
      if (input.image && input.image.startsWith('data:')) {
        const url = await ensureImageUrl(input.image);
        if (url) input.image = url;
      }
      const response = await axios.post(
        `https://api.replicate.com/v1/models/${model}/predictions`,
        { input },
        {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return res.status(200).json({ id: response.data.id, status: response.data.status });
    } catch (error) {
      return res.status(500).json({ error: error?.response?.data || error.message });
    }
  
  } else if (action === 'haircut_change') {
    // Haircut change model
    const model = process.env.REPLICATE_HAIRCUT_CHANGE_VERSION || 'flux-kontext-apps/change-haircut';
    // sanitize enums per official API
    const allowedHairColors = [
      'No change','Random','Blonde','Brunette','Black','Dark Brown','Medium Brown','Light Brown','Auburn','Copper','Red','Strawberry Blonde','Platinum Blonde','Silver','White','Blue','Purple','Pink','Green','Blue-Black','Golden Blonde','Honey Blonde','Caramel','Chestnut','Mahogany','Burgundy','Jet Black','Ash Brown','Ash Blonde','Titanium','Rose Gold'
    ];
    const allowedHaircuts = [
      'No change','Random','Straight','Wavy','Curly','Bob','Pixie Cut','Layered','Messy Bun','High Ponytail','Low Ponytail','Braided Ponytail','French Braid','Dutch Braid','Fishtail Braid','Space Buns','Top Knot','Undercut','Mohawk','Crew Cut','Faux Hawk','Slicked Back','Side-Parted','Center-Parted','Blunt Bangs','Side-Swept Bangs','Shag','Lob','Angled Bob','A-Line Bob','Asymmetrical Bob','Graduated Bob','Inverted Bob','Layered Shag','Choppy Layers','Razor Cut','Perm','Ombré','Straightened','Soft Waves','Glamorous Waves','Hollywood Waves','Finger Waves','Tousled','Feathered','Pageboy','Pigtails','Pin Curls','Rollerset','Twist Out','Bantu Knots','Dreadlocks','Cornrows','Box Braids','Crochet Braids','Double Dutch Braids','French Fishtail Braid','Waterfall Braid','Rope Braid','Heart Braid','Halo Braid','Crown Braid','Braided Crown','Bubble Braid','Bubble Ponytail','Ballerina Braids','Milkmaid Braids','Bohemian Braids','Flat Twist','Crown Twist','Twisted Bun','Twisted Half-Updo','Twist and Pin Updo','Chignon','Simple Chignon','Messy Chignon','French Twist','French Twist Updo','French Roll','Updo','Messy Updo','Knotted Updo','Ballerina Bun','Banana Clip Updo','Beehive','Bouffant','Hair Bow','Half-Up Top Knot','Half-Up, Half-Down','Messy Bun with a Headband','Messy Bun with a Scarf','Messy Fishtail Braid','Sideswept Pixie','Mohawk Fade','Zig-Zag Part','Victory Rolls'
    ];
    const normalizeEnum = (val, allowed) => {
      if (typeof val !== 'string') return allowed[0];
      const lower = val.toLowerCase().trim();
      const found = allowed.find(opt => opt.toLowerCase() === lower);
      return found || allowed[0];
    };
    const safeHaircut = normalizeEnum(params.haircut, allowedHaircuts);
    const safeHairColor = normalizeEnum(params.hair_color, allowedHairColors);
    input = {
      input_image: image,
      haircut: safeHaircut,
      hair_color: safeHairColor,
      // 可扩展更多参数，如 aspect_ratio, output_format, gender, seed, safety_tolerance
    };
    try {
      if (input.input_image && input.input_image.startsWith('data:')) {
        const url = await ensureImageUrl(input.input_image);
        if (url) input.input_image = url;
      }
      const response = await axios.post(
        `https://api.replicate.com/v1/models/${model}/predictions`,
        { input },
        {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return res.status(200).json({ id: response.data.id, status: response.data.status });
    } catch (error) {
      return res.status(500).json({ error: error?.response?.data || error.message });
    }
  } else if (action === 'portrait_series') {
    // Portrait series model
    const model = process.env.REPLICATE_PORTRAIT_SERIES_VERSION || 'flux-kontext-apps/portrait-series';
    input = {
      input_image: image,
      background: params.background || 'white',
      num_images: params.num_images || 4,
      output_format: params.output_format || 'png',
      randomize_images: params.randomize_images === undefined ? false : params.randomize_images,
      safety_tolerance: params.safety_tolerance === undefined ? 2 : params.safety_tolerance
    };
    try {
      if (input.input_image && input.input_image.startsWith('data:')) {
        const url = await ensureImageUrl(input.input_image);
        if (url) input.input_image = url;
      }
      const response = await axios.post(
        `https://api.replicate.com/v1/models/${model}/predictions`,
        { input },
        {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return res.status(200).json({ id: response.data.id, status: response.data.status });
    } catch (error) {
      return res.status(500).json({ error: error?.response?.data || error.message });
    }
  } else if (action === 'professional_headshot') {
    // Professional headshot model
    const model = process.env.REPLICATE_PROFESSIONAL_HEADSHOT_VERSION || 'flux-kontext-apps/professional-headshot';
    // Follow official API: https://replicate.com/flux-kontext-apps/professional-headshot/api
    // sanitize background to allowed enum
    const allowedBackgrounds = ['white', 'black', 'neutral', 'gray', 'office'];
    const bgRaw = (params.background || 'neutral');
    const bg = (typeof bgRaw === 'string' ? bgRaw.toLowerCase().trim() : 'neutral');
    const safeBackground = allowedBackgrounds.includes(bg) ? bg : 'neutral';
    input = {
      input_image: image,
      gender: params.gender || 'none',
      background: safeBackground,
      aspect_ratio: params.aspect_ratio || 'match_input_image',
      output_format: params.output_format || 'png',
      safety_tolerance: params.safety_tolerance === undefined ? 2 : params.safety_tolerance
    };
    // Only include seed if it's an integer (coerce numeric strings)
    if (params.seed !== undefined && params.seed !== null) {
      const seedVal = Number(params.seed);
      if (Number.isInteger(seedVal)) {
        input.seed = seedVal;
      }
    }
    try {
      if (input.input_image && input.input_image.startsWith('data:')) {
        const url = await ensureImageUrl(input.input_image);
        if (url) input.input_image = url;
      }
      const response = await axios.post(
        `https://api.replicate.com/v1/models/${model}/predictions`,
        { input },
        {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return res.status(200).json({ id: response.data.id, status: response.data.status });
    } catch (error) {
      return res.status(500).json({ error: error?.response?.data || error.message });
    }
  } else if (action === 'upscale') {
    // mv-lab/swin2sr 超分模型（新版API，需指定 version hash）
    const version = 'a01b0512004918ca55d02e554914a9eca63909fa83a29ff0f115c78a7045574f';
    const model = 'mv-lab/swin2sr';
    // swin2sr 支持 scale (2, 4), task, image 等参数
    input = {
      image,
      task: params.task || 'real_sr' // 可选：'classical_sr', 'real_sr', 'compressed_sr'
    };
    // 传递放大倍数，限定为 2 或 4，默认 2
    const scl = Number(params.scale);
    if (Number.isFinite(scl) && (scl === 2 || scl === 4)) {
      input.scale = scl;
    } else {
      input.scale = 2;
    }
    try {
      // 确保 image 是可用URL
      if (input.image && input.image.startsWith('data:')) {
        const url = await ensureImageUrl(input.image);
        if (url) input.image = url;
      }
      const response = await axios.post(
        `https://api.replicate.com/v1/predictions`,
        {
          version,
          input,
        },
        {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return res.status(200).json({ id: response.data.id, status: response.data.status });
    } catch (error) {
      return res.status(500).json({ error: error?.response?.data || error.message });
    }
  
  } else if (action === 'emoji_maker') {
    const model = 'flux-kontext-apps/kontext-emoji-maker';
    input = { input_image: image, ...params };
    try {
      // Validate that we have an image
      if (!input.input_image) {
        return res.status(400).json({ error: '缺少必需的图片' });
      }
      
      console.log('Processing emoji_maker request with image type:', 
        input.input_image.startsWith('data:') ? 'base64' : 'url');
      
      // Try direct API call first (some models accept base64 directly)
      try {
        console.log('Attempting direct API call with base64/url...');
        const response = await axios.post(
          `https://api.replicate.com/v1/models/${model}/predictions`,
          { input },
          {
            headers: {
              Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Direct API call successful!');
        return res.status(200).json({ id: response.data.id, status: response.data.status });
      } catch (directError) {
        console.log('Direct API call failed, trying URL conversion...', directError?.response?.data);
        
        // If direct call fails and we have base64, try converting to URL
        if (input.input_image.startsWith('data:')) {
          console.log('Converting base64 image to URL for emoji_maker...');
          const url = await ensureImageUrl(input.input_image);
          if (!url) {
            console.error('Failed to convert base64 image to URL');
            return res.status(400).json({ error: '图片上传失败，请重试或更换图片格式' });
          }
          input.input_image = url;
          console.log('Successfully converted to URL, retrying API call...');
          
          const response = await axios.post(
            `https://api.replicate.com/v1/models/${model}/predictions`,
            { input },
            {
              headers: {
                Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
            }
          );
          return res.status(200).json({ id: response.data.id, status: response.data.status });
        } else {
          // Re-throw the original error if we can't try URL conversion
          throw directError;
        }
      }
    } catch (error) {
      console.error('Error in emoji_maker:', error?.response?.data || error.message);
      return res.status(500).json({ error: error?.response?.data || error.message });
    }
  } else if (action === 'remove_text') {
    // Use flux-kontext text removal app via model slug
    const model = 'flux-kontext-apps/text-removal';
    input = { input_image: image, ...params };
    try {
      if (input.input_image && input.input_image.startsWith('data:')) {
        const url = await ensureImageUrl(input.input_image);
        if (url) input.input_image = url;
      }
      const response = await axios.post(
        `https://api.replicate.com/v1/models/${model}/predictions`,
        { input },
        {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return res.status(200).json({ id: response.data.id, status: response.data.status });
    } catch (error) {
      return res.status(500).json({ error: error?.response?.data || error.message });
    }
  } else {
    return res.status(400).json({ error: '未知操作' });
  }

  // If image is a base64 data URL, upload to Replicate files to get a URL
  async function ensureImageUrl(img) {
    if (!img) return undefined;
    if (typeof img === 'string' && img.startsWith('http')) return img;
    if (typeof img === 'string' && img.startsWith('data:')) {
      const match = img.match(/^data:(.*?);base64,(.*)$/);
      if (!match) return undefined;
      const mime = match[1];
      const b64 = match[2];
      const buffer = Buffer.from(b64, 'base64');
      const form = new FormData();
      form.append('content', buffer, { filename: 'upload', contentType: mime });
      const uploadResp = await axios.post('https://api.replicate.com/v1/files', form, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          ...form.getHeaders(),
        },
      });
      return uploadResp.data?.serve_url || uploadResp.data?.url;
    }
    return undefined;
  }

  try {
    // normalize images
    if (action === 'add_bg') {
      const img1Url = await ensureImageUrl(image) || image;
      const secondary = params.secondary_image || params.secondaryImage;
      const img2Url = (await ensureImageUrl(secondary)) || secondary || img1Url;
      // Build input for this model
      const passthrough = { ...params };
      delete passthrough.secondary_image;
      delete passthrough.secondaryImage;
      delete passthrough.prompt; // prompt already set
      input = {
        ...input,
        input_image_1: img1Url,
        input_image_2: img2Url,
        ...passthrough,
      };
    } else if (action === 'remove_text') {
      // ensure input_image is URL
      if (input.input_image) {
        const url = await ensureImageUrl(input.input_image);
        if (url) input.input_image = url;
      }
    } else {
      // other models commonly accept image
      if (input.image) {
        const url = await ensureImageUrl(input.image);
        if (url) input.image = url;
      }
    }
    const response = await axios.post(
      `https://api.replicate.com/v1/predictions`,
      {
        version,
        input,
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.status(200).json({ id: response.data.id, status: response.data.status });
  } catch (e) {
    return res.status(500).json({ error: e.response?.data || e.message });
  }
}
