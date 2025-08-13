import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useLanguage } from '../lib/LanguageContext';

export default function RemoveText() {
  const { translate } = useLanguage();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileDataUrl, setFileDataUrl] = useState(null);
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
      setError(translate('errors.pleaseSelectImage'));
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
          action: 'remove_text',
          image: fileDataUrl,
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
      setStatus('');
    }
  };

  const pollPrediction = async (id) => {
    try {
      const resp = await fetch(`/api/process?id=${id}`);
      const data = await resp.json();

      if (resp.status === 504) { // Gateway Timeout
        // Wait longer and retry
        setTimeout(() => pollPrediction(id), 5000);
        return;
      }

      if (!resp.ok) {
          throw new Error(data.error || 'Failed to get result');
      }

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
        <title>{translate('removeTextTitle')} - {translate('title')}</title>
        <meta name="description" content={translate('removeTextDescription')} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{translate('removeTextTitle')}</h1>
            <p className="text-xl text-gray-600">{translate('removeTextDescription')}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl">
            {/* Upload Section */}
            <div className="mb-8 text-center">
              <label htmlFor="file-upload" className="cursor-pointer block w-full text-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                {translate('selectImage')}
              </label>
              <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={onFileChange} />
              {file && <p className="mt-4 text-gray-600 text-center">{translate('selectedFile')}{file.name}</p>}
            </div>

            {/* Action Button */}
            <div className="mb-8 text-center">
              <button
                disabled={loading || !file}
                onClick={startPrediction}
                className="px-8 py-4 bg-gray-700 text-white text-lg font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? translate('processing') : translate('startProcessing')}
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
                <h3 className="text-lg font-medium mb-4 text-center">{translate('originalPreview')}</h3>
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="max-h-80 max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-400">{translate('pleaseSelectImage')}</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">{translate('processedResult')}</h3>
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
