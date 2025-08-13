import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const HEADSHOT_GENDERS = ['male', 'female'];
const HEADSHOT_BACKGROUNDS = ['office', 'gray', 'white', 'blue', 'green'];
const HEADSHOT_ASPECTS = ['1:1', '4:5', '3:4', '16:9'];

export default function ProfessionalHeadshot() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // Parameters
  const [hsGender, setHsGender] = useState('male');
  const [hsBackground, setHsBackground] = useState('office');
  const [hsAspect, setHsAspect] = useState('1:1');

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        setFileDataUrl(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
      setResultUrl(null);
      setError('');
    }
  };

  const startPrediction = async () => {
    if (!fileDataUrl) {
      setError('请先上传图片');
      return;
    }

    setLoading(true);
    setStatus('提交任务中...');
    setError('');
    setResultUrl(null);

    try {
      const resp = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'professional_headshot',
          image: fileDataUrl,
          params: {
            gender: hsGender,
            background: hsBackground,
            aspect_ratio: hsAspect
          },
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
  };

  const pollPrediction = async (id) => {
    try {
      const resp = await fetch(`/api/process?id=${id}`);
      const data = await resp.json();
      if (data.status === 'succeeded') {
        setResultUrl(data.output);
        setStatus('处理完成！');
        setLoading(false);
      } else if (data.status === 'failed') {
        setError('处理失败：' + (data.error || '未知错误'));
        setLoading(false);
        setStatus('');
      } else {
        setStatus('处理中...');
        setTimeout(() => pollPrediction(id), 2000);
      }
    } catch (e) {
      setError('获取结果失败：' + e.message);
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <>
      <Head>
        <title>职业头像 - AI Photo Studio</title>
        <meta name="description" content="办公室、灰色等多场景背景，一键成片" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        {/* Header */}
        <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              AI Photo Studio
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← 返回首页
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">职业头像</h1>
            <p className="text-xl text-gray-600">办公室、灰色等多场景背景，一键成片</p>
          </div>

          {/* Editor Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <label className="block text-lg font-medium mb-4">选择图片</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onFileChange} 
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors"
              />
            </div>

            {/* Parameters */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">性别</label>
                <select 
                  value={hsGender} 
                  onChange={e => setHsGender(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {HEADSHOT_GENDERS.map(g => <option key={g} value={g}>{g === 'male' ? '男性' : '女性'}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">背景</label>
                <select 
                  value={hsBackground} 
                  onChange={e => setHsBackground(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {HEADSHOT_BACKGROUNDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">比例</label>
                <select 
                  value={hsAspect} 
                  onChange={e => setHsAspect(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {HEADSHOT_ASPECTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            {/* Action Button */}
            <div className="mb-8 text-center">
              <button
                disabled={loading || !file}
                onClick={startPrediction}
                className="px-8 py-4 bg-gray-700 text-white text-lg font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '处理中...' : '生成职业头像'}
              </button>
            </div>

            {/* Status */}
            {(status || error) && (
              <div className="mb-6 text-center">
                {status && <div className="text-blue-600 font-medium">{status}</div>}
                {error && <div className="text-red-600 font-medium">{error}</div>}
              </div>
            )}

            {/* Preview and Result */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">原图预览</h3>
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="max-h-80 max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-400">请选择图片</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">处理结果</h3>
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
                  {resultUrl ? (
                    <img src={resultUrl} alt="result" className="max-h-80 max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-400">结果将在此显示</span>
                  )}
                </div>
                {resultUrl && (
                  <div className="mt-4 text-center">
                    <a 
                      href={resultUrl} 
                      download 
                      className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      下载结果
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
