import React from 'react';
import "./MsgBox.css";
import { Link } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";

function MsgBox() {
    const { auth } = useAuth();

    return (
        <div className="hero">
            {auth?.Role === 'driver' && (
                <div>
                    <h1>Messages</h1><br />
                    <form>
                        <label htmlFor="recipientEmail">To:</label>
                        <select id="recipientEmail" name="recipientEmail" required>
                            <option value="sponsor1@example.com">Sponsor 1</option>
                            <option value="sponsor2@example.com">Sponsor 2</option>
                            <option value="ithelp@example.com">IT Help</option>
                        </select>
                        <br /><br />
                        <label htmlFor="message">Message:</label>
                        <textarea id="message" name="message" rows="10" required></textarea>
                        <br />
                        <button className="cta-button" type="submit">Send Message</button>
                    </form>
                </div>
            )}

            {auth?.Role === 'sponsor' && (
                <div>
                    <h1>Messages</h1><br />
                    <form>
                        <label htmlFor="recipientEmail">To:</label>
                        <select id="recipientEmail" name="recipientEmail" required>
                            <option>All Drivers</option>
                            <option>IT Help</option>
                        </select>
                        <br /><br />
                        <label htmlFor="message">Message:</label>
                        <textarea id="message" name="message" rows="10" required></textarea>
                        <br />
                        <button className="cta-button" type="submit">Send Message</button>
                    </form>
                </div>
            )}

            {auth?.Role === 'admin' && (
                // Add content for admin role if needed
                <div>
                    Here is admin content.
                </div>
            )}
        </div>
    );
}

export default MsgBox;
