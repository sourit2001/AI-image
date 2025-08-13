import { LanguageProvider } from '../lib/LanguageContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
