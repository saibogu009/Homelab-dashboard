import React from 'react';
import { 
  Tv, 
  Sparkles, 
  Popcorn, 
  Film, 
  Clapperboard, 
  Download, 
  Compass, 
  Server, 
  Cpu, 
  Boxes, 
  Box, 
  ShieldCheck, 
  Wifi, 
  Database, 
  Activity, 
  Shield, 
  LayoutGrid, 
  Home, 
  Globe,
  HardDrive,
  Terminal,
  Radio,
  Layers,
  LucideProps
} from 'lucide-react';

interface ServiceIconProps extends LucideProps {
  name: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, className = "w-5 h-5", ...props }) => {
  switch (name) {
    case 'Tv':
      return <Tv className={className} {...props} />;
    case 'Sparkles':
      return <Sparkles className={className} {...props} />;
    case 'Popcorn':
      return <Popcorn className={className} {...props} />;
    case 'Film':
      return <Film className={className} {...props} />;
    case 'Clapperboard':
      return <Clapperboard className={className} {...props} />;
    case 'Download':
      return <Download className={className} {...props} />;
    case 'Compass':
      return <Compass className={className} {...props} />;
    case 'Server':
      return <Server className={className} {...props} />;
    case 'Cpu':
      return <Cpu className={className} {...props} />;
    case 'Boxes':
      return <Boxes className={className} {...props} />;
    case 'Box':
      return <Box className={className} {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} {...props} />;
    case 'Wifi':
      return <Wifi className={className} {...props} />;
    case 'Database':
      return <Database className={className} {...props} />;
    case 'Activity':
      return <Activity className={className} {...props} />;
    case 'Shield':
      return <Shield className={className} {...props} />;
    case 'LayoutGrid':
      return <LayoutGrid className={className} {...props} />;
    case 'Home':
      return <Home className={className} {...props} />;
    case 'Terminal':
      return <Terminal className={className} {...props} />;
    case 'Radio':
      return <Radio className={className} {...props} />;
    case 'Layers':
      return <Layers className={className} {...props} />;
    case 'HardDrive':
      return <HardDrive className={className} {...props} />;
    default:
      return <Globe className={className} {...props} />;
  }
};
