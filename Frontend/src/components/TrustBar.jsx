import { HiShieldCheck, HiTruck, HiBadgeCheck } from 'react-icons/hi';

const items = [
  { icon: HiBadgeCheck, label: 'Authentic fragrances' },
  { icon: HiShieldCheck, label: 'Secure checkout' },
  { icon: HiTruck, label: 'Reliable delivery' },
];

export default function TrustBar() {
  return (
    <section className="border-y border-gold/15 bg-navy-950/60 backdrop-blur-sm">
      <div className="page-container grid gap-4 py-5 sm:grid-cols-3 sm:py-6">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center justify-center gap-3 text-center sm:justify-start">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-parchment/85 sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
