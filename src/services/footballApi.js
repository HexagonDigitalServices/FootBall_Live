

export const formatFootballDate = (addDays = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + addDays)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

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

export const getMatchScore = (match) => {
  const scoreLine = getMatchValue(
    match,
    ['status.scoreStr', 'scoreStr', 'scores.display', 'score.display'],
    '',
  )
  const home = getMatchValue(match, scorePaths.home, '')
  const away = getMatchValue(match, scorePaths.away, '')
  const hasPair = home !== '' && away !== ''

  if (hasPair) {
    return { home, away, display: `${home} - ${away}`, hasScore: true }
  }

  if (scoreLine) {
    return { home: '', away: '', display: scoreLine, hasScore: true }
  }

  return { home: '', away: '', display: 'VS', hasScore: false }
}

const statusPaths = ['status.long', 'status.short', 'status.type', 'status']

export const getMatchStatus = (match, fallback = 'Scheduled') => {
  const explicitStatus = getMatchValue(match, statusPaths, '')
  if (explicitStatus) return explicitStatus

  if (getMatchScore(match).hasScore) return 'Full Time'

  return getMatchValue(
    match,
    ['time', 'date'],
    fallback,
  )
}

export const getMatchLeague = (match) =>
  getMatchValue(
    match,
    ['league.name', 'competition.name', 'tournament.name', 'league'],
    'Competition',
  )

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

export const findArray = (value) => {
  if (Array.isArray(value)) return value
  if (!value || typeof value !== 'object') return []

  for (const item of Object.values(value)) {
    const found = findArray(item)
    if (found.length) return found
  }

  return []
}

export const cleanValue = (value, fallback = 'TBD') => {
  if (value === 0) return '0'
  if (!value) return fallback
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return value.name || value.title || value.shortName || fallback
}

export const getMatchValue = (item, paths, fallback = 'TBD') =>
  cleanValue(
    paths
      .map((path) => path.split('.').reduce((data, key) => data?.[key], item))
      .find((value) => value || value === 0),
    fallback,
  )

export const getImageValue = (item, paths) => {
  const value = paths
    .map((path) => path.split('.').reduce((data, key) => data?.[key], item))
    .find((candidate) => typeof candidate === 'string' && candidate.startsWith('http'))

  return value || ''
}

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

export const loadFootballDashboard = async () => {
  const requests = [
    ['live', api.get('/football-current-live')],
    ['leagues', api.get('/football-popular-leagues')],
    ['fixtures', api.get('/football-get-matches-by-date', { params: { date: formatFootballDate(0) } })],
  ]

  const settled = await Promise.allSettled(requests.map(([, request]) => request))
  const data = { live: [], leagues: [], fixtures: [] }

  settled.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      data[requests[index][0]] = findArray(result.value.data)
    }
  })

  return {
    data,
    hasPartialFailure: settled.some((result) => result.status === 'rejected'),
  }
}

export const fetchFixturesByDate = async (dateString) => {
  try {
    const response = await api.get('/football-get-matches-by-date', { params: { date: dateString } })
    return findArray(response.data)
  } catch (error) {
    console.error('Error fetching fixtures:', error)
    return []
  }
}

const unwrapApiResponse = (data) => data?.response || data?.data || data || {}

export const fetchMatchLocation = async (eventid) => {
  if (!eventid) return {}

  try {
    const response = await api.get('/football-get-match-location', { params: { eventid } })
    return unwrapApiResponse(response.data)
  } catch (error) {
    console.error('Error fetching match location:', error)
    return {}
  }
}
