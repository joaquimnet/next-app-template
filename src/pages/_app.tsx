import '@styles/globals.css';

import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';

import store from '@common/store/store';
import { seoDefaults } from 'src/seo.config';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <DefaultSeo {...seoDefaults} />
      <Component {...pageProps} />
    </Provider>
  );
}
