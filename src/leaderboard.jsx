import { useEffect, useState } from 'react';

function Leaderboard() {
  const [data30, setData30] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("📡 Fetching 30D leaderboard data...");
        const res30 = await fetch(
          'https://hub.kaito.ai/api/v1/gateway/ai/kol/mindshare/top-leaderboard?duration=30d&topic_id=OVERTAKE&top_n=100&customized_community=customized&community_yaps=true'
        );
        const json30 = await res30.json();
        console.log("🧪 raw res30 json:", json30);
        setData30(json30 || []);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = searchTerm
    ? data30.filter((item) =>
        item.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data30;

  return (
    <div style={{ padding: '20px' }}>
      <h1>🏆 OVERTAKE Mindshare Leaderboard (30D)</h1>

      <input
        type="text"
        placeholder="Search by username"
        id="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ margin: '10px 0', padding: '6px', width: '100%' }}
      />

      <h2>30D Leaderboard</h2>

      {filteredData.length === 0 ? (
        <p>You are not in top 100 leaderboard for 30D. Time to Yap more!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Profile</th>
              <th>Username</th>
              <th>User ID</th>
              <th>Mindshare</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'center' }}>{item.rank}</td>
                <td style={{ textAlign: 'center' }}>
                  <img
                    src={`https://unavatar.io/twitter/${item.username}`}
                    alt={item.username}
                    width="32"
                    height="32"
                    style={{ borderRadius: '50%' }}
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </td>
                <td>
                  <a
                    href={`https://twitter.com/${item.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{item.username || 'N/A'}
                  </a>
                </td>
                <td>{item.user_id}</td>
                <td>{(item.mindshare * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;