import "./Report.css";
function ReportResults({ allSponsors, results }) {

    return (
        <div>
            {allSponsors &&
                <table className="report-table">
                    <thead>
                        <tr>
                            <td>Username</td>
                            <td>Points</td>
                            <td>Item Count</td>
                            <td>Order Date</td>
                            <td>Sponsor Name</td>
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
            }
            {!allSponsors &&
                <table className="report-table">
                    <thead>
                        <tr>
                            <td>Username</td>
                            <td>Points</td>
                            <td>Item Count</td>
                            <td>Order Date</td>
                            <td>Sponsor Name</td>
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
            }
        </div>
    )
}
export default ReportResults;