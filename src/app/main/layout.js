import TopNavBar from "@/components/navbar/top-navbar/top-navbar";

export default function MainLayout({ children }) {
  return (
    <div>
      <TopNavBar />
      <main className="contents">
        {children}
      </main>
    </div>
  );
}
