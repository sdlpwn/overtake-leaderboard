'use client'
import { useEffect, useState } from 'react';

const API_7D = "https://hub.kaito.ai/api/v1/gateway/ai/kol/mindshare/top-leaderboard?duration=7d&topic_id=OVERTAKE&top_n=100&customized_community=customized&community_yaps=true";
const API_30D = "https://hub.kaito.ai/api/v1/gateway/ai/kol/mindshare/top-leaderboard?duration=30d&topic_id=OVERTAKE&top_n=100&customized_community=customized&community_yaps=true";

const sortOptions = [
  { value: 'community_score', label: 'Score' },
  { value: 'last_7_normalized_mention_score', label: 'Mentions' },
  { value: 'smart_follower_count', label: 'Smart Followers' },
  { value: 'last_7_day_avg_llm_insightfulness_score_scaled', label: 'LLM Insight' },
  { value: 'last_7_day_avg_originality_score_scaled', label: 'Originality' },
];

const PAGE_SIZE = 20;

export default function Leaderboard() {
  const [duration, setDuration] = useState('7d');
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('community_score');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const url = duration === '7d' ? API_7D : API_30D;

    try {
      const res = await fetch(url);
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
      } else {
        throw new Error('API 응답이 배열이 아닙니다.');
      }
    } catch (err) {
      setError('리더보드를 불러오지 못했습니다.');
      setData([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    setVisibleCount(PAGE_SIZE);
  }, [duration]);

  const filteredData = data
    .filter(item => {
      const q = searchQuery.toLowerCase();
      return (
        item.name?.toLowerCase().includes(q) ||
        item.username?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const aVal = Number(a[sortKey]) || 0;
      const bVal = Number(b[sortKey]) || 0;
      return bVal - aVal;
    });

  const visibleData = filteredData.slice(0, visibleCount);

  const getCardStyle = (idx) => {
    const base = 'p-4 rounded-xl shadow-md transition-transform duration-200 ease-in-out';
    const hover = 'hover:scale-[1.02] hover:ring-2 hover:ring-white hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]';
    const topColors = ['bg-yellow-600', 'bg-gray-500', 'bg-amber-800'];
    const color = topColors[idx] || 'bg-gray-800';
    return `${base} ${color} ${idx < 3 ? hover : ''}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-300';
    if (score >= 70) return 'text-yellow-300';
    return 'text-gray-300';
  };

  const getSortLabel = (value) => sortOptions.find(opt => opt.value === value)?.label || '';

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-4">🏁 OVERTAKE Yapping Leaderboard</h1>

      <p className="text-sm text-gray-400 mb-4">
        Sorted by: <span className="text-[#0018FF] font-semibold">{getSortLabel(sortKey)}</span>
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setDuration('7d')}
            className={`px-4 py-2 rounded ${duration === '7d' ? 'bg-[#0018FF]' : 'bg-gray-700'} hover:opacity-90`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDuration('30d')}
            className={`px-4 py-2 rounded ${duration === '30d' ? 'bg-[#0018FF]' : 'bg-gray-700'} hover:opacity-90`}
          >
            Last 30 Days
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by name or username"
          className="w-full sm:w-64 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="w-full sm:w-52 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && visibleData.length === 0 && (
        <div className="text-center mt-12 text-gray-400 text-lg">
          🐣 <span className="text-xl font-semibold">It's time to Yap more</span>
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        {visibleData.map((item, idx) => (
          <div key={idx} className={getCardStyle(idx)}>
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold w-6">{idx + 1}</span>
              <img
                src={item.icon}
                alt={`${item.name} profile`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <a
                  href={item.twitter_user_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-[#0018FF]"
                >
                  {item.name}
                </a>
                <span className="text-sm text-gray-300">@{item.username}</span>
              </div>
              <div className={`ml-auto text-sm font-medium ${getScoreColor(item[sortKey])}`}>
                {Number(item[sortKey])?.toFixed(2)}
              </div>
            </div>

            <div className="mt-3 text-sm grid grid-cols-2 gap-2 text-gray-200">
              <div>🧠 LLM Insight: {item.last_7_day_avg_llm_insightfulness_score_scaled}</div>
              <div>✨ Originality: {item.last_7_day_avg_originality_score_scaled}</div>
              <div>📣 Mentions: {item.last_7_normalized_mention_score}</div>
              <div>🤖 Smart Followers: {item.smart_follower_count}</div>
              <div>👥 Followers: {item.follower_count.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredData.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
            className="px-6 py-2 rounded bg-[#0018FF] hover:bg-[#0018FFcc] text-white"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}