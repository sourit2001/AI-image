import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useLanguage } from '../lib/LanguageContext';

const HAIRCUTS = ['bob', 'pixie', 'long layers', 'shag', 'bangs', 'curly', 'straight', 'wavy', 'updo', 'ponytail', 'braids', 'custom'];
const HAIRCOLORS = ['black', 'brown', 'blonde', 'red', 'gray', 'white', 'blue', 'pink', 'purple', 'green'];

export default function HaircutChange() {
  const { translate } = useLanguage();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // Parameters
  const [haircutPreset, setHaircutPreset] = useState('bob');
  const [haircutCustom, setHaircutCustom] = useState('');
  const [hairColor, setHairColor] = useState('brown');

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
      setError(translate('errors.pleaseSelectImage'));
      return;
    }

    const haircut = haircutPreset === 'custom' ? haircutCustom : haircutPreset;
    if (!HAIRCUTS.includes(haircut) || haircut === 'custom') {
      setError(translate('errors.invalidHaircutOption'));
      return;
    }

    setLoading(true);
    setStatus(translate('processing'));
    setError('');
    setResultUrl(null);

    try {
      const resp = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'haircut_change',
          image: fileDataUrl,
          params: {
            haircut: haircut,
            hair_color: hairColor
          },
        }),
      });
      
      const data = await resp.json();
      if (!resp.ok) throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
      
      const id = data.id;
      if (!id) throw new Error('Failed to get task ID');
      
      await pollPrediction(id);
    } catch (e) {
      setError(e.message || translate('errors.requestFailed'));
      setLoading(false);
    }
  };

  const pollPrediction = async (id) => {
    try {
      const resp = await fetch(`/api/process?id=${id}`);
      const data = await resp.json();
      if (data.status === 'succeeded') {
        setResultUrl(data.output);
        setStatus(translate('processingComplete'));
        setLoading(false);
      } else if (data.status === 'failed') {
        setError(translate('processingFailed', { error: data.error || translate('errors.unknownError') }));
        setLoading(false);
        setStatus('');
      } else {
        setStatus(translate('processingStatus', { status: data.status }));
        setTimeout(() => pollPrediction(id), 2000);
      }
    } catch (e) {
      setError('Failed to get result: ' + e.message);
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <>
      <Head>
        <title>{translate('haircutChangeTitle')} - {translate('title')}</title>
        <meta name="description" content={translate('haircutChangeDescription')} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        {/* Header */}
        <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              {translate('title')}
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              {translate('backToHome')}
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{translate('haircutChangeTitle')}</h1>
            <p className="text-xl text-gray-600">{translate('haircutChangeDescription')}</p>
          </div>

          {/* Editor Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <label htmlFor="file-upload" className="cursor-pointer block w-full text-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                {translate('selectImage')}
              </label>
              <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={onFileChange} />
              {file && <p className="mt-4 text-gray-600 text-center">{translate('selectedFile')}{file.name}</p>}
            </div>

            {/* Parameters */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">{translate('language') === 'zh' ? '发型选择' : 'Haircut Selection'}</label>
                <select 
                  value={haircutPreset} 
                  onChange={e => setHaircutPreset(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {HAIRCUTS.map(h => <option key={h} value={h}>{h === 'custom' ? (translate('language') === 'zh' ? '自定义' : 'Custom') : h}</option>)}
                </select>
                {haircutPreset === 'custom' && (
                  <div className="mt-2">
                    <input
                      list="haircut-autocomplete"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={translate('language') === 'zh' ? '输入/选择官方英文发型' : 'Enter/select official English haircut'}
                      value={haircutCustom}
                      onChange={e => setHaircutCustom(e.target.value)}
                    />
                    <datalist id="haircut-autocomplete">
                      {HAIRCUTS.filter(h => h !== 'custom').map(h => <option key={h} value={h}>{h}</option>)}
                    </datalist>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{translate('language') === 'zh' ? '发色选择' : 'Hair Color Selection'}</label>
                <select 
                  value={hairColor} 
                  onChange={e => setHairColor(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {HAIRCOLORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Action Button */}
            <div className="mb-8 text-center">
              <button
                disabled={loading || !file}
                onClick={startPrediction}
                className="px-8 py-4 bg-pink-400 text-white text-lg font-semibold rounded-lg hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? translate('processing') : translate('changeHaircut')}
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
                <h3 className="text-lg font-medium mb-4">{translate('originalPreview')}</h3>
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="max-h-80 max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-400">{translate('pleaseSelectImage')}</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">{translate('processedResult')}</h3>
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
                  {resultUrl ? (
                    <img src={resultUrl} alt="result" className="max-h-80 max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-400">{translate('resultWillShow')}</span>
                  )}
                </div>
                {resultUrl && (
                  <div className="mt-4 text-center">
                    <a 
                      href={resultUrl} 
                      download 
                      className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {translate('downloadResult')}
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
