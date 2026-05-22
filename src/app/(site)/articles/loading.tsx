import { Container } from "@/components/site/Container";

export default function Loading() {
  return (
    <>
      <header className="pt-10 sm:pt-14 pb-8 border-b border-border">
        <Container>
          <div className="skeleton h-3 w-24 rounded mb-4" />
          <div className="skeleton h-12 sm:h-16 w-2/3 rounded-md" />
          <div className="skeleton mt-5 h-5 w-3/4 rounded" />
          <div className="skeleton mt-2 h-5 w-1/2 rounded" />
          <div className="mt-7 flex gap-2">
            <div className="skeleton h-9 w-16 rounded-full" />
            <div className="skeleton h-9 w-20 rounded-full" />
            <div className="skeleton h-9 w-24 rounded-full" />
          </div>
        </Container>
      </header>
      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[16/10] rounded-xl" />
                <div className="skeleton mt-3 h-5 w-16 rounded-full" />
                <div className="skeleton mt-3 h-6 w-11/12 rounded" />
                <div className="skeleton mt-2 h-4 w-3/4 rounded" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
