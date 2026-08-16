export default function ProfileSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-16 md:pt-24">
      {children}
    </div>
  );
}
