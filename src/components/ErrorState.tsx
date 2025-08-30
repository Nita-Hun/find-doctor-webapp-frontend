export default function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-red-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
        <button
          onClick={onRetry}
          className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
        >
          Retry
        </button>
      </div>
    </div>
  );
}