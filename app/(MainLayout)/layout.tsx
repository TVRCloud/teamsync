import MainLayout from "@/components/ui/main-layout";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MainLayout>{children}</MainLayout>
    </div>
  );
}
