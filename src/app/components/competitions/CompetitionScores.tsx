import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Tabs, styled } from '@mui/material';
import { v4 as uuid } from 'uuid';
import { AppDispatch } from '../../../features/store';
import { getCurrentSeasonValue, setNearestItems } from '../../utils/helpers';
import { getSchedule } from '../../../features/schedules/asyncActions';
import { selectCompetition } from '../../../features/competitions/selectors';
import { selectSchedule, selectSchedulesStatus } from '../../../features/schedules/selectors';
import { BackdropLoader, DataNotFoundMessage } from '../ui/';
import { IMatchweek } from '../../../features/schedules/types';
import { MatchweekPicker, MatchweekTable } from './';
import { clearSchedule } from '../../../features/schedules/reducers';
import { StateStatus } from '../../../features/types';


const SetMatchweekSection = styled(Box)`
  margin-bottom: 1em;
  display: flex;
  align-items: center;
`;

const CalendarContainer = styled(Box)`
  margin-left: 1em;
`;

const MatchweekTab = styled(Tab)`
  @media (max-width: 640px) {
    font-size: .8em;
  }
`;


const CompetitionScores: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const currentSeason = getCurrentSeasonValue();
  const league = useSelector(selectCompetition);
  const scheduleStatus = useSelector(selectSchedulesStatus);
  const activeSchedule = useSelector(selectSchedule);
  
  const [currentMatchweek, setCurrentMatchweek] = useState<IMatchweek | null>(null);
  const [tabs, setTabs] = useState<IMatchweek[]>([]);

  const handleCurrentMatchweekChange = (event: React.SyntheticEvent, currentMatchweek: IMatchweek) => {
    setCurrentMatchweek(currentMatchweek);
  };

  useEffect(() => {
    if(activeSchedule && currentMatchweek) {
      const tabsData = setNearestItems(activeSchedule.fixture, currentMatchweek._id!, 5);
      setTabs(tabsData);
    }
  }, [activeSchedule, currentMatchweek]);

  useEffect(() => {
    if(activeSchedule) {
      const currentDate = new Date().getTime();
      const mw = activeSchedule.fixture.reduce((prev, curr) => {
        const a = Math.abs(new Date(curr.basicDate).getTime() - currentDate);
        const b = Math.abs(new Date(prev.basicDate).getTime() - currentDate);
        return a - b < 0 ? curr : prev;
      });
      setCurrentMatchweek(mw);
    }
  }, [activeSchedule]);

  useEffect(() => {
    dispatch(getSchedule({ season: currentSeason, leagueId: league?._id! }));
    return () => { dispatch(clearSchedule()) }
  }, [currentSeason, league, dispatch]);

  if(!league && !activeSchedule) {
    return scheduleStatus === StateStatus.Loading ? 
      <BackdropLoader open={true} /> : 
      <DataNotFoundMessage message='Cannot find schedule' />;
  }

  return (
    <Box>
      <SetMatchweekSection>
        <Tabs 
          variant='scrollable' 
          scrollButtons='auto' 
          value={currentMatchweek} 
          onChange={handleCurrentMatchweekChange}
        >
          {tabs.map(tab => (
            <MatchweekTab 
              key={uuid()} 
              value={tab} 
              label={tab.matchweekName!} 
            />
          ))}
        </Tabs>
        <CalendarContainer>
          {currentMatchweek && activeSchedule && (
            <MatchweekPicker 
              season={activeSchedule.season}
              matchweeks={activeSchedule!.fixture!} 
              setMatchweek={setCurrentMatchweek} 
            />
          )}
        </CalendarContainer>
      </SetMatchweekSection>
      {currentMatchweek && (
        <MatchweekTable matchweek={currentMatchweek} />
      )}
    </Box>
  );
};

export default CompetitionScores;