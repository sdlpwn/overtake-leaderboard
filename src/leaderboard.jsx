import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('rank');

  useEffect(() => {
    fetch(
      'https://hub.kaito.ai/api/v1/gateway/ai/kol/mindshare/top-leaderboard?duration=30d&topic_id=OVERTAKE&top_n=100&customized_community=customized&community_yaps=true'
    )
      .then((res) => res.json())
      .then((data) => {
        setLeaders(data);
      })
      .catch((err) => {
        console.error('❌ API 호출 실패:', err);
      });
  }, []);

  const filteredLeaders = leaders
    .filter((user) => {
      const lowerTerm = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(lowerTerm) ||
        user.username?.toLowerCase().includes(lowerTerm)
      );
    })
    .sort((a, b) => {
      if (sortKey === 'rank') return parseInt(a.rank) - parseInt(b.rank);
      return b[sortKey] - a[sortKey];
    });

  const getRankEmoji = (rank) => {
    if (rank === '1') return '🥇';
    if (rank === '2') return '🥈';
    if (rank === '3') return '🥉';
    return `#${rank}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏆 OVERTAKE Mindshare Leaderboard (30일)</h1>

      {/* 검색 + 정렬 */}
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="유저 이름 또는 @아이디 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.search}
        />
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} style={styles.select}>
          <option value="rank">🔢 순위순</option>
          <option value="mindshare">🧠 Mindshare</option>
          <option value="community_score">🌐 영향력 점수</option>
          <option value="last_30_day_avg_llm_insightfulness_score_scaled">🤖 LLM 분석 점수</option>
          <option value="last_30_day_avg_originality_score_scaled">🎨 창의성 점수</option>
        </select>
      </div>

      {/* 카드 리스트 */}
      <div style={styles.grid}>
        {filteredLeaders.map((user) => (
          <div key={user.user_id || user.username} style={styles.card}>
            <div style={styles.header}>
              <div style={styles.rank}>{getRankEmoji(user.rank)}</div>
              <img
                src={user.icon}
                alt={user.username}
                width={48}
                height={48}
                style={styles.avatar}
              />
              <div>
                <div style={styles.name}>{user.name}</div>
                <div style={styles.username}>@{user.username}</div>
              </div>
            </div>
            <div style={styles.stats}>
              🧠 <strong>Mindshare:</strong> {(user.mindshare * 100).toFixed(2)}%<br />
              🌐 <strong>영향력:</strong> {user.community_score.toFixed(2)}<br />
              🤖 <strong>LLM:</strong> {user.last_30_day_avg_llm_insightfulness_score_scaled}/100<br />
              🎨 <strong>창의성:</strong> {user.last_30_day_avg_originality_score_scaled}/100
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1rem',
    fontFamily: 'sans-serif',
    background: '#f8f9fa',
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  search: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100%',
    maxWidth: '400px',
    fontSize: '16px',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #aaa',
    fontSize: '15px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#fff',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  rank: {
    fontSize: '20px',
    width: '36px',
  },
  avatar: {
    borderRadius: '50%',
    marginRight: '12px',
  },
  name: {
    fontWeight: 'bold',
    fontSize: '16px',
  },
  username: {
    color: '#555',
    fontSize: '14px',
  },
  stats: {
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.6',
    paddingLeft: '4px',
  },
};