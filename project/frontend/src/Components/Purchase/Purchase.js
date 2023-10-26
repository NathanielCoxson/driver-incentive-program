import React, { useState } from 'react';
import './Purchase.css'; // Import your CSS file

function Purchase() {
    // Sample shopping cart data (replace with your data)
    const shoppingCart = [
        { id: 1, name: 'Product A', quantity: 2, costPerItem: 10 },
        { id: 2, name: 'Product B', quantity: 3, costPerItem: 15 },
        { id: 3, name: 'Product C', quantity: 1, costPerItem: 20 },
    ];

    // Calculate the total cost
    const totalCost = shoppingCart.reduce((total, item) => total + item.quantity * item.costPerItem, 0);

    return (
        <main>
            <section className="hero">
                <h3>Shopping Cart</h3>
            </section>

            <section className="shopping-cart">
                <ul>
                    {shoppingCart.map((item) => (
                        <li key={item.id} className="cart-item">
                            <span>{item.name} - Quantity: {item.quantity}</span>
                            <span>Cost Per Item: ${item.costPerItem}</span>
                            <span>Subtotal: ${item.quantity * item.costPerItem}</span>
                        </li>
                    ))}
                </ul>

                <div className="total-cost">
                    <h4>Total Cost: ${totalCost}</h4>
                </div>

                <button className="cta-button">Checkout</button>
            </section>
        </main>
    );
}

export default Purchase;
