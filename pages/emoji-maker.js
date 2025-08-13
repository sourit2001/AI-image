import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function EmojiMaker() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [prompt, setPrompt] = useState('Turn this image into the emoji style of Apple iOS system');
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

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
      setStatus('');
    }
  };

  const startPrediction = async () => {
    if (!fileDataUrl) {
      setError('请先上传图片');
      return;
    }
    if (!prompt.trim()) {
      setError('请输入描述文字 (Prompt)');
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
          action: 'emoji_maker',
          image: fileDataUrl,
          params: { prompt },
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
      setStatus('');
    }
  };

  const pollPrediction = async (id) => {
    try {
      const resp = await fetch(`/api/process?id=${id}`);
      const data = await resp.json();

      if (resp.status === 504) { // Gateway Timeout
        setTimeout(() => pollPrediction(id), 5000);
        return;
      }

      if (!resp.ok) {
          throw new Error(data.error || '获取结果失败');
      }

      if (data.status === 'succeeded') {
        setResultUrl(data.output);
        setStatus('处理完成！');
        setLoading(false);
      } else if (data.status === 'failed') {
        setError('处理失败：' + (data.error || '未知错误'));
        setLoading(false);
        setStatus('');
      } else {
        setStatus(`处理中... (${data.status})`);
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
        <title>生成Emoji - AI Photo Studio</title>
        <meta name="description" content="根据你的图片和提示生成有趣的Emoji表情包" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">生成Emoji</h1>
            <p className="text-xl text-gray-600">上传图片，输入描述，创造你专属的Emoji！</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl">
            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label htmlFor="file-upload" className="cursor-pointer block w-full text-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                  1. 选择图片
                </label>
                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                {file && <p className="mt-4 text-gray-600 text-center">已选择: {file.name}</p>}
              </div>
              <div>
                <label htmlFor="prompt-input" className="block text-gray-700 font-medium mb-2">2. 输入描述 (Prompt)</label>
                <input 
                  id="prompt-input"
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：a smiling face with sunglasses"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="mb-8 text-center">
              <button
                disabled={loading || !file || !prompt}
                onClick={startPrediction}
                className="px-8 py-4 bg-gray-700 text-white text-lg font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '生成中...' : '开始生成Emoji'}
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
                <h3 className="text-lg font-medium mb-4 text-center">原图预览</h3>
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="max-h-80 max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-400">请选择图片</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">生成结果</h3>
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
