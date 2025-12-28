import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
    return (
        <div className="landing">
            <div className="landing-content">
                <h1 className="landing-headline">
                    Monitor any element<br />
                    <span className="highlight">on any website</span>
                </h1>
                <p className="landing-subtext">
                    Track price changes, stock availability, content updates, and more.
                    Get notified instantly when something changes.
                </p>
                <Link to="/pinning" className="cta-button">
                    Get Started
                </Link>
            </div>
        </div>
    );
}
