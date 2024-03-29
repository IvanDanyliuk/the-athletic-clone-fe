import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, styled 
} from '@mui/material';
import { v4 as uuid } from 'uuid';
import { AppDispatch } from '../../../features/store';
import { getSchedule } from '../../../features/schedules/asyncActions';
import { countStandingTableData, getCurrentSeasonValue } from '../../utils/helpers';
import { clearSchedule } from '../../../features/schedules/reducers';
import { selectCompetition } from '../../../features/competitions/selectors';
import { selectSchedule } from '../../../features/schedules/selectors';
import LatestGamesScores from './LatestGamesScores';
import { StandingItem } from '../../../features/competitions/types';
import { ClubLabel } from '../ui';


const CustomCell = styled(TableCell)`
  min-width: 10em;
`;

const Cell = styled(TableCell)`
  @media (max-width: 640px) {
    font-size: .8em;
  }
`;


const CompetitionStandings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const currentSeason = getCurrentSeasonValue();
  const league = useSelector(selectCompetition);
  const schedule = useSelector(selectSchedule);

  const [standings, setStandings] = useState<StandingItem[]>([]);

  useEffect(() => {
    if(schedule) {
      const standing = countStandingTableData(schedule);
      setStandings(standing);
    }
  }, [schedule]);

  useEffect(() => {
    dispatch(getSchedule({ season: currentSeason, leagueId: league?._id! }));
    return () => { dispatch(clearSchedule()) }
  }, [currentSeason, league, dispatch]);

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <CustomCell>Team</CustomCell>
            <TableCell>GP</TableCell>
            <TableCell>W</TableCell>
            <TableCell>L</TableCell>
            <TableCell>D</TableCell>
            <TableCell>GF</TableCell>
            <TableCell>GA</TableCell>
            <TableCell>GD</TableCell>
            <TableCell>PTS</TableCell>
            <CustomCell></CustomCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {standings.map(item => (
            <TableRow key={uuid()}>
              <CustomCell>
                <ClubLabel 
                  logo={item.club.clubLogoUrl} 
                  name={item.club.commonName} 
                  clubId={item.club._id} 
                  altText={item.club.shortName} 
                />
              </CustomCell>
              <Cell>{item.playedMatches}</Cell>
              <Cell>{item.wins}</Cell>
              <Cell>{item.loses}</Cell>
              <Cell>{item.draws}</Cell>
              <Cell>{item.goalsFor}</Cell>
              <Cell>{item.goalsAgainst}</Cell>
              <Cell>{item.goalDifference}</Cell>
              <Cell>{item.points}</Cell>
              <CustomCell>
                <LatestGamesScores scores={item.latestGames} />
              </CustomCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CompetitionStandings;