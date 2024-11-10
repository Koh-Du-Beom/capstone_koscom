
import TechnicalTable from "@/components/technical-analysis/technical-table/technical-table"
import tableMockData from "@/components/technical-analysis/technical-table/technical-table-mockData"


export default function PortfolioPage() {

	const selectedIndicators = [
		'Awesome Oscillator',
		'RSI',
		'Stochastic Oscillator',
		'Stochastic RSI',
		'True Strength Index (TSI)',
		'Ultimate Oscillator',
		'Williams %R'
	];

	return (
		<>
			page for portfolio
			<TechnicalTable data={tableMockData} selectedIndicators={selectedIndicators}/>
		</>
	)
};
