import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story | PlantMart',
  description: 'Learn about PlantMart\'s mission to connect nature lovers with India\'s finest heritage nurseries. Discover our journey, values, and commitment to sustainable botanical growth.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
