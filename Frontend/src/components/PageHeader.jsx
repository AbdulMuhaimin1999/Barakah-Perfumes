export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-gold/15 pb-5 sm:mb-8">
      <div>
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-parchment/70">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
