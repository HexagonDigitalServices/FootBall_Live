import { fetchMatchLocation, getMatchValue } from "../services/footballApi";

export const teamNamePaths = {
  home: ["home.name", "homeTeam.name", "teams.home.name", "homeTeam", "home"],
  away: ["away.name", "awayTeam.name", "teams.away.name", "awayTeam", "away"],
};

export const timingPaths = ["time", "kickoff", "fixture.date", "matchTime", "date"];
export const venuePaths = ["venue.name", "stadium.name", "ground.name", "venue", "stadium"];

export function getTeams(match) {
  return {
    home: getMatchValue(match, teamNamePaths.home),
    away: getMatchValue(match, teamNamePaths.away),
  };
}

export function getLocationText(locationData, fallback) {
  const source = locationData?.detail || locationData;
  const name = getMatchValue(
    source,
    [
      "location.name",
      "venue.name",
      "stadium.name",
      "ground.name",
      "location",
      "venue",
      "stadium",
      "ground",
      "address",
      "city",
      "country",
    ],
    "",
  );
  const lat = getMatchValue(source, ["lat", "latitude", "location.lat"], "");
  const lng = getMatchValue(
    source,
    ["lng", "lon", "long", "longitude", "location.lng", "location.longitude"],
    "",
  );

  return name || (lat && lng ? `${lat}, ${lng}` : fallback);
}

export async function getMatchLocation(eventId, fallbackVenue, isActive) {
  const locationData = await fetchMatchLocation(eventId);
  return isActive() ? getLocationText(locationData, fallbackVenue) : null;
}
