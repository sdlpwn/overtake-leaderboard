import { useEffect, useState } from "react";

function Leaderboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("rank");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetch(
      "https://hub.kaito.ai/api/v1/gateway/ai/kol/mindshare/top-leaderboard?duration=30d&topic_id=OVERTAKE&top_n=100&customized_community=customized&community_yaps=true"
    )
      .then((res) => res.json())
      .then((json) => {
        console.log("📦 API 응답 데이터:", json);
        setData(json);
      });
  }, []);

  const filteredData = data
    .filter((item) =>
      item.username.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        🏆 OVERTAKE Mindshare Leaderboard (30일)
      </h1>

      <input
        type="text"
        placeholder="Search username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
      />

      {filteredData.length === 0 && (
        <div className="text-center text-red-600 font-semibold my-4">
          🛑 You are not in the 100th leaderboard for 30D. Time to Yap more!
        </div>
      )}

      {filteredData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="cursor-pointer px-2 py-2 border"
                  onClick={() => handleSort("rank")}
                >
                  Rank {sortKey === "rank" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-2 py-2 border">Profile</th>
                <th className="px-2 py-2 border">Username</th>
                <th
                  className="cursor-pointer px-2 py-2 border"
                  onClick={() => handleSort("mindshare")}
                >
                  Mindshare %
                  {sortKey === "mindshare" && (sortOrder === "asc" ? " ▲" : " ▼")}
                </th>
                <th
                  className="cursor-pointer px-2 py-2 border"
                  onClick={() => handleSort("community_score")}
                >
                  Community Score
                  {sortKey === "community_score" && (sortOrder === "asc" ? " ▲" : " ▼")}
                </th>
                <th
                  className="cursor-pointer px-2 py-2 border"
                  onClick={() => handleSort("last_30_day_avg_llm_insightfulness_score_scaled")}
                >
                  LLM Score
                  {sortKey === "last_30_day_avg_llm_insightfulness_score_scaled" &&
                    (sortOrder === "asc" ? " ▲" : " ▼")}
                </th>
                <th
                  className="cursor-pointer px-2 py-2 border"
                  onClick={() => handleSort("last_30_day_avg_originality_score_scaled")}
                >
                  Originality Score
                  {sortKey === "last_30_day_avg_originality_score_scaled" &&
                    (sortOrder === "asc" ? " ▲" : " ▼")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.user_id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1 text-center">{item.rank}</td>
                  <td className="border px-2 py-1 text-center">
                    <img
                      src={item.icon}
                      alt="icon"
                      className="w-6 h-6 rounded-full mx-auto"
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <a
                      href={item.twitter_user_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      @{item.username}
                    </a>
                  </td>
                  <td className="border px-2 py-1 text-center">{item.mindshare.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-center">
                    {item.community_score.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {item.last_30_day_avg_llm_insightfulness_score_scaled.toFixed(0)}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {item.last_30_day_avg_originality_score_scaled.toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;