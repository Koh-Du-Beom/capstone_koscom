
import FinancialDropDown from "@/components/financial-data/dropdown/financial-drodown";
import classes from "./page.module.css";

export default function Home() {
  return (
    <main className={classes.container}>
			<h1>폰트 적용되는지 확인해보자</h1>
      <FinancialDropDown/>
    </main>
  );
}
