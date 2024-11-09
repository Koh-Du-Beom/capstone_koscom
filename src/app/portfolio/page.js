import TechnicalTableIdentifier from "@/components/technical-analysis/technical-table/technical-table-identifier"

export default function PortfolioPage(params) {
	return (
		<>
			page for portfolio
			<TechnicalTableIdentifier 
				index='1'
				ticker='019440'
				company_name='세아특수강'
				exchange_code='KRX'
			/>
		</>
	)
};
