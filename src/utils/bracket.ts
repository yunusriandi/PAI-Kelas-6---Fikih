/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Team, TournamentMatch } from '../types/game';

/**
 * Generates single-elimination tournament structure supporting 2 to 8 teams with clean BYE support.
 */
export function generateBracket(teams: Team[], shuffle: boolean = false): TournamentMatch[] {
  let orderedTeams = [...teams];
  if (shuffle) {
    orderedTeams.sort(() => Math.random() - 0.5);
  }

  const numTeams = orderedTeams.length;
  if (numTeams < 2) return [];

  // 2 Teams: Direct Final
  if (numTeams === 2) {
    return [
      {
        id: 'match-final',
        round: 1,
        roundName: 'Babak Final',
        matchIndex: 0,
        teamAId: orderedTeams[0].id,
        teamBId: orderedTeams[1].id,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
    ];
  }

  // 3 Teams: 1 Semifinal (Team B vs Team C) while Team A gets Bye to Final
  if (numTeams === 3) {
    return [
      {
        id: 'match-sf-1',
        round: 1,
        roundName: 'Semifinal',
        matchIndex: 0,
        teamAId: orderedTeams[1].id,
        teamBId: orderedTeams[2].id,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      {
        id: 'match-final',
        round: 2,
        roundName: 'Babak Final',
        matchIndex: 0,
        teamAId: orderedTeams[0].id, // Bye directly in final
        teamBId: null,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
    ];
  }

  // 4 Teams: 2 Semifinals -> 1 Final
  if (numTeams === 4) {
    return [
      {
        id: 'match-sf-1',
        round: 1,
        roundName: 'Semifinal 1',
        matchIndex: 0,
        teamAId: orderedTeams[0].id,
        teamBId: orderedTeams[3].id,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      {
        id: 'match-sf-2',
        round: 1,
        roundName: 'Semifinal 2',
        matchIndex: 1,
        teamAId: orderedTeams[1].id,
        teamBId: orderedTeams[2].id,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      {
        id: 'match-final',
        round: 2,
        roundName: 'Babak Final',
        matchIndex: 0,
        teamAId: null,
        teamBId: null,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
    ];
  }

  // 5 Teams: Seed 4 vs 5 play in Round 1. Seeds 1, 2, 3 have byes to Semifinals.
  if (numTeams === 5) {
    return [
      // Round 1
      {
        id: 'match-r1-1',
        round: 1,
        roundName: 'Babak Penyisihan',
        matchIndex: 0,
        teamAId: orderedTeams[3].id,
        teamBId: orderedTeams[4].id,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      // Semifinals
      {
        id: 'match-sf-1',
        round: 2,
        roundName: 'Semifinal 1',
        matchIndex: 0,
        teamAId: orderedTeams[0].id, // Bye
        teamBId: null, // Winner of r1-1
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      {
        id: 'match-sf-2',
        round: 2,
        roundName: 'Semifinal 2',
        matchIndex: 1,
        teamAId: orderedTeams[1].id, // Bye
        teamBId: orderedTeams[2].id, // Bye
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      // Final
      {
        id: 'match-final',
        round: 3,
        roundName: 'Babak Final',
        matchIndex: 0,
        teamAId: null,
        teamBId: null,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
    ];
  }

  // 6 Teams (Default standard):
  // Seeds 1 & 2 get BYE to Semifinals
  // Round 1 (Quarterfinals):
  // Match Q1: Seed 4 vs Seed 5 -> winner plays Seed 1 in SF 1
  // Match Q2: Seed 3 vs Seed 6 -> winner plays Seed 2 in SF 2
  if (numTeams === 6) {
    return [
      // Round 1 (Penyisihan / Perempat Final)
      {
        id: 'match-qf-1',
        round: 1,
        roundName: 'Perempat Final 1',
        matchIndex: 0,
        teamAId: orderedTeams[3].id,
        teamBId: orderedTeams[4].id,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      {
        id: 'match-qf-2',
        round: 1,
        roundName: 'Perempat Final 2',
        matchIndex: 1,
        teamAId: orderedTeams[2].id,
        teamBId: orderedTeams[5].id,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      // Round 2 (Semifinals)
      {
        id: 'match-sf-1',
        round: 2,
        roundName: 'Semifinal 1',
        matchIndex: 0,
        teamAId: orderedTeams[0].id, // Seed 1 has bye
        teamBId: null, // Winner of QF 1
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      {
        id: 'match-sf-2',
        round: 2,
        roundName: 'Semifinal 2',
        matchIndex: 1,
        teamAId: orderedTeams[1].id, // Seed 2 has bye
        teamBId: null, // Winner of QF 2
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      // Round 3 (Final)
      {
        id: 'match-final',
        round: 3,
        roundName: 'Babak Final',
        matchIndex: 0,
        teamAId: null,
        teamBId: null,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
    ];
  }

  // 7 Teams: Seed 1 gets bye to SF1.
  if (numTeams === 7) {
    return [
      {
        id: 'match-qf-1',
        round: 1,
        roundName: 'Perempat Final 1',
        matchIndex: 0,
        teamAId: orderedTeams[3].id,
        teamBId: orderedTeams[4].id,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      {
        id: 'match-qf-2',
        round: 1,
        roundName: 'Perempat Final 2',
        matchIndex: 1,
        teamAId: orderedTeams[1].id,
        teamBId: orderedTeams[6].id,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      {
        id: 'match-qf-3',
        round: 1,
        roundName: 'Perempat Final 3',
        matchIndex: 2,
        teamAId: orderedTeams[2].id,
        teamBId: orderedTeams[5].id,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      {
        id: 'match-sf-1',
        round: 2,
        roundName: 'Semifinal 1',
        matchIndex: 0,
        teamAId: orderedTeams[0].id, // Seed 1 has bye
        teamBId: null, // Winner of QF 1
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      {
        id: 'match-sf-2',
        round: 2,
        roundName: 'Semifinal 2',
        matchIndex: 1,
        teamAId: null, // Winner QF 2
        teamBId: null, // Winner QF 3
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
      {
        id: 'match-final',
        round: 3,
        roundName: 'Babak Final',
        matchIndex: 0,
        teamAId: null,
        teamBId: null,
        duels: [],
        winnerId: null,
        isCompleted: false,
      },
    ];
  }

  // 8 Teams: 4 Quarterfinals -> 2 Semifinals -> 1 Final
  return [
    {
      id: 'match-qf-1',
      round: 1,
      roundName: 'Perempat Final 1',
      matchIndex: 0,
      teamAId: orderedTeams[0].id,
      teamBId: orderedTeams[7].id,
      duels: [],
      winnerId: null,
      isCompleted: false,
    },
    {
      id: 'match-qf-2',
      round: 1,
      roundName: 'Perempat Final 2',
      matchIndex: 1,
      teamAId: orderedTeams[3].id,
      teamBId: orderedTeams[4].id,
      duels: [],
      winnerId: null,
      isCompleted: false,
    },
    {
      id: 'match-qf-3',
      round: 1,
      roundName: 'Perempat Final 3',
      matchIndex: 2,
      teamAId: orderedTeams[1].id,
      teamBId: orderedTeams[6].id,
      duels: [],
      winnerId: null,
      isCompleted: false,
    },
    {
      id: 'match-qf-4',
      round: 1,
      roundName: 'Perempat Final 4',
      matchIndex: 3,
      teamAId: orderedTeams[2].id,
      teamBId: orderedTeams[5].id,
      duels: [],
      winnerId: null,
      isCompleted: false,
    },
    {
      id: 'match-sf-1',
      round: 2,
      roundName: 'Semifinal 1',
      matchIndex: 0,
      teamAId: null, // Winner QF 1
      teamBId: null, // Winner QF 2
      duels: [],
      winnerId: null,
      isCompleted: false,
    },
    {
      id: 'match-sf-2',
      round: 2,
      roundName: 'Semifinal 2',
      matchIndex: 1,
      teamAId: null, // Winner QF 3
      teamBId: null, // Winner QF 4
      duels: [],
      winnerId: null,
      isCompleted: false,
    },
    {
      id: 'match-final',
      round: 3,
      roundName: 'Babak Final',
      matchIndex: 0,
      teamAId: null,
      teamBId: null,
      duels: [],
      winnerId: null,
      isCompleted: false,
    },
  ];
}

/**
 * Propagates match winner to the next round in the bracket
 */
export function advanceBracket(matches: TournamentMatch[], matchId: string, winnerId: string): TournamentMatch[] {
  const updated = matches.map((m) => (m.id === matchId ? { ...m, winnerId, isCompleted: true } : m));
  const current = updated.find((m) => m.id === matchId);
  if (!current) return updated;

  const totalMatches = updated.length;

  // 2 Teams
  if (totalMatches === 1) return updated;

  // 3 Teams
  if (totalMatches === 2) {
    if (matchId === 'match-sf-1') {
      const final = updated.find((m) => m.id === 'match-final');
      if (final) final.teamBId = winnerId;
    }
    return [...updated];
  }

  // 4 Teams (2 SF -> 1 Final)
  if (totalMatches === 3) {
    const final = updated.find((m) => m.id === 'match-final');
    if (final) {
      if (matchId === 'match-sf-1') final.teamAId = winnerId;
      if (matchId === 'match-sf-2') final.teamBId = winnerId;
    }
    return [...updated];
  }

  // 5 Teams (1 R1, 2 SF, 1 Final)
  if (totalMatches === 4) {
    if (matchId === 'match-r1-1') {
      const sf1 = updated.find((m) => m.id === 'match-sf-1');
      if (sf1) sf1.teamBId = winnerId;
    } else if (matchId === 'match-sf-1') {
      const final = updated.find((m) => m.id === 'match-final');
      if (final) final.teamAId = winnerId;
    } else if (matchId === 'match-sf-2') {
      const final = updated.find((m) => m.id === 'match-final');
      if (final) final.teamBId = winnerId;
    }
    return [...updated];
  }

  // 6 Teams (2 QF, 2 SF, 1 Final)
  if (totalMatches === 5) {
    if (matchId === 'match-qf-1') {
      const sf1 = updated.find((m) => m.id === 'match-sf-1');
      if (sf1) sf1.teamBId = winnerId;
    } else if (matchId === 'match-qf-2') {
      const sf2 = updated.find((m) => m.id === 'match-sf-2');
      if (sf2) sf2.teamBId = winnerId;
    } else if (matchId === 'match-sf-1') {
      const final = updated.find((m) => m.id === 'match-final');
      if (final) final.teamAId = winnerId;
    } else if (matchId === 'match-sf-2') {
      const final = updated.find((m) => m.id === 'match-final');
      if (final) final.teamBId = winnerId;
    }
    return [...updated];
  }

  // 7 Teams (3 QF, 2 SF, 1 Final)
  if (totalMatches === 6) {
    if (matchId === 'match-qf-1') {
      const sf1 = updated.find((m) => m.id === 'match-sf-1');
      if (sf1) sf1.teamBId = winnerId;
    } else if (matchId === 'match-qf-2') {
      const sf2 = updated.find((m) => m.id === 'match-sf-2');
      if (sf2) sf2.teamAId = winnerId;
    } else if (matchId === 'match-qf-3') {
      const sf2 = updated.find((m) => m.id === 'match-sf-2');
      if (sf2) sf2.teamBId = winnerId;
    } else if (matchId === 'match-sf-1') {
      const final = updated.find((m) => m.id === 'match-final');
      if (final) final.teamAId = winnerId;
    } else if (matchId === 'match-sf-2') {
      const final = updated.find((m) => m.id === 'match-final');
      if (final) final.teamBId = winnerId;
    }
    return [...updated];
  }

  // 8 Teams (4 QF, 2 SF, 1 Final)
  if (totalMatches === 7) {
    if (matchId === 'match-qf-1') {
      const sf1 = updated.find((m) => m.id === 'match-sf-1');
      if (sf1) sf1.teamAId = winnerId;
    } else if (matchId === 'match-qf-2') {
      const sf1 = updated.find((m) => m.id === 'match-sf-1');
      if (sf1) sf1.teamBId = winnerId;
    } else if (matchId === 'match-qf-3') {
      const sf2 = updated.find((m) => m.id === 'match-sf-2');
      if (sf2) sf2.teamAId = winnerId;
    } else if (matchId === 'match-qf-4') {
      const sf2 = updated.find((m) => m.id === 'match-sf-2');
      if (sf2) sf2.teamBId = winnerId;
    } else if (matchId === 'match-sf-1') {
      const final = updated.find((m) => m.id === 'match-final');
      if (final) final.teamAId = winnerId;
    } else if (matchId === 'match-sf-2') {
      const final = updated.find((m) => m.id === 'match-final');
      if (final) final.teamBId = winnerId;
    }
    return [...updated];
  }

  return updated;
}

/**
 * Calculates match winner based on duels:
 * Group wins match if winning >= 3 duels out of 5.
 * If tied, winner is determined by total combined duel score.
 */
export function determineMatchWinner(
  duels: TournamentMatch['duels'],
  teamAId: string,
  teamBId: string
): { winnerId: string; winsA: number; winsB: number; totalScoreA: number; totalScoreB: number } {
  let winsA = 0;
  let winsB = 0;
  let totalScoreA = 0;
  let totalScoreB = 0;

  duels.forEach((d) => {
    totalScoreA += d.scoreA;
    totalScoreB += d.scoreB;
    if (d.winner === 'A') winsA++;
    else if (d.winner === 'B') winsB++;
  });

  let winnerId = teamAId;
  if (winsA > winsB) {
    winnerId = teamAId;
  } else if (winsB > winsA) {
    winnerId = teamBId;
  } else {
    // Tiebreaker: total combined score
    if (totalScoreB > totalScoreA) {
      winnerId = teamBId;
    } else {
      winnerId = teamAId;
    }
  }

  return { winnerId, winsA, winsB, totalScoreA, totalScoreB };
}
