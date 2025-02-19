import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useAppDispatch, useLoggedInSelector } from '../context/app';
import { redirectToSpotifyLogin } from '../service/spotify';
import { getSpotifyState } from '../service/storage';
import { useSpotifyParameters } from './useSpotifyParameters';
import styled from 'styled-components';
import { Button } from './ui/Button';

const LoginUI = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;

const ButtonRow = styled.div`
  margin: 1em;
`;

export const Login = () => {
  const [stateError, setStateError] = useState(false);
  const loggedIn = useLoggedInSelector();
  const appDispatch = useAppDispatch();

  const spotifyParameters = useSpotifyParameters();

  useEffect(() => {
    if (spotifyParameters) {
      const persistedState = getSpotifyState();
      if (
        persistedState === null ||
        persistedState !== spotifyParameters.state
      ) {
        console.log('setting state error!');
        setStateError(true);
      } else {
        appDispatch({
          accessToken: spotifyParameters.accessToken,
          type: 'set-credentials',
        });
      }
    }
  }, [spotifyParameters, appDispatch]);

  if (loggedIn === 'loggedIn') {
    return <Redirect to="/" />;
  } else if (stateError) {
    return (
      <div>
        An error happened while logging into Spotify. Please try logging in
        again here.
      </div>
    );
  }
  return (
    <LoginUI>
      <h1>Trønder Music</h1>
      <div>To use this application, please login into Spotify.</div>
      <i>You will be redirected to Spotify login page.</i>
      <ButtonRow>
        <Button onClick={redirectToSpotifyLogin}>Login to Spotify</Button>
      </ButtonRow>
      <i>Info</i>
    </LoginUI>
  );
};
