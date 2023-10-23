import './CatalogSettings.css';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function CatalogSettings() {
    const [responseMessage, setResponseMessage] = useState('');
    const [searches, setSearches] = useState([]);
    const [removing, setRemoving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { SponsorName } = useParams();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setResponseMessage("Saving...");
        setIsLoading(true);
        try {
            const response = await axiosPrivate.put(`/catalogs/${SponsorName}`, { searches });
            console.log(response);
        } catch (err) {
            console.log(err);
            setResponseMessage('Error saving searches, please try again.')
        }
        setIsLoading(false);
        console.log(searches);
        setResponseMessage('Success!');
    };

    useEffect(() => {
        let isMounted = false;
        const fetchSearches = async () => {
            try {
                const response = await axiosPrivate.get(`/catalogs/${SponsorName}`);
                setSearches(response.data.searches);
            } catch (err) {
                console.log(err);
            }
        }
        if (!isMounted) fetchSearches();
        return () => isMounted = true;
    }, [axiosPrivate, SponsorName]);

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

    const handleAddRule = (event) => {
        setSearches(prev => [...prev, {
            term: '',
            media: 'music',
            entity: 'musicTrack',
            limit: 5
        }]);
    };

    const toggleRemove = (event) => {
        setRemoving(prev => !prev);
    };

    const handleRemoveSearch = (event) => {
        if (removing) {
            let items = [...searches];
            items.splice(event.currentTarget.id.split(' ')[2], 1);
            setSearches(items);
        }
    };

    return (
        <section className="hero catalog-settings">
            <h2>Catalog Settings</h2>
            <form onSubmit={handleSubmit}>
                <div className='catalog-form'>
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
                                    <tr
                                        key={'search ' + i}
                                        className={removing ? 'removal' : ''}
                                        onClick={handleRemoveSearch}
                                        id={`catalog row ${i}`}
                                    >
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
                    <div className='buttons'>
                        <button type='button' className='cta-button' onClick={handleAddRule}>Add</button>
                        <button type='button' className='cta-button' onClick={toggleRemove}>{removing ? 'Stop Deleting' : 'Start Deleting'}</button>
                        <button className='cta-button'>Save</button>
                    </div>
                    <button type="button" onClick={() => navigate(-1)} className='cta-button'>Back</button>
                    <div>{responseMessage}</div>
                </div>
            </form>
            {isLoading && <span className='loader'></span>}
        </section>
    )
}

export default CatalogSettings;