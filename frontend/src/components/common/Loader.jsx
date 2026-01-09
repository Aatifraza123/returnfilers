import { useSettings } from '../../context/SettingsContext';

const Loader = ({ size = 'md', text = '' }) => {
  const { settings } = useSettings();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const borderSize = {
    sm: 'border-2',
    md: 'border-4',
    lg: 'border-4',
    xl: 'border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {settings?.logo ? (
        <div className="relative">
          <img 
            src={settings.logo} 
            alt="Loading" 
            className={`${sizeClasses[size]} object-contain`}
          />
          <div className={`absolute inset-0 ${sizeClasses[size]} ${borderSize[size]} border-[#C9A227] border-t-transparent rounded-full animate-spin`}></div>
        </div>
      ) : (
        <div className="relative">
          <div className={`${sizeClasses[size]} bg-gradient-to-br from-[#0B1530] to-[#1a2b5c] rounded-lg flex items-center justify-center`}>
            <span className="text-[#C9A227] font-bold text-2xl">
              {settings?.logoText || 'RF'}
            </span>
          </div>
          <div className={`absolute inset-0 ${sizeClasses[size]} ${borderSize[size]} border-[#C9A227] border-t-transparent rounded-full animate-spin`}></div>
        </div>
      )}
      {text && <p className="text-gray-600 mt-4 text-sm">{text}</p>}
    </div>
  );
};

export default Loader;
