import { LanguageProvider } from '../lib/LanguageContext';
import '../styles/globals.css';
import { AuthProvider } from '../lib/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    </AuthProvider>
  );
}
