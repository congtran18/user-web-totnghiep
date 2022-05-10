import 'tailwindcss/tailwind.css';
import "../styles/global.css";
import { Provider } from "react-redux";
import { store, persistor } from "../Redux/store";
import Router from 'next/router';
import { PersistGate } from 'redux-persist/integration/react';
import ProgressBar from '@badrap/bar-of-progress';
import Layout from "../components/Layout";
import { SessionProvider } from 'next-auth/react';

const progress = new ProgressBar({
  size: 3,
  color: '#8b6e4f',
  className: 'z-50',
  delay: 100,
});

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', progress.finish);
Router.events.on('routeChangeError', progress.finish);

function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp
