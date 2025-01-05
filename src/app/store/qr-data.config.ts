import { StyleStore, ConfigStore, IconStore } from '../types/store.types';

export const DEFAULT_QR_STYLE: StyleStore = {
  dots: {
    color: '#000000',
    type: 'rounded',
    gradient: {
      enabled: false,
      type: 'linear',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#ffffff' },
        { offset: 1, color: '#77779C' },
      ],
    },
  },
  cornerDot: {
    color: '#000000',
    type: 'dot',
    gradient: {
      enabled: false,
      type: 'linear',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#ffffff' },
        { offset: 1, color: '#77779C' },
      ],
    },
  },
  square: {
    color: '#000000',
    type: 'extra-rounded',
    gradient: {
      enabled: false,
      type: 'linear',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#ffffff' },
        { offset: 1, color: '#77779C' },
      ],
    },
  },
  background: {
    color: '#ffffff',
    isTransparent: false,
    gradient: {
      enabled: false,
      type: 'linear',
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#ffffff' },
        { offset: 1, color: '#77779C' },
      ],
    },
  },
};

export const DEFAULT_QR_CONFIG: ConfigStore = {
  name: '',
  value: '',
  level: 'L',
  margin: 4,
  downloadType: 'png',
  type: 'default',
};

export const DEFAULT_QR_ICON: IconStore = {
  name: '',
  src: '',
  size: 0.5,
  hideBackgroundDots: false,
  margin: 0,
};
