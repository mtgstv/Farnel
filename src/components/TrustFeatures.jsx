import { trustFeatures } from "../data/content";
import { ShieldIcon, ReceiptIcon, TruckIcon } from "./Icons";

const ICONS = [ShieldIcon, ReceiptIcon, TruckIcon];

export default function TrustFeatures() {
  return (
    <section className="container-page py-20 md:py-24">
      <div className="text-center">
        <p className="eyebrow">Transparência e segurança</p>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
          Por que o Prato Cheio é viável e seguro?
        </h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trustFeatures.map((feature, index) => {
          const Icon = ICONS[index];
          return (
            <div
              key={feature.title}
              className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-forest/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta/12 text-terracotta">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-semibold text-forest-dark">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{feature.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
