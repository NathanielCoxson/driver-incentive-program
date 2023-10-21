import './CatalogSettings.css';
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function CatalogSettings() {
    const [responseMessage, setResponseMessage] = useState('');
    const [searchTerms, setSearchTerms] = useState(['c418', 'bts']);
    const [searchTerm, setSearchTerm] = useState('');
    const [searches, setSearches] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(searches);
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

    useEffect(() => {
        let isMounted = false;
        const fetchSearches = async () => {
            try {
                const response = await axiosPrivate.get('/catalogs');
                setSearches(response.data.searches);
            } catch (err) {
                console.log(err);
            }
        }
        if (!isMounted) fetchSearches();
        return () => isMounted = true;
    }, [axiosPrivate]);

    const handleTermChange = (event) => {
        let items = [...searches];
        items[event.target.name.split(' ')[1]].term = event.target.value;
        setSearches(items);
    };

    const handleMediaTypeChange = (event) => {
        let items = [...searches];
        items[event.target.name.split(' ')[1]].media = event.target.value;
        
        // Set entity to default select option on media change.
        if (event.target.value === 'music') items[event.target.name.split(' ')[1]].entity = 'musicTrack';
        else if (event.target.value === 'movie') items[event.target.name.split(' ')[1]].entity = 'movie';
        else if (event.target.value === 'audiobook') items[event.target.name.split(' ')[1]].entity = 'audiobook';
        setSearches(items);
    };

    const handleEntityTypeChange = (event) => {
        let items = [...searches];
        items[event.target.name.split(' ')[1]].entity = event.target.value;
        setSearches(items);
    };

    const handleLimitChange = (event) => {
        let items = [...searches];
        items[event.target.name.split(' ')[1]].limit = event.target.value;
        setSearches(items);
    };

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

            <form>
                <table>
                    <thead>
                        <tr>
                            <th>Term</th>
                            <th>Media type</th>
                            <th>Entity type</th>
                            <th>Limit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searches.map((search, i) => {
                            return (
                                <tr key={'search ' + i}>
                                    <td>
                                        <label htmlFor={`term ${i}`}></label>
                                        <input
                                            type='text'
                                            value={search.term}
                                            name={`term ${i}`}
                                            onChange={handleTermChange}
                                        ></input>
                                    </td>
                                    <td>
                                        <div className='media-selections-wrapper'>
                                            <div className='media-selections'>
                                                <div className='media-option'>
                                                    <label htmlFor='music'>Music:</label>
                                                    <input
                                                        type='radio'
                                                        id='music'
                                                        name={`mediaType ${i}`}
                                                        value='music'
                                                        checked={search.media === 'music'}
                                                        onChange={handleMediaTypeChange}
                                                    ></input>
                                                </div>

                                                <div className='media-option'>
                                                    <label htmlFor='movie'>Movie:</label>
                                                    <input
                                                        type='radio'
                                                        id='movie'
                                                        name={`mediaType ${i}`}
                                                        value='movie'
                                                        checked={search.media === 'movie'}
                                                        onChange={handleMediaTypeChange}
                                                    ></input>
                                                </div>

                                                <div className='media-option'>
                                                    <label htmlFor='audiobook'>Audiobook:</label>
                                                    <input
                                                        type='radio'
                                                        id='audiobook'
                                                        name={`mediaType ${i}`}
                                                        value='audiobook'
                                                        checked={search.media === 'audiobook'}
                                                        onChange={handleMediaTypeChange}
                                                    ></input>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <label htmlFor={`entity ${i}`}></label>
                                        <select name={`entity ${i}`} defaultValue={search.entity} onChange={handleEntityTypeChange}>
                                            {search.media === 'music' &&
                                                <>
                                                    <option value='musicTrack'>Track</option>
                                                    <option value='musicArtist'>Artist</option>
                                                    <option value='album'>Album</option>
                                                </>
                                            }
                                            {search.media === 'movie' &&
                                                <>
                                                    <option value='movie'>Movie</option>
                                                    <option value='movieArtist'>Artist</option>
                                                </>
                                            }
                                            {search.media === 'audiobook' &&
                                                <>
                                                    <option value='audiobook'>Audiobook</option>
                                                    <option value='audiobookAuthor'>Author</option>
                                                </>
                                            }
                                        </select>
                                    </td>
                                    <td>
                                        <label htmlFor={`limit ${i}`}></label>
                                        <input
                                            type='number'
                                            value={search.limit}
                                            name={`limit ${i}`}
                                            onChange={handleLimitChange}
                                        ></input>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <button className='cta-button' onClick={handleSubmit}>Save</button>
            </form>

        </section>
    )
}

export default CatalogSettings;