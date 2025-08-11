import Head from 'next/head';

export default function Pricing() {
  return (
    <>
      <Head>
        <title>订阅计划 - AI 图像编辑器</title>
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-full max-w-lg p-8 bg-gray-50 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">订阅计划</h1>
          <div className="flex flex-col gap-6">
            <div className="border rounded p-4 flex flex-col items-center">
              <div className="text-xl font-semibold mb-2">免费试用</div>
              <div className="mb-2">每日3次编辑，标准分辨率</div>
              <div className="text-2xl font-bold mb-2">¥0</div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">立即体验</button>
            </div>
            <div className="border rounded p-4 flex flex-col items-center bg-blue-50">
              <div className="text-xl font-semibold mb-2">高级会员</div>
              <div className="mb-2">不限次数，高清放大，全部功能</div>
              <div className="text-2xl font-bold mb-2">¥19/月</div>
              <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">订阅</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
