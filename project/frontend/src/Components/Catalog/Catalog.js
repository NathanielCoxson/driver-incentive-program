import React, { useEffect, useState } from 'react';
import './Catalog.css';
import useAuth from '../../hooks/useAuth';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Product from '../Product/Product';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function Catalog() {
    const [items, setItems] = useState([]);
    const { auth } = useAuth();
    const { SponsorName } = useParams();
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const axiosPrivate = useAxiosPrivate();
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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

    const handlePurchase = async (event) => {
        setIsLoading(true);
        event.preventDefault();
        const items = cart.map(item => {
            return {
                itemName: item.trackName,
                itemPrice: Number(item.trackPrice),
                itemDescription: item.shortDescription || item.longDescription || ''
            }   
        });
        try {
            await axiosPrivate.post(`/orders/users/${auth?.Username}`, { items, SponsorName });
            setCart([]);
            localStorage.setItem('cart', JSON.stringify([]));
        } catch (err) {
            if (process.env.NODE_ENV === 'development') console.log(err);
            if (!err?.response) {
                setResponseMessage('No Server Response');
            }
            else if (err.response?.status === 401) {
                return navigate('/login');
            }
            else if (err.response?.status === 409) {
                setResponseMessage("You don't have enough points to make this purchase.");
            }
            else {
                setResponseMessage('Login Failed');
            }
        }
        setIsLoading(false);
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
                                <li key={item.trackName}>
                                    <div className='cart-item-text'>
                                        <span>{item.trackName}</span>
                                        <span>{item.trackPrice}P</span>
                                    </div>
                                    <button onClick={(e) => handleRemoveItem(item.trackName)}>Remove</button>
                                </li>
                            );
                        })}
                        <li>Total: {cart.reduce((accumulator, currentValue) => accumulator + currentValue.trackPrice, 0)}P</li>
                    </ul>
                    <div className="response-message" id="responseMessage">{responseMessage}</div>
                    {isLoading && <span className='loader'></span>}
                    <button className='cta-button' onClick={handlePurchase}>Purchase</button>
                </section>
            }

        </>
    )
}

export default Catalog;