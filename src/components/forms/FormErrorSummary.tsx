import { cn } from '@/lib/utils';

export function FormErrorSummary({
  errors,
  className,
  id = 'form-error-summary',
}: {
  errors: string[];
  className?: string;
  id?: string;
}) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div
      id={id}
      role="alert"
      tabIndex={-1}
      className={cn(
        'rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3',
        className,
      )}
    >
      <p className="text-sm font-medium text-destructive">
        Please correct the following:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-destructive">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
