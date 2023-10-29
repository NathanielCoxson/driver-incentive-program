import React from 'react';
import './Purchase.css';

function Purchase() {
    // Sample purchase history (replace with your data)
    const purchaseHistory = [
        { id: 1, date: '2023-03-15', pointsSpent: 50, items: ['Product A', 'Product B'], status: 'Delivered' },
        { id: 2, date: '2023-03-10', pointsSpent: 30, items: ['Product C'], status: 'Processing' },
        { id: 3, date: '2023-03-05', pointsSpent: 70, items: ['Product A', 'Product B', 'Product C'], status: 'Processing' },
    ];

    return (
        <main>
            <section className="hero">
                <h3>Purchase History</h3>
                <ul className="purchase-list">
                    {purchaseHistory.map((purchase) => (
                        <li key={purchase.id} className="purchase-item">
                            <div className="purchase-details">
                                <span>Date: {purchase.date}</span>
                                <span>Points Spent: {purchase.pointsSpent} points</span>
                                <span>Items: {purchase.items.join(', ')}</span>
                                <span>Status: {purchase.status}</span> {/* Display the status */}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}

export default Purchase;
