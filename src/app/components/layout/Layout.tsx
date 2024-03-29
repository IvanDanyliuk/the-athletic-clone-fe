import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { AppDispatch } from '../../../features/store';
import { getAuthenticatedUser } from '../../../features/users/asyncActions';
import SubscribeSection from '../common/SubscribeSection';
import ScoresSection from '../common/ScoresSection';
import { selectLatestMatches } from '../../../features/schedules/selectors';
import { getRecentMatches } from '../../../features/schedules/asyncActions';
import { getCurrentSeasonValue } from '../../utils/helpers';


interface ILayout {
  children: React.ReactNode;
}

const Wrapper = styled(Box)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
`;

const Main = styled(Box)`
  padding-top: 7vh;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  background: #ffffff;
`;

const ContentContainer = styled(Container)`
  position: relative;
  flex: 1;
`;


const Layout: React.FC<ILayout> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();

  const season = getCurrentSeasonValue();
  const latestMatches = useSelector(selectLatestMatches);

  useEffect(() => {
    dispatch(getAuthenticatedUser());
    dispatch(getRecentMatches(season));
  }, [season, dispatch]);

  return (
    <Wrapper>
      <Header />
      <Main component='main'>
        {pathname === '/' && (
          <>
            <SubscribeSection />
            <ScoresSection matches={latestMatches} />
          </>
        )}
        <ContentContainer maxWidth='xl'>
          {children}
        </ContentContainer>
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default Layout;