import "./MsgBox.css"
import { Link } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";

function MsgBox() {
    const { auth } = useAuth();
    return (
        <div className="hero">
            <ul>
                {auth?.Role === 'driver' &&
                    <>
                    Here is driver.
                    </>
                }

                {auth?.Role === 'sponsor' &&
                    <>
                    Here is sponsor.
                    </>
                }

                {auth?.Role === 'admin' &&
                    <>
                    Here is admin
                    </>
                }
            </ul>
        </div>
    );
}

export default MsgBox;



