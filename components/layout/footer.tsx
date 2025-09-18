import versionData from '@/version.json';

const Footer = () => {
  return (
    <footer className="fixed bottom-4 right-4 text-xs text-white z-50 p-2 bg-slate-800/50 rounded-md">
      <p>Versão: {versionData.version}</p>
    </footer>
  );
};

export default Footer;