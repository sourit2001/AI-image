import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: '缺少预测ID' });
  try {
    const r = await axios.get(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` },
    });
    res.status(200).json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.response?.data || e.message });
  }
}
