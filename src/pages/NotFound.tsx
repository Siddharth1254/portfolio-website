import { Nav } from '@/components/Nav';
import { Sky } from '@/components/Sky';
import { useLanguage } from '@/i18n/LanguageContext';

const NotFound = () => {
  const { t } = useLanguage();
  return (
    <>
      <Sky />
      <Nav />
      <main>
        <section className="block" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div>
            <div className="shead">
              <div className="num mono">404</div>
              <h2>{t('notFound.text')}</h2>
            </div>
            <a className="btn primary" href="/">{t('notFound.back')}</a>
          </div>
        </section>
      </main>
    </>
  );
};

export default NotFound;
