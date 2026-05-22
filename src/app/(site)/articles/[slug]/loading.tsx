import { Container } from "@/components/site/Container";

export default function Loading() {
  return (
    <article>
      <header className="pt-10 sm:pt-14 pb-8 border-b border-border">
        <Container size="narrow">
          <div className="skeleton h-3 w-32 rounded mb-6" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton mt-5 h-14 w-11/12 rounded-md" />
          <div className="skeleton mt-3 h-14 w-2/3 rounded-md" />
          <div className="skeleton mt-6 h-5 w-3/4 rounded" />
          <div className="skeleton mt-2 h-5 w-1/2 rounded" />
        </Container>
      </header>
      <div className="bg-paper-2/40 py-10">
        <Container size="narrow">
          <div className="skeleton aspect-[21/9] rounded-xl" />
        </Container>
      </div>
      <div className="py-10 sm:py-14">
        <Container size="narrow">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-4 rounded" style={{ width: `${70 + (i % 4) * 7}%` }} />
            ))}
          </div>
        </Container>
      </div>
    </article>
  );
}
