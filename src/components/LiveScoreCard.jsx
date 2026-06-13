
const teamPaths = {
  home: ['home.name', 'homeTeam.name', 'teams.home.name', 'homeTeam', 'home'],
  away: ['away.name', 'awayTeam.name', 'teams.away.name', 'awayTeam', 'away'],
};

function TeamLogo({ logo, name }) {
  return (
    <div className={s.teamLogoContainer}>
      {logo ? (
        <img src={logo} alt={`${name} logo`} className={s.teamLogoImg} />
      ) : (
        name.slice(0, 3).toUpperCase()
      )}
    </div>
  );
}

export default function LiveScoreCard({ match }) {
  const homeTeam = getMatchValue(match, teamPaths.home);
  const awayTeam = getMatchValue(match, teamPaths.away);
  const homeLogo = getTeamLogo(match, 'home');
  const awayLogo = getTeamLogo(match, 'away');
  const homeScore = getMatchValue(match, scorePaths.home, '0');
  const awayScore = getMatchValue(match, scorePaths.away, '0');
  const league = getMatchLeague(match);
  const matchTime = getMatchValue(match, ['minute', 'time.elapsed', 'status.elapsed'], getMatchStatus(match));

}
