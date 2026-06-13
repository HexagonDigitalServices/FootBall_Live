

const HERO_VIDEO_URL = 'https://res.cloudinary.com/difec9hcv/video/upload/v1781251693/kling_20260612_Image_to_Video__870_0_ws177m.mp4';

const teamNamePaths = {
  home: ['home.name', 'homeTeam.name', 'teams.home.name', 'homeTeam', 'home'],
  away: ['away.name', 'awayTeam.name', 'teams.away.name', 'awayTeam', 'away'],
};

function RealTeamBadge({ logo, name, featured }) {
  return (
    <div className={`${s.badgeBase} ${featured ? s.badgeFeatured : s.badgeDefault}`}>
      {logo ? (
        <img src={logo} alt={`${name} logo`} className={s.badgeLogo} />
      ) : (
        <span className={featured ? s.badgeFallbackFeatured : s.badgeFallbackDefault}>
          {name.slice(0, 3).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function MatchRow({ match, featured = false }) {
  if (!match) return null;

  const home = getMatchValue(match, teamNamePaths.home);
  const away = getMatchValue(match, teamNamePaths.away);
  const homeLogo = getTeamLogo(match, 'home');
  const awayLogo = getTeamLogo(match, 'away');
  const matchDate = getMatchValue(match, ['time', 'status.long', 'status', 'date'], 'Upcoming');

  return (
    <div className={featured ? s.matchRowFeatured : s.matchRowDefault}>
      {!featured && (
        <p className={s.matchDate}>{matchDate}</p>
      )}
      <div className="flex items-center justify-between gap-2">
        <div className={s.teamColumn}>
          <RealTeamBadge logo={homeLogo} name={home} featured={featured} />
          <span className={`${s.teamNameBase} ${featured ? s.teamNameFeatured : s.teamNameDefault}`}>
            {home}
          </span>
        </div>
        <span className={`${s.vsBase} ${featured ? s.vsFeatured : s.vsDefault}`}>vs</span>
        <div className={s.teamColumn}>
          <RealTeamBadge logo={awayLogo} name={away} featured={featured} />
          <span className={`${s.teamNameBase} ${featured ? s.teamNameFeatured : s.teamNameDefault}`}>
            {away}
          </span>
        </div>
        {!featured && (
          <button className={s.matchButton} aria-label="Open match">
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label, loading }) {
  return (
    <div className="min-w-0">
      <p className={s.statValue}>
        {loading ? <Loader2 className="size-8 animate-spin" /> : value}
      </p>
      <p className={s.statLabel}>{label}</p>
    </div>
  );
}

