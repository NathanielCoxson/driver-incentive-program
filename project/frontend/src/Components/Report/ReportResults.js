import "./Report.css";
function ReportResults({ results }) {
    return (
        <div>
            {/* {(type === 'sponsor-sales' && allSponsors) &&
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Points</th>
                            <th>Item Count</th>
                            <th>Order Date</th>
                            <th>Sponsor Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(sponsor => {
                            return (
                                sponsor.sales?.map(result => {
                                    return (
                                        <tr key={result.OID}>
                                            <td>{result.Username}</td>
                                            <td>{result.total}</td>
                                            <td>{result.items?.length}</td>
                                            <td>{result.OrderDate}</td>
                                            <td>{result.SponsorName}</td>
                                        </tr>
                                    );
                                })
                            );
                        })}
                    </tbody>
                </table>
            } */}
            <table className="report-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Points</th>
                        <th>Item Count</th>
                        <th>Order Date</th>
                        <th>Sponsor Name</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map(result => {
                        return (
                            <tr key={result.OID}>
                                <td>{result.Username}</td>
                                <td>{result.total}</td>
                                <td>{result.items?.length}</td>
                                <td>{result.OrderDate}</td>
                                <td>{result.SponsorName}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}
export default ReportResults;