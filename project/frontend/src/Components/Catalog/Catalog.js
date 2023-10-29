import React, { useEffect, useState } from 'react';
import './Catalog.css';
import useAuth from '../../hooks/useAuth';
import { Link, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import Product from '../Product/Product';

function Catalog() {
    const [items, setItems] = useState([]);
    const { auth } = useAuth();
    const { SponsorName } = useParams();
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    // dollars/point * dollars
    useEffect(() => {
        const getItems = async () => {
            try {
                let results = [];
                let response = await axios.get(`/catalogs/${SponsorName}`);
                let searches = response.data.searches;
                const ConversionRate = response.data.ConversionRate;
                for (let i = 0; i < searches.length; i++) {
                    let search = searches[i];
                    response = await axios.get(`https://itunes.apple.com/search?term=${search.term}&media=${search.media}&entity=${search.entity}&limit=${search.limit}`);
                    results = [...results, ...response.data.results];
                }
                // Convert each dollar price to points
                results.forEach(result => result.trackPrice = Math.ceil(result.trackPrice * (1 / ConversionRate)))
                setItems(results);
            } catch (err) {
                if (process.env.NODE_ENV === 'development') console.log(err);
            }
        }
        getItems();
    }, [SponsorName, cart]);

    const handleAddToCart = (item) => {
        if (cart.filter(i => i.trackName === item.trackName).length === 0) {
            setCart(prev => [...prev, item]);
            localStorage.setItem('cart', JSON.stringify([...cart, item]));
        }
    };

    const handleRemoveItem = (trackName) => {
        const newCart = cart.filter(item => item.trackName !== trackName);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    return (
        <>
            <section className="hero catalog-section">
                <h1>{SponsorName}</h1>
                {auth?.Role === 'sponsor' || auth?.Role === 'admin'
                    ? <h2>Welcome to Your Sponsor's Catalog Preview</h2>
                    : <h2>Welcome to Your Driver's Catalog</h2>
                }
                <div className="sponsor-info">
                    <p> Here is a list of catalog item you chould choose from:</p>
                    <div className='products-container'>
                        {items.map((item, i) => {
                            return (
                                <Product
                                    details={item}
                                    key={item.wrapperType + i}
                                    handleAddToCart={handleAddToCart}
                                    handleRemoveItem={handleRemoveItem}
                                />
                            )
                        })}
                    </div>
                </div>
                {(auth?.Role === 'sponsor' || auth?.Role === 'admin')
                    && <Link to='./settings' className='cta-button'>Settings</Link>
                }
            </section>
            {
                cart.length > 0 &&
                <section className='cart-section'>
                    <ul className='cart'>
                        {cart.map(item => {
                            return (
                                <li key={item.trackName} onClick={(e) => handleRemoveItem(item.trackName)}>
                                    <div className='cart-item-text'>
                                        <span>{item.trackName}</span>
                                        <span>{item.trackPrice}P</span>
                                    </div>
                                </li>
                            );
                        })}
                        <li>Total: {cart.reduce((accumulator, currentValue) => accumulator + currentValue.trackPrice, 0)}P</li>
                    </ul>
                </section>
            }

        </>
    )
}

export default Catalog;