import NewsletterForm from './NewsletterForm';

// Full-width newsletter call-to-action, styled as a light-green band.
// Wraps the shared NewsletterForm and locks in the marketing label used
// on the homepage / anywhere else it's dropped in.
export default function NewsletterModule() {
  return (
    <div className="newsletter-module">
      <div className="newsletter-module-inner">
        <NewsletterForm labelSuffix=" for weekly news and meaningful jobs." />
      </div>
    </div>
  );
}
