import React from 'react';
import {Composition} from 'remotion';
import {SmokeTest} from './SmokeTest';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SmokeTest"
      component={SmokeTest}
      durationInFrames={120}
      fps={30}
      width={1080}
      height={1350}
    />
  );
};
