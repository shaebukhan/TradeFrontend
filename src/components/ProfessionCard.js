import React from 'react';

const ProfessionCard = ({ profession, image }) => {
    return (
        <>
            <div className="prof-card">
                <div className="prof-card-sub">
                    <img className='prof-card-img' src={image} alt={profession} />
                    <h3 className='prof-card-text'>{profession}</h3>
                </div>
            </div>
        </>
    );
};

export default ProfessionCard;