import { Providers } from "./providers/base";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers enablePersistence={true}>{children}</Providers>
      </body>
    </html>
  );
}
