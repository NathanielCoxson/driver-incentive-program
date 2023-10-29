import './Product.css';

function Product(props) {
    const { details, handleAddToCart } = props;
    return (
        <div className='product-card'>
            <img src={details.artworkUrl100} alt={details.trackName} />
            <div className='product-text-wrapper'>
                <h3>{details.trackName}</h3>
                <h4>{details.artistName}</h4>
                <p>${details.trackPrice}</p>
                <button className='cta-button' onClick={(e) => handleAddToCart(details)}>Add to Cart</button>
            </div>
        </div>
    );
}

export default Product;