import React, { useState } from 'react';

const OptimizedImage = ({
    src,
    alt,
    className = "",
    imgClassName = "",
    priority = false,
    ...props
}) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`} {...props}>
            {!loaded && !error && (
                <div className="absolute inset-0 bg-gray-800/50 animate-pulse" />
            )}

            <img
                src={src}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : 'auto'}
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                    loaded ? 'opacity-100' : 'opacity-0'
                } ${imgClassName}`}
                style={{ opacity: error ? 0 : undefined }}
            />
        </div>
    );
};

export default OptimizedImage;
