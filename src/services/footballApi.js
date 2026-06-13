

export const scorePaths = {
  home: [
    'scores.home',
    'score.home',
    'goals.home',
    'homeScore',
    'home.score',
    'homeTeam.score',
    'teams.home.score',
    'score.fullTime.home',
    'score.current.home',
    'status.homeScore',
    'status.score.home',
  ],
  away: [
    'scores.away',
    'score.away',
    'goals.away',
    'awayScore',
    'away.score',
    'awayTeam.score',
    'teams.away.score',
    'score.fullTime.away',
    'score.current.away',
    'status.awayScore',
    'status.score.away',
  ],
}

export const getMatchEventId = (match) =>
  getMatchValue(
    match,
    [
      'id',
      'eventId',
      'eventid',
      'event_id',
      'matchId',
      'fixture.id',
      'fixture.eventId',
      'detail.matchId',
    ],
    '',
  )


export const getTeamLogo = (match, side) => {
  const sidePaths = {
    home: [
      'home.logo',
      'home.image',
      'home.crest',
      'homeTeam.logo',
      'homeTeam.image',
      'homeTeam.crest',
      'teams.home.logo',
      'teams.home.image',
      'teams.home.crest',
      'home.logoUrl',
      'homeTeam.logoUrl',
      'teams.home.logoUrl',
    ],
    away: [
      'away.logo',
      'away.image',
      'away.crest',
      'awayTeam.logo',
      'awayTeam.image',
      'awayTeam.crest',
      'teams.away.logo',
      'teams.away.image',
      'teams.away.crest',
      'away.logoUrl',
      'awayTeam.logoUrl',
      'teams.away.logoUrl',
    ],
  }

  const url = getImageValue(match, sidePaths[side] || [])
  if (url) return url

  const teamId = getMatchValue(match, [`${side}.id`, `${side}Team.id`, `teams.${side}.id`])
  if (teamId && teamId !== 'TBD') {
    return `https://images.fotmob.com/image_resources/logo/teamlogo/${teamId}.png`
  }

  return ''
}
