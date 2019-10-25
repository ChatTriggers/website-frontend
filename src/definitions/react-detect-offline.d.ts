/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prefer-stateless-function */
// eslint-disable-next-line max-classes-per-file
declare module 'react-detect-offline' {
  import React from 'react';

  export interface IDetectProps {
    polling?: boolean | {
      enabled?: boolean;
      url?: string;
      interval?: number;
      timeout?: number;
    };
    onChange?(online: boolean): void;
  }

  export interface IOnOfflineProps {
    children: React.ReactNode;
  }

  export interface IDetectorProps {
    render(props: { online: boolean }): React.ReactNode;
  }

  declare class Online extends React.Component<IOnOfflineProps> {}

  declare class Offline extends React.Component<IOnOfflineProps> {}

  declare class Detector extends React.Component<IDetectProps> {}
}
