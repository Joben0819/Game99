import { Metadata } from 'next';
import RouletteComponent from './roulette';

export const metadata: Metadata = {
  icons: null,
};

const Roulette = () => {
  return <RouletteComponent />;
};

export default Roulette;
