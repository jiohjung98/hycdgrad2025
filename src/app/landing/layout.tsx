// landing 페이지만을 위한 독립적인 레이아웃 (헤더/푸터 없음)
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
