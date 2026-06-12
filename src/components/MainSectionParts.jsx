import {
  BarChart3,
  CalendarDays,
  Clock,
  Eye,
  MapPin,
  Radio,
  Search,
  Shield,
  Trophy,
  X,
} from "lucide-react";
import LiveScoreCard from "./LiveScoreCard";
import {
  getMatchEventId,
  getMatchLeague,
  getMatchScore,
  getMatchStatus,
  getMatchValue,
  getTeamLogo,
} from "../services/footballApi";
import { getTeams, timingPaths } from "./MainSectionUtils";
import { mainSectionStyles as s } from "../assets/dummyStyles";

const dateOptions = [
  ["Yesterday", -1],
  ["Today", 0],
  ["Tomorrow", 1],
];
const leagueNamePaths = ["name", "league.name", "team.name", "title"];
const leagueMetaPaths = ["country.name", "country", "region", "type"];
const statusChecks = {
  live: ["live", "progress", "half"],
  finished: ["full", "finish", "ended"],
};

function getStatusKind(match) {
  const status = getMatchStatus(match).toLowerCase();
  if (statusChecks.live.some((word) => status.includes(word))) return "live";
  if (statusChecks.finished.some((word) => status.includes(word)) || status === "ft") {
    return "finished";
  }
  return "upcoming";
}

function getScheduleStatus(match, offset) {
  return getMatchStatus(match, "") || (offset < 0 ? "Result pending" : "Scheduled");
}

function getSummary(matches) {
  return matches.reduce((counts, match) => {
    counts[getStatusKind(match)] += 1;
    return counts;
  }, { live: 0, finished: 0, upcoming: 0 });
}

function SectionTitle({ label, title, icon: Icon }) {
  return (
    <div className={s.sectionTitleWrapper}>
      <span className={s.sectionTitleLabel}>
        {Icon && <Icon size={12} />}
        {label}
      </span>
      <h2 className={s.sectionTitleH2}>{title}</h2>
    </div>
  );
}

function TeamBadge({ logo, name, size = "md" }) {
  const sizeClass = {
    sm: s.teamBadgeSizeSm,
    md: s.teamBadgeSizeMd,
    lg: s.teamBadgeSizeLg,
  }[size];

  return (
    <div className={`${s.teamBadgeBase} ${sizeClass}`}>
      {logo ? (
        <img src={logo} alt={`${name} logo`} className={s.teamBadgeImg} />
      ) : (
        name.slice(0, 3).toUpperCase()
      )}
    </div>
  );
}

function TeamColumn({ match, side, name, badgeSize, className, nameClass, nameTag: Name = "span" }) {
  return (
    <div className={className}>
      <TeamBadge logo={getTeamLogo(match, side)} name={name} size={badgeSize} />
      <Name className={nameClass}>{name}</Name>
    </div>
  );
}

function MatchTeams({
  match,
  badgeSize = "md",
  centerClass = "flex justify-center",
  columnClass,
  gridClass,
  nameTag,
  scoreClass,
  teamClass,
  vsClass,
}) {
  const teams = getTeams(match);
  const score = getMatchScore(match);

  return (
    <div className={gridClass}>
      <TeamColumn
        match={match}
        side="home"
        name={teams.home}
        badgeSize={badgeSize}
        className={columnClass}
        nameClass={teamClass}
        nameTag={nameTag}
      />
      <div className={centerClass}>
        <span className={score.hasScore ? scoreClass : vsClass}>{score.display}</span>
      </div>
      <TeamColumn
        match={match}
        side="away"
        name={teams.away}
        badgeSize={badgeSize}
        className={columnClass}
        nameClass={teamClass}
        nameTag={nameTag}
      />
    </div>
  );
}

function FeaturedMatch({ match, loading, summary, onViewMatch }) {
  if (!match) {
    return (
      <p className={s.featuredEmpty}>
        {loading ? "Loading match center..." : "No match data available."}
      </p>
    );
  }

  const status = getMatchStatus(match);
  const summaryText = summary.live
    ? `${summary.live} live now`
    : `${summary.finished} final, ${summary.upcoming} upcoming`;

  return (
    <div className="relative">
      <div className={s.featuredTopline}>
        <div className={s.featuredStatus}>
          <div className={s.featuredLiveDot} />
          <p className={s.featuredStatusText}>{status}</p>
        </div>
        <button type="button" className={s.featuredViewButton} onClick={() => onViewMatch(match, status)}>
          <Eye size={14} />
          View
        </button>
      </div>

      <MatchTeams
        match={match}
        badgeSize="lg"
        centerClass="flex flex-col items-center gap-1"
        columnClass={s.featuredTeamColumn}
        gridClass={s.featuredTeamsGrid}
        nameTag="p"
        scoreClass={s.featuredScore}
        teamClass={s.featuredTeamName}
        vsClass={s.featuredVs}
      />

      <div className={s.featuredInsightGrid}>
        {[
          [Trophy, getMatchLeague(match)],
          [Clock, getMatchValue(match, timingPaths, "Kickoff TBC")],
          [BarChart3, summaryText],
        ].map(([Icon, text]) => (
          <div key={text} className={s.featuredInsightItem}>
            <Icon size={15} />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchCenterStats({ matches, summary }) {
  return (
    <div className={s.matchCenterStatsGrid}>
      {[
        ["Tracked", matches.length],
        ["Live", summary.live],
        ["Finals", summary.finished],
        ["Upcoming", summary.upcoming],
      ].map(([label, value]) => (
        <div key={label} className={s.matchCenterStatCard}>
          <span className={s.matchCenterStatValue}>{value}</span>
          <span className={s.matchCenterStatLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function SideMatchCard({ match, onViewMatch }) {
  const teams = getTeams(match);
  const score = getMatchScore(match);

  return (
    <div className={s.sideMatchCard}>
      <div className={s.sideMatchBadges}>
        {["home", "away"].map((side) => (
          <TeamBadge key={side} logo={getTeamLogo(match, side)} name={teams[side]} size="sm" />
        ))}
      </div>
      <div className={s.sideMatchInfo}>
        <p className={s.sideMatchTitle}>
          {teams.home} vs {teams.away}
        </p>
        <p className={s.sideMatchLeague}>{getMatchLeague(match)}</p>
      </div>
      <button type="button" className={s.sideMatchStatus} onClick={() => onViewMatch(match)}>
        {score.hasScore ? score.display : getMatchStatus(match)}
      </button>
    </div>
  );
}

export function MatchCenter({ matches, loading, onViewMatch }) {
  const summary = getSummary(matches);

  return (
    <section id="match-center" className={s.matchCenterSection}>
      <SectionTitle label="Featured" title="Match Center" icon={Shield} />
      <div className={s.matchCenterGrid}>
        <div className={s.featuredCard}>
          <div className={s.featuredCardGlow1} />
          <div className={s.featuredCardGlow2} />
          <FeaturedMatch match={matches[0]} loading={loading} summary={summary} onViewMatch={onViewMatch} />
        </div>

        <div className={s.sideMatchesGrid}>
          <MatchCenterStats matches={matches} summary={summary} />
          {matches.slice(1, 5).map((match, index) => (
            <SideMatchCard key={match.id || index} match={match} onViewMatch={onViewMatch} />
          ))}
          {!matches.length && (
            <div className={s.sideEmpty}>{loading ? "Loading matches..." : "No matches available."}</div>
          )}
        </div>
      </div>
    </section>
  );
}

export function MatchDetailsPanel({ selection, location, onClose }) {
  if (!selection?.match) return null;

  const { match, statusLabel } = selection;
  const teams = getTeams(match);
  const score = getMatchScore(match);
  const eventId = getMatchEventId(match);

  return (
    <div className={s.matchDialogBackdrop} role="dialog" aria-modal="true">
      <div className={s.matchDialog}>
        <div className={s.matchDialogHeader}>
          <div>
            <p className={s.matchDialogKicker}>{getMatchLeague(match)}</p>
            <h3 className={s.matchDialogTitle}>
              {teams.home} vs {teams.away}
            </h3>
          </div>
          <button type="button" className={s.matchDialogClose} onClick={onClose} aria-label="Close match details">
            <X size={18} />
          </button>
        </div>

        <div className={s.matchDialogScoreGrid}>
          <TeamColumn match={match} side="home" name={teams.home} badgeSize="lg" className={s.matchDialogTeam} />
          <div className={s.matchDialogScore}>
            <span>{score.display}</span>
            <small>{statusLabel || getMatchStatus(match)}</small>
          </div>
          <TeamColumn match={match} side="away" name={teams.away} badgeSize="lg" className={s.matchDialogTeam} />
        </div>

        <div className={s.matchDialogFacts}>
          {[
            [MapPin, location],
            [Clock, getMatchValue(match, timingPaths, "Kickoff TBC")],
            eventId && [Eye, `Event ${eventId}`],
          ].filter(Boolean).map(([Icon, text]) => (
            <div key={text} className={s.matchDialogFact}>
              <Icon size={16} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LiveScores({ matches, loading, empty }) {
  return (
    <section id="live" className={s.liveSection}>
      <SectionTitle label="Live Now" title="Live Scores" icon={Radio} />
      <div className={s.liveGrid}>
        {matches.length
          ? matches.slice(0, 6).map((match, index) => (
              <LiveScoreCard key={match.id || index} match={match} />
            ))
          : empty("No live matches returned right now.", loading)}
      </div>
    </section>
  );
}

function StandingsRow({ row, index }) {
  return (
    <div className={s.standingsRow}>
      <span className={s.standingsRank}>{index + 1}</span>
      <div className={s.standingsTeamInfo}>
        <p className={s.standingsTeamName}>{getMatchValue(row, leagueNamePaths)}</p>
        <p className={s.standingsTeamMeta}>{getMatchValue(row, leagueMetaPaths, "Popular league")}</p>
      </div>
      <Trophy className={s.standingsTrophy} size={18} />
    </div>
  );
}

export function Standings({ leagues, loading, empty }) {
  return (
    <section id="standings" className={s.standingsSection}>
      <SectionTitle label="Standings" title="League Standings" icon={Trophy} />
      <div className={s.standingsCard}>
        {leagues.length
          ? leagues.slice(0, 8).map((row, index) => (
              <StandingsRow key={row.id || index} row={row} index={index} />
            ))
          : empty("No league table data available.", loading)}
      </div>
    </section>
  );
}

function FixtureCard({ match, dateOffset, onViewMatch }) {
  const status = getScheduleStatus(match, dateOffset);

  return (
    <div className={s.fixtureCard}>
      <MatchTeams
        match={match}
        columnClass={s.fixtureTeamColumn}
        gridClass={s.fixtureTeamsGrid}
        scoreClass={s.fixtureScore}
        teamClass={s.fixtureTeamName}
        vsClass={s.fixtureVs}
      />
      <div className={s.fixtureInfo}>
        <p className={s.fixtureLeague}>{getMatchLeague(match)}</p>
        <p className={s.fixtureDate}>{status}</p>
      </div>
      <div className="text-center">
        <button type="button" className={s.ticketButton} onClick={() => onViewMatch(match, status)}>
          <Eye size={13} />
          View
        </button>
      </div>
    </div>
  );
}

export function Fixtures({
  dateOffset,
  fixtures,
  loading,
  searchQuery,
  setDateOffset,
  setSearchQuery,
  onViewMatch,
  empty,
}) {
  const noMatchesText = searchQuery
    ? `No teams matching "${searchQuery}" found on this date.`
    : "No matches found.";

  return (
    <section id="fixtures" className={s.fixturesSection}>
      <SectionTitle label="Schedule" title="Match Schedule" icon={CalendarDays} />
      <div className={s.fixturesControls}>
        <div className={s.datePills}>
          {dateOptions.map(([label, val]) => (
            <button
              key={val}
              type="button"
              onClick={() => setDateOffset(val)}
              disabled={loading}
              className={`${s.dateButtonBase} ${dateOffset === val ? s.dateButtonActive : s.dateButtonInactive}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={s.searchWrapper}>
          <div className={s.searchIcon}>
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      {loading ? (
        empty("Fetching matches for selected date...", loading)
      ) : (
        <div className={s.fixturesGrid}>
          {fixtures.length
            ? fixtures.slice(0, 12).map((match, index) => (
                <FixtureCard key={match.id || index} match={match} dateOffset={dateOffset} onViewMatch={onViewMatch} />
              ))
            : empty(noMatchesText)}
        </div>
      )}
    </section>
  );
}
