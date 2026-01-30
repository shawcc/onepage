import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageBuilder from '../components/ImageBuilder';

const ImageStudio: React.FC = () => {
  const navigate = useNavigate();

  const handleSave = (newImageUrl: string) => {
    // In standalone mode, we just trigger a download of the image
    // The ImageBuilder's onSave gives us a dataURL
    const link = document.createElement('a');
    link.href = newImageUrl;
    link.download = `onepage-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    // Navigate back to home page
    navigate('/');
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
       {/* Re-use ImageBuilder but we need to trick it to show always since it was designed as a modal */}
       {/* Actually, ImageBuilder has a fixed inset-0 z-[100] layout. So we can just render it. */}
       {/* However, the close button in ImageBuilder calls onClose. We might want to hide it or redirect. */}
       <ImageBuilder 
         initialImage="" 
         onSave={handleSave} 
         onClose={handleClose} 
       />
    </div>
  );
};

export default ImageStudio;
