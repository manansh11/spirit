import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ weight: ['100', '400', '700', '900'], subsets: ['latin'] }); // Add Outfit with desired weights



export const metadata = {
  title: "Manansh's Spiritual Compendium",
  description: "Every spiritual, somatic, and internal technology I know",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>{children}</body>
    </html>
  );
}
