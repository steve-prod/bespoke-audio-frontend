import React, { Component } from 'react';
import Footer from './Footer.js';

export default class About extends Component {
    render() {
        return (
            <div>
            <main role="main" className="container">
                <div className="inner cover">
                    <form className="form-layout">
                        <p>Thanks for stopping by.  This web app is meant to be a proof of concept
                        messaging app that I have been thinking about building for a while.  The frontend
                        is written in React and uses Bootstrap 4 and the LAME mp3 encoder (www.mp3dev.org)
                        to convert WAV files to mp3s.  The backend is written in Go and uses Postgres
                        to store user and message data.</p>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
        );
    };
}
