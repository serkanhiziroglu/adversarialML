import React from 'react';
import ImageText from './ImageText';

const ImgTextCol = () => (
    <div className="container mx-auto p-8 space-y-16">
        <ImageText
            imageSrc="imgtxt-1.png"
            title="Blur an image on the fly with the blur slider"
            description="Getting started with blurring photos couldn't be easier. You can experiment with blurring photos with any photo from our library or from your uploads. Simply select the photo, then click 'filter' and 'advanced options.' Slide to the right to blur, and to the left to sharpen."
            imagePosition="left"
        />
        <ImageText
            imageSrc="imgtxt-2.png"
            title="Blur a bit to add artful whimsy"
            description="Blurring isn't just to simulate the wonderful world of nearsightedness. There are many ways to enhance your designs with a bit of blurring. Gently inch the slider to see the effect that blur can have. Blur a landscape to..."
            imagePosition="right"
        />
    </div>
);

export default ImgTextCol;