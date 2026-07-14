import { cn } from '@/lib/utils';

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <header
      id={id}
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-haven-blue">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-display text-3xl font-medium leading-tight text-night-ink sm:mt-3 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-graphite sm:mt-4 sm:text-base lg:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}
