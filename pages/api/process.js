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
  if (req.method !== 'POST') return res.status(405).end();
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
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ error: error?.response?.data || error.message });
    }
  
  } else if (action === 'emoji_maker') {
    // Emoji maker model
    const model = process.env.REPLICATE_EMOJI_MAKER_VERSION || 'flux-kontext-apps/kontext-emoji-maker';
    input = {
      input_image: image,
      prompt: params.prompt || ''
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
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ error: error?.response?.data || error.message });
    }
  } else if (action === 'haircut_change') {
    // Haircut change model
    const model = process.env.REPLICATE_HAIRCUT_CHANGE_VERSION || 'flux-kontext-apps/change-haircut';
    input = {
      input_image: image,
      haircut: params.haircut || 'No change',
      hair_color: params.hair_color || 'No change',
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
      return res.status(200).json(response.data);
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
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ error: error?.response?.data || error.message });
    }
  } else if (action === 'professional_headshot') {
    // Professional headshot model
    const model = process.env.REPLICATE_PROFESSIONAL_HEADSHOT_VERSION || 'flux-kontext-apps/professional-headshot';
    // Follow official API: https://replicate.com/flux-kontext-apps/professional-headshot/api
    input = {
      input_image: image,
      gender: params.gender || 'none',
      background: params.background || 'neutral',
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
      return res.status(200).json(response.data);
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
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({ error: error?.response?.data || error.message });
    }
  
  } else if (action === 'emoji_maker') {
    // Emoji maker model
    version = process.env.REPLICATE_EMOJI_MAKER_VERSION;
    if (!version) {
      return res.status(500).json({ error: '缺少 REPLICATE_EMOJI_MAKER_VERSION 环境变量' });
    }
    // This model expects a prompt describing the emoji
    input = { prompt: params.prompt || '' };
  } else if (action === 'remove_text') {
    // Use flux-kontext text removal app
    version = process.env.REPLICATE_TEXT_REMOVAL_VERSION; // must be a concrete version id
    if (!version) {
      return res.status(500).json({ error: '缺少 REPLICATE_TEXT_REMOVAL_VERSION 环境变量' });
    }
    // This app expects input_image and optional params; pass through user params
    input = { input_image: image, ...params };
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
    res.status(200).json(response.data);
  } catch (e) {
    res.status(500).json({ error: e.response?.data || e.message });
  }
}
