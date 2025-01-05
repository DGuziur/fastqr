import {
  CornerDotType,
  CornerSquareType,
  DotType,
  FileExtension,
} from 'qr-code-styling';
import { ErrorCodeLevel } from '../features/qr-generator/qr-generator.component';

export type ConfigStore = {
  name: string;
  value: string;
  level: ErrorCodeLevel;
  margin: number;
  downloadType: FileExtension;
  type: QrType;
};

export type StyleStore = {
  dots: {
    type: DotType;
    color: string;
    gradient: GradientData;
  };
  cornerDot: {
    type: CornerDotType;
    color: string;
    gradient: GradientData;
  };
  square: {
    type: CornerSquareType;
    color: string;
    gradient: GradientData;
  };
  background: {
    isTransparent: boolean;
    color: string;
    gradient: GradientData;
  };
};

export type IconStore = {
  name: string;
  src: string;
  size: number;
  hideBackgroundDots: boolean;
  margin: number;
};

export type QrType = 'default' | 'phone-contact' | 'wifi';

export type GradientData = {
  enabled: boolean;
  type: 'linear' | 'radial';
  rotation: number;
  colorStops: ColorStops;
};

export type ColorStops = {
  offset: number;
  color: string;
}[];
