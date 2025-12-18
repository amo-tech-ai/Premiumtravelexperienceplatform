import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { motion } from 'motion/react';

interface ExperienceGalleryProps {
  images: string[];
}

export const ExperienceGallery = ({ images }: ExperienceGalleryProps) => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12 mb-12">
        <h2 className="text-3xl font-serif text-slate-900 mb-2">Immersive Gallery</h2>
        <p className="text-slate-500">A visual journey through the experience.</p>
      </div>
      
      <div className="container mx-auto px-6 lg:px-12">
        <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}>
          <Masonry gutter="24px">
            {images.map((image, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="overflow-hidden rounded-xl cursor-zoom-in group"
              >
                <img
                  src={image}
                  style={{width: "100%", display: "block"}}
                  alt={`Gallery ${i}`}
                  className="group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </section>
  );
};
