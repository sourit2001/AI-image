import Head from 'next/head';
import Link from 'next/link';
import { useState, useCallback } from 'react';

export default function Home() {
  // 发型和发色选项
  const HAIRCUTS = [
    'No change','Random','Straight','Wavy','Curly','Bob','Pixie Cut','Layered','Messy Bun','High Ponytail','Low Ponytail','Braided Ponytail','French Braid','Dutch Braid','Fishtail Braid','Space Buns','Top Knot','Undercut','Mohawk','Crew Cut','Faux Hawk','Slicked Back','Side-Parted','Center-Parted','Blunt Bangs','Side-Swept Bangs','Shag','Lob','Angled Bob','A-Line Bob','Asymmetrical Bob','Graduated Bob','Inverted Bob','Layered Shag','Choppy Layers','Razor Cut','Perm','Ombré','Straightened','Soft Waves','Glamorous Waves','Hollywood Waves','Finger Waves','Tousled','Feathered','Pageboy','Pigtails','Pin Curls','Rollerset','Twist Out','Bantu Knots','Dreadlocks','Cornrows','Box Braids','Crochet Braids','Double Dutch Braids','French Fishtail Braid','Waterfall Braid','Rope Braid','Heart Braid','Halo Braid','Crown Braid','Braided Crown','Bubble Braid','Bubble Ponytail','Ballerina Braids','Milkmaid Braids','Bohemian Braids','Flat Twist','Crown Twist','Twisted Bun','Twisted Half-Updo','Twist and Pin Updo','Chignon','Simple Chignon','Messy Chignon','French Twist','French Twist Updo','French Roll','Updo','Messy Updo','Knotted Updo','Ballerina Bun','Banana Clip Updo','Beehive','Bouffant','Hair Bow','Half-Up Top Knot','Half-Up, Half-Down','Messy Bun with a Headband','Messy Bun with a Scarf','Messy Fishtail Braid','Sideswept Pixie','Mohawk Fade','Zig-Zag Part','Victory Rolls','custom'
  ];
  const HAIRCOLORS = [
    'No change','Random','Blonde','Brunette','Black','Dark Brown','Medium Brown','Light Brown','Auburn','Copper','Red','Strawberry Blonde','Platinum Blonde','Silver','White','Blue','Purple','Pink','Green','Blue-Black','Golden Blonde','Honey Blonde','Caramel','Chestnut','Mahogany','Burgundy','Jet Black','Ash Brown','Ash Blonde','Titanium','Rose Gold'
  ];
  const [haircutPreset, setHaircutPreset] = useState('No change');
  const [haircutCustom, setHaircutCustom] = useState('');
  const [hairColor, setHairColor] = useState('No change');
  // 高清放大选项
  const [upscaleScale, setUpscaleScale] = useState('4');
  const [upscaleMode, setUpscaleMode] = useState('standard_v2');
  const [upscaleFaceEnhance, setUpscaleFaceEnhance] = useState(false);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [prompt, setPrompt] = useState('professional studio gradient background');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  // 职业头像参数
  const HEADSHOT_GENDERS = ['none','male','female'];
  const HEADSHOT_BACKGROUNDS = ['white','black','neutral','gray','office'];
  const HEADSHOT_ASPECTS = ['match_input_image','1:1','16:9','9:16','4:3','3:4','3:2','2:3','4:5','5:4','21:9','9:21','2:1','1:2'];
  const [hsGender, setHsGender] = useState('none');
  const [hsBackground, setHsBackground] = useState('neutral');
  const [hsAspect, setHsAspect] = useState('match_input_image');

  const onFileChange = useCallback((e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setFileDataUrl(dataUrl);
      setPreviewUrl(dataUrl);
      setResultUrl(null);
      setError('');
    };
    reader.readAsDataURL(f);
  }, []);

  async function startPrediction(action, extraParams = {}) {
    if (!fileDataUrl && action !== 'add_bg') {
      setError('请先上传图片');
      return;
    }
    setLoading(true);
    setStatus('提交任务中...');
    setError('');
    setResultUrl(null);
    try {
      // 合并参数时，prompt 只在 add_bg 时才需要，其他 action 不能强制带 prompt，否则会覆盖 upscale 参数
      let params = { ...extraParams };
      if (action === 'add_bg') {
        params.prompt = prompt;
      }
      const resp = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          image: fileDataUrl,
          params,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
      const id = data.id;
      if (!id) throw new Error('未获取到任务ID');
      await pollPrediction(id);
    } catch (e) {
      setError(e.message || '请求失败');
      setLoading(false);
    }
  }

  async function pollPrediction(id) {
    setStatus('处理中...');
    const start = Date.now();
    const timeoutMs = 180000; // 3min
    const interval = 1500;
    async function step() {
      try {
        const r = await fetch(`/api/predictions/${id}`);
        const j = await r.json();
        if (!r.ok) throw new Error(typeof j.error === 'string' ? j.error : JSON.stringify(j.error));
        const s = j.status;
        setStatus(`状态：${s}`);
        if (s === 'succeeded') {
          const out = j.output;
          const url = Array.isArray(out) ? out[out.length - 1] : out;
          setResultUrl(url || null);
          setLoading(false);
          return;
        }
        if (s === 'failed' || s === 'canceled') {
          setError('生成失败');
          setLoading(false);
          return;
        }
        if (Date.now() - start > timeoutMs) {
          setError('处理超时');
          setLoading(false);
          return;
        }
        setTimeout(step, interval);
      } catch (e) {
        setError(e.message || '轮询失败');
        setLoading(false);
      }
    }
    step();
  }

  return (
    <>
      <Head>
        <title>AI Photo Studio · 智能抠图 | 职业头像 | 发型变换 | 高清放大</title>
        <meta name="description" content="一站式 AI 图像工具：一键抠图、添加背景、职业头像生成、发型/发色变换、高清放大与去文字。" />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 via-pink-50 to-amber-50">
        {/* Header */}
        <header className="w-full max-w-7xl mx-auto flex justify-between items-center p-6">
          <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-orange-500">AI Photo Studio</div>
          <nav className="flex items-center gap-4">
            <a href="#features" className="text-gray-700 hover:text-gray-900">功能</a>
            <a href="#editor" className="text-gray-700 hover:text-gray-900">开始创作</a>
            <Link href="/pricing" className="px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-black">订阅计划</Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="w-full max-w-7xl mx-auto px-6 mt-6 md:mt-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                一键搞定你的<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500"> 商业级照片</span>
              </h1>
              <p className="mt-4 text-gray-600 text-lg">参考 remove.bg 的即用即走体验：上传图片，即刻获得专业效果。丰富的功能与色彩风格，让创作更简单更有趣。</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#editor" className="px-5 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow hover:opacity-90">立即开始</a>
                <Link href="/pricing" className="px-5 py-3 rounded-lg border border-gray-300 bg-white/60 backdrop-blur text-gray-900 hover:bg-white">查看价格</Link>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                <span>✨ 背景消除</span>
                <span>🎯 职业头像</span>
                <span>💇 发型/发色</span>
                <span>🔍 高清放大</span>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-white shadow-xl p-4 md:p-6">
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-[4/5] rounded-lg bg-gradient-to-br from-rose-200 to-pink-300" />
                  <div className="aspect-[4/5] rounded-lg bg-gradient-to-br from-indigo-200 to-blue-300" />
                  <div className="aspect-[4/5] rounded-lg bg-gradient-to-br from-amber-200 to-orange-300" />
                </div>
                <div className="mt-3 text-center text-sm text-gray-500">示意图 | 上传后将在下方编辑器中预览与下载</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="w-full max-w-7xl mx-auto px-6 mt-12">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="rounded-xl p-5 bg-white shadow hover:shadow-md transition">
              <div className="text-2xl">🧼</div>
              <div className="mt-2 font-semibold">背景消除</div>
              <div className="text-sm text-gray-600">智能抠图，秒出干净通透的人像与商品图。</div>
            </div>
            <div className="rounded-xl p-5 bg-white shadow hover:shadow-md transition">
              <div className="text-2xl">🏢</div>
              <div className="mt-2 font-semibold">职业头像</div>
              <div className="text-sm text-gray-600">办公室、灰色等多场景背景，一键成片。</div>
            </div>
            <div className="rounded-xl p-5 bg-white shadow hover:shadow-md transition">
              <div className="text-2xl">💇‍♀️</div>
              <div className="mt-2 font-semibold">发型与发色</div>
              <div className="text-sm text-gray-600">官方枚举可选，精准匹配，避免报错。</div>
            </div>
            <div className="rounded-xl p-5 bg-white shadow hover:shadow-md transition">
              <div className="text-2xl">🔎</div>
              <div className="mt-2 font-semibold">高清放大</div>
              <div className="text-sm text-gray-600">细节增强，适配不同清晰度场景与人脸优化。</div>
            </div>
          </div>
        </section>

        {/* Editor Card */}
        <section id="editor" className="w-full max-w-5xl mx-auto px-6 mt-12 p-6 md:p-8 bg-white rounded-2xl shadow-xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">开始创作 · 上传图片</h2>
          <div className="flex flex-col gap-4">
            <input type="file" accept="image/*" onChange={onFileChange} className="w-full px-3 py-2 border rounded" />
            <div className="flex flex-wrap gap-2 justify-center">
              <button disabled={loading} onClick={()=>startPrediction('remove_bg')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">背景消除</button>
              <button disabled={loading} onClick={()=>startPrediction('add_bg')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50">添加背景</button>
              <input
                type="text"
                className="border rounded px-2 py-1 mx-2 w-64"
                placeholder="请输入添加背景的提示词（如：sunset beach）"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                disabled={loading}
              />
              <div className="flex flex-col md:flex-row gap-2 items-center">
                <button
                  disabled={loading}
                  onClick={() => startPrediction('upscale', {
                    scale: Number(upscaleScale),
                    mode: upscaleMode,
                    face_enhance: upscaleFaceEnhance
                  })}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
                >高清放大</button>
                <select value={upscaleScale} onChange={e=>setUpscaleScale(e.target.value)} className="ml-2 px-2 py-1 border rounded">
                  <option value="2">2倍</option>
                  <option value="4">4倍</option>
                  <option value="6">6倍</option>
                </select>
                <select value={upscaleMode} onChange={e=>setUpscaleMode(e.target.value)} className="ml-2 px-2 py-1 border rounded">
                  <option value="standard_v2">标准</option>
                  <option value="low_resolution_v2">低分辨率</option>
                  <option value="cgi">CGI</option>
                  <option value="high_fidelity_v2">高保真</option>
                  <option value="text_refine">文本优化</option>
                </select>
                <label className="ml-2 flex items-center text-sm">
                  <input type="checkbox" checked={upscaleFaceEnhance} onChange={e=>setUpscaleFaceEnhance(e.target.checked)} className="mr-1" />人脸增强
                </label>
              </div>
              <button disabled={loading} onClick={()=>startPrediction('remove_text')} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50">消除文字</button>
              {/* Emoji Maker */}
              <button disabled={loading} onClick={()=>startPrediction('emoji_maker', { prompt })} className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 disabled:opacity-50">生成表情包</button>
              {/* Haircut Change */}
              <div className="flex items-center gap-2">
                {/* 发型选择 */}
                <select
                  className="px-2 py-1 border rounded"
                  value={haircutPreset}
                  onChange={e => setHaircutPreset(e.target.value)}
                  disabled={loading}
                >
                  {HAIRCUTS.map(h => <option key={h} value={h}>{h === 'custom' ? '自定义' : h}</option>)}
                </select>
                {haircutPreset === 'custom' && (
                  <input
                    list="haircut-autocomplete"
                    type="text"
                    className="border rounded px-2 py-1 w-32"
                    placeholder="输入/选择官方英文发型"
                    value={haircutCustom}
                    onChange={e => setHaircutCustom(e.target.value)}
                    disabled={loading}
                  />
                )}
                <datalist id="haircut-autocomplete">
                  {HAIRCUTS.filter(h => h !== 'custom').map(h => <option key={h} value={h}>{h}</option>)}
                </datalist>
                {/* 发色选择 */}
                <select
                  className="px-2 py-1 border rounded"
                  value={hairColor}
                  onChange={e => setHairColor(e.target.value)}
                  disabled={loading}
                >
                  {HAIRCOLORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                  disabled={loading || !fileDataUrl}
                  onClick={() => {
                    const haircut = haircutPreset === 'custom' ? haircutCustom : haircutPreset;
                    // 校验发型必须为官方英文
                    if (!HAIRCUTS.includes(haircut) || haircut === 'custom') {
                      alert('发型必须为官方支持的英文选项！');
                      return;
                    }
                    startPrediction('haircut_change', { haircut, hair_color: hairColor });
                  }}
                  className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 disabled:opacity-50"
                >发型变换</button>
              </div>
              {/* Portrait Series */}
              <button disabled={loading || !fileDataUrl} onClick={()=>startPrediction('portrait_series')} className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 disabled:opacity-50">写真系列</button>
              {/* Professional Headshot 参数选择 */}
              <div className="flex flex-wrap gap-2 items-center mt-3">
                <label className="text-sm text-gray-600">Gender</label>
                <select
                  className="px-2 py-1 border rounded"
                  value={hsGender}
                  onChange={e=>setHsGender(e.target.value)}
                  disabled={loading}
                >
                  {HEADSHOT_GENDERS.map(g=> <option key={g} value={g}>{g}</option>)}
                </select>
                <label className="text-sm text-gray-600">Background</label>
                <select
                  className="px-2 py-1 border rounded"
                  value={hsBackground}
                  onChange={e=>setHsBackground(e.target.value)}
                  disabled={loading}
                >
                  {HEADSHOT_BACKGROUNDS.map(b=> <option key={b} value={b}>{b}</option>)}
                </select>
                <label className="text-sm text-gray-600">Aspect</label>
                <select
                  className="px-2 py-1 border rounded"
                  value={hsAspect}
                  onChange={e=>setHsAspect(e.target.value)}
                  disabled={loading}
                >
                  {HEADSHOT_ASPECTS.map(a=> <option key={a} value={a}>{a}</option>)}
                </select>
                <button
                  disabled={loading || !fileDataUrl}
                  onClick={()=>startPrediction('professional_headshot', { gender: hsGender, background: hsBackground, aspect_ratio: hsAspect })}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
                >职业头像</button>
              </div>
            </div>
          </div>
          {(status || error) && (
            <div className="mt-4 text-center">
              {status && <div className="text-sm text-gray-600">{status}</div>}
              {error && <div className="text-sm text-red-600">{error}</div>}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <div className="mb-2 font-medium">原图预览</div>
              <div className="border rounded p-2 bg-white min-h-[200px] flex items-center justify-center">
                {previewUrl ? (<img src={previewUrl} alt="preview" className="max-h-80 object-contain" />) : (<span className="text-gray-400">未选择图片</span>)}
              </div>
            </div>
            <div>
              <div className="mb-2 font-medium">结果</div>
              <div className="border rounded p-2 bg-white min-h-[200px] flex items-center justify-center">
                {resultUrl ? (
                  <a href={resultUrl} target="_blank" rel="noreferrer">
                    <img src={resultUrl} alt="result" className="max-h-80 object-contain" />
                  </a>
                ) : (
                  <span className="text-gray-400">等待处理</span>
                )}
              </div>
              {resultUrl && (
                <div className="mt-3 text-center">
                  <a className="text-blue-600 underline" href={resultUrl} download>下载结果</a>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500">* 部分高级功能需要登录与订阅</div>
        </section>
      </main>
    </>
  );
}
