import React from 'react';
import girl from "../assets/images/girl.png";
import boy from "../assets/images/boy.png";
const Chat = () => {
    return (
        <>
            <div className="chat-sec">

                <div className="chat-container">
                    <div className="message-row received">
                        <img src={girl} alt="" />
                        <div className="message-bubble">
                            <div className="message-text">Really?</div>
                        </div>

                    </div>
                    <div className="message-row sent">


                        <div className="message-bubble">
                            <div className="message-text">Yeah, it's really good!</div>
                        </div>
                        <img src={boy} alt="" />
                    </div>
                    <div className="message-row typing">
                        <img src={girl} alt="" />
                        <div className="message-bubble">
                            <div className="typing-text">Typing ...</div>
                        </div>

                    </div>
                    <div className="input-container">
                        <input type="text" placeholder="Type your message" />
                    </div>
                </div>



            </div>
        </>
    );
};

export default Chat;