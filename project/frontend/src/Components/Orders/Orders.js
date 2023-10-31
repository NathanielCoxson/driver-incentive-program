import './Orders.css';
import { useCallback, useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function Orders() {
    const [orders, setOrders] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const navigate = useNavigate();

    const fetchOrders = useCallback(async () => {
        try {
            const response = await axiosPrivate(`/orders/users/${auth.Username}`);
            setOrders(response?.data?.orders);
            console.log(response.data);
        } catch (err) {
            if (process.env.NODE_END === 'development') console.log(err);
            if (err?.response?.status === 401) return navigate('/login');
        }
    }, [auth, navigate, axiosPrivate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <section className="hero orders-section">
            <h2>Your Orders</h2>
            {
                orders && orders.map((order, i) => {
                    return (
                        <div key={order.OID} className='order'>
                            {(i + 1) + '. ' + (new Date(order.OrderDate)).toDateString()}
                            <ul className='order-items'>
                                {
                                    order?.items.map(item => {
                                        return (
                                            <li>
                                                <div className='item'>
                                                    <span>{item.ItemName}</span>
                                                    <span>{item.ItemCost}P</span>
                                                </div>
                                            </li>
                                        );
                                    })
                                }
                                <li>
                                    <div className='item'>
                                        <span>Total: </span>
                                        <span>{order.total}P</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    );
                })
            }
            {
                (!orders || orders.length === 0) && <div>You have no orders.</div>
            }
        </section>
    );
}

export default Orders;