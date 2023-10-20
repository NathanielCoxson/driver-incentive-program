import './CatalogSettings.css';
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function CatalogSettings() {
    const [responseMessage, setResponseMessage] = useState('');
    const [searchTerms, setSearchTerms] = useState(['c418', 'bts']);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setResponseMessage('Success!');
        console.log('submit');
        console.log(searchTerms);
        setSearchTerm('');
    };

    const handleAddSearchTerm = () => {
        if (!searchTerms.includes(searchTerm)) {
            setSearchTerms(prev => [...prev, searchTerm]);
            setSearchTerm('');
        }
    }

    const handleRemoveTerm = (event) => {
        const term = event.currentTarget.querySelector('p').innerHTML;
        setSearchTerms(prev => prev.filter(t => t !== term));
    }

    return (
        <section className="hero catalog-settings">
            <h2>Catalog Settings</h2>
            <form id="catalog-settings-form" onSubmit={handleSubmit}>
                <div className='search-terms-input'>
                    <label htmlFor="searchTerms">Search Terms:</label>
                    <div className="search-terms-wrapper">
                        <div className="search-terms-container">
                            {searchTerms.map(term => {
                                return (
                                    <div className='search-term-wrapper' onClick={handleRemoveTerm} key={term}>
                                        <p>{term}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='term-input-container'>
                        <label htmlFor="searchTerm">Add Term:</label>
                        <input
                            type="text"
                            id="searchTerm"
                            onChange={event => setSearchTerm(event.target.value)}
                            value={searchTerm}
                        ></input>
                        <button onClick={handleAddSearchTerm} type="button">+</button>
                    </div>
                    <div id="responseMessage">{responseMessage}</div>
                    <button type="submit" className="cta-button">Sign Up</button>
                </div>


            </form>

            <table>
                <tr>
                    <th>Term</th>
                    <th>Media type</th>
                    <th>Limit</th>
                </tr>
                <tr>
                    <td contentEditable></td>
                    <td>
                        <div className='media-selections-wrapper'>
                        <div className='media-selections'>
                            <div className='media-option'>
                                <label htmlFor='music'>Music:</label>
                                <input type='radio' id='music' name='media-type1' value='music'></input>
                            </div>

                            <div className='media-option'>
                                <label htmlFor='music'>Movie:</label>
                                <input type='radio' id='movie' name='media-type1' value='movie'></input>
                            </div>

                            <div className='media-option'>
                                <label htmlFor='music'>Audiobook:</label>
                                <input type='radio' id='audiobook' name='media-type1' value='audiobook'></input>
                            </div>
                        </div>
                        </div>
                    </td>
                    <td contentEditable></td>
                </tr>
                <tr>
                    <td contentEditable></td>
                    <td>
                        <div className='media-selections-wrapper'>
                        <div className='media-selections'>
                            <div className='media-option'>
                                <label htmlFor='music'>Music:</label>
                                <input type='radio' id='music' name='media-type2' value='music'></input>
                            </div>

                            <div className='media-option'>
                                <label htmlFor='music'>Movie:</label>
                                <input type='radio' id='movie' name='media-type2' value='movie'></input>
                            </div>

                            <div className='media-option'>
                                <label htmlFor='music'>Audiobook:</label>
                                <input type='radio' id='audiobook' name='media-type2' value='audiobook'></input>
                            </div>
                        </div>
                        </div>
                    </td>
                    <td contentEditable></td>
                </tr>
            </table>
            

        </section>
    )
}

export default CatalogSettings;