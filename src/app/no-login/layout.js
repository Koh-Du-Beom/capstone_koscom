import NoLoginTopNavBar from "@/components/navbar/non-login-top-navbar/no-login-top-navbar";

export default function MainLayout({ children }) {
  return (
    <div>
      <NoLoginTopNavBar/>
      <main style={{ padding : '20px'}}>
        {children}
      </main>
    </div>
  );
}
