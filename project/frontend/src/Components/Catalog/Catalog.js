import React, { useEffect, useState } from 'react';
import './Catalog.css';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import Product from '../Product/Product';

function Catalog() {
    const [items, setItems] = useState([]);
    const { auth } = useAuth();

    useEffect(() => {
        const getItems = async () => {
            try {
                let results = [];
                let response = await axios.get("https://itunes.apple.com/search?term=bts&media=music&entity=musicTrack&limit=6");
                results = [...results, ...response.data.results];
                response = await axios.get("https://itunes.apple.com/search?term=c418&media=music&entity=musicTrack&limit=6");
                results = [...results, ...response.data.results];
                setItems(results);
            } catch (err) {
                console.log(err);
            }
        }
        getItems();
    }, []);

    return (
        <section className="hero">
            {auth?.Role === 'sponsor' || auth?.Role === 'admin'
                ? <h2>Welcome to Your Sponsor's Catalog Preview</h2>
                : <h2>Welcome to Your Driver's Catalog</h2>
            }
            <div className="sponsor-info">
                <p> Here is a list of catalog item you chould choose from.</p>
                <p> ... </p>
                <div className='products-container'>
                    {items.map((item, i) => {
                        return (
                            <Product details={item} key={item.wrapperType + i}/>
                        )
                    })}
                </div>
            </div>
            {(auth?.Role === 'sponsor' || auth?.Role === 'admin') 
                && <Link to='./settings' className='cta-button'>Settings</Link>
            }
        </section>
    )
}

export default Catalog;