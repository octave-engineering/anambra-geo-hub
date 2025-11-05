import React from 'react';

export default function VideoSection() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Playlist</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive collection of geospatial tutorials and training sessions.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              width="100%"
              height="500"
              src="https://www.youtube.com/embed/videoseries?list=PLgxX4AQ_KUQ9oavFq9I8wZsqXW0N6VRDV"
              title="Featured Playlist"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg w-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
