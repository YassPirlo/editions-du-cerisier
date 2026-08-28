import type { Metadata } from "next";
import { VariantSwitcher } from "@/components/VariantSwitcher";

export const metadata: Metadata = {
  title: "Aperçus de maquettes",
  robots: { index: false, follow: false },
};

export default function ApercuLayout({ children }: LayoutProps<"/apercu">) {
  return (
    <>
      <VariantSwitcher />
      {children}
    </>
  );
}
