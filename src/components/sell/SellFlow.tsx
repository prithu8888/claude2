import { useAppStore } from '../../store/useAppStore';
import ElectronicsSellFlow from './ElectronicsSellFlow';
import EVSellFlow from './EVSellFlow';
import './SellFlow.css';

export default function SellFlow() {
  const { activeVertical } = useAppStore();

  const isEV = activeVertical === 'ev-2w' || activeVertical === 'ev-4w';

  return isEV ? <EVSellFlow /> : <ElectronicsSellFlow />;
}
