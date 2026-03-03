import type { Service } from "@/types";

export default function Services({ services }: { services: Service[] }) {
  return (
    <section
      id="services"
      className="py-28 px-12 bg-bg-elevated border-t border-b border-border max-md:py-20 max-md:px-6"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="slabel">Services</div>
        <div
          className="grid grid-cols-3 gap-px mt-12 max-[900px]:grid-cols-1"
          style={{ background: "var(--color-border)" }}
        >
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-bg-elevated p-10 transition-colors duration-400 hover:bg-bg-card cursor-default reveal"
            >
              {service.icon && (
                <span className="text-2xl mb-5 block opacity-80">
                  {service.icon}
                </span>
              )}
              <h3 className="font-display text-[1.1rem] font-semibold mb-3">
                {service.title}
              </h3>
              <p className="text-[0.88rem] text-text-secondary leading-[1.7]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
