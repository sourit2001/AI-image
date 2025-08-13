import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Upscale() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // Parameters
  const [upscaleScale, setUpscaleScale] = useState('2');
  const [upscaleMode, setUpscaleMode] = useState('standard_v2');
  const [upscaleFaceEnhance, setUpscaleFaceEnhance] = useState(false);

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
          action: 'upscale',
          image: fileDataUrl,
          params: {
            scale: Number(upscaleScale),
            mode: upscaleMode,
            face_enhance: upscaleFaceEnhance
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
        <title>高清放大 - AI Photo Studio</title>
        <meta name="description" content="细节增强，适配不同清晰度场景与人脸优化" />
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
            <h1 className="text-4xl font-bold mb-4">高清放大</h1>
            <p className="text-xl text-gray-600">细节增强，适配不同清晰度场景与人脸优化</p>
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
                <label className="block text-sm font-medium mb-2">放大倍数</label>
                <select 
                  value={upscaleScale} 
                  onChange={e => setUpscaleScale(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="2">2x</option>
                  <option value="4">4x</option>
                  <option value="6">6x</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">处理模式</label>
                <select 
                  value={upscaleMode} 
                  onChange={e => setUpscaleMode(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="standard_v2">标准</option>
                  <option value="low_resolution_v2">低分辨率</option>
                  <option value="cgi">CGI</option>
                  <option value="high_fidelity_v2">高保真</option>
                  <option value="text_refine">文本优化</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={upscaleFaceEnhance} 
                    onChange={e => setUpscaleFaceEnhance(e.target.checked)} 
                    className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium">人脸增强</span>
                </label>
              </div>
            </div>

            {/* Action Button */}
            <div className="mb-8 text-center">
              <button
                disabled={loading || !file}
                onClick={startPrediction}
                className="px-8 py-4 bg-purple-500 text-white text-lg font-semibold rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '处理中...' : '开始高清放大'}
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
