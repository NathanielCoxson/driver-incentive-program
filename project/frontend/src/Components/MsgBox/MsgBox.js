import React from 'react';
import "./MsgBox.css";
import useAuth from "../../hooks/useAuth";

function MsgBox() {
    const { auth } = useAuth();

    return (
        <div className="hero">
            <h1>Messages</h1><br />
            <form>
                <label htmlFor="recipientEmail">To:</label>
                <select id="recipientEmail" name="recipientEmail" required>
                    {auth?.Role === 'driver' && (
                        <>
                            <option value="sponsor1@example.com">Sponsor 1</option>
                            <option value="sponsor2@example.com">Sponsor 2</option>
                            <option value="ithelp@example.com">IT Help</option>
                        </>
                    )}
                    {auth?.Role === 'sponsor' && (
                        <>
                            <option>All Drivers</option>
                            <option>IT Help</option>
                        </>
                    )}
                    {auth?.Role === 'admin' && (
                        <>
                            <option>All Drivers</option>
                            <option>All Sponsors</option>
                        </>
                    )}
                </select>
                <br /><br />
                <label htmlFor="message">Message:</label>
                <textarea id="message" name="message" rows="10" required></textarea>
                <br />
                <button className="cta-button" type="submit">Send Message</button>
            </form>
        </div>
    );
}

export default MsgBox;
