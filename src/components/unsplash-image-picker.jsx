import './unsplash-image-picker/style.css';

import { Button, Modal, Notice, Spinner, TextControl } from '@wordpress/components';
import { useCallback, useState } from '@wordpress/element';

import { __ } from '@wordpress/i18n';

const UnsplashImagePicker = ({ isOpen, onClose, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(null);
    const [error, setError] = useState(null);

    const searchImages = useCallback(async (query, page = 1) => {
        if (!query.trim()) {
            setError('Please enter a search term');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/wp-json/wp/v2/unsplash/search?query=${encodeURIComponent(query)}&page=${page}&per_page=12`, {
                headers: {
                    'X-WP-Nonce': window.wpApiSettings?.nonce || '',
                },
            });
            const data = await response.json();

            if (!response.ok) {
                if (data.code === 'unsplash_api_key_missing') {
                    setError('Unsplash API key is not configured. Please contact your administrator.');
                } else {
                    setError(data.message || 'Failed to search images. Please try again.');
                }
                setSearchResults([]);
                return;
            }

            setSearchResults(data.images);
            setTotalPages(data.total_pages);
            setCurrentPage(page);
        } catch {
            setError('Network error. Please check your connection and try again.');
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        searchImages(searchQuery, 1);
    }, [searchQuery, searchImages]);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            searchImages(searchQuery, currentPage + 1);
        }
    }, [currentPage, totalPages, searchQuery, searchImages]);

    const handlePrevPage = useCallback(() => {
        if (currentPage > 1) {
            searchImages(searchQuery, currentPage - 1);
        }
    }, [currentPage, searchQuery, searchImages]);

    const handleImageSelect = useCallback(async (image) => {
        setIsDownloading(image.id);
        setError(null);

        try {
            const response = await fetch('/wp-json/wp/v2/unsplash/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.wpApiSettings?.nonce || '',
                },
                body: JSON.stringify({
                    image_url: image.urls.regular,
                    photographer: image.user.name,
                    unsplash_url: image.links.html,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to download image. Please try again.');
                return;
            }

            if (data.success && data.attachment_id) {
                onSelect({
                    id: data.attachment_id,
                    url: data.url,
                    alt: image.description || image.user.name,
                    photographer: image.user.name,
                    sourceUrl: image.links.html,
                });
                onClose();
            }
        } catch {
            setError('Network error while downloading image. Please try again.');
        } finally {
            setIsDownloading(null);
        }
    }, [onSelect, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <Modal
            title={__('Select from Unsplash', 'observata')}
            onRequestClose={onClose}
            className="unsplash-image-picker-modal"
            size="large"
        >
            <div className="unsplash-image-picker">
                <form onSubmit={handleSearch} className="unsplash-image-picker__search-form">
                    <TextControl
                        value={searchQuery}
                        onChange={(value) => setSearchQuery(value)}
                        placeholder={__('Search for images...', 'observata')}
                        className="unsplash-image-picker__search-input"
                    />
                    <Button
                        type="submit"
                        isPrimary
                        disabled={isLoading || !searchQuery.trim()}
                        className="unsplash-image-picker__search-button"
                    >
                        {__('Search', 'observata')}
                    </Button>
                </form>

                {error && (
                    <Notice status="error" isDismissible={false}>
                        {error}
                    </Notice>
                )}

                {isLoading && (
                    <div className="unsplash-image-picker__loading">
                        <Spinner />
                        <p>{__('Searching images...', 'observata')}</p>
                    </div>
                )}

                {!isLoading && searchResults.length > 0 && (
                    <>
                        <div className="unsplash-image-picker__grid">
                            {searchResults.map((image) => (
                                <div
                                    key={image.id}
                                    className="unsplash-image-picker__image-card"
                                    onClick={() => handleImageSelect(image)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleImageSelect(image);
                                        }
                                    }}
                                >
                                    <img
                                        src={image.urls.thumb}
                                        alt={image.description || image.user.name}
                                        className="unsplash-image-picker__image"
                                        loading="lazy"
                                    />
                                    <div className="unsplash-image-picker__image-overlay">
                                        {isDownloading === image.id ? (
                                            <Spinner />
                                        ) : (
                                            <>
                                                <span className="dashicons dashicons-download"></span>
                                                <span>{__('Select', 'observata')}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="unsplash-image-picker__image-info">
                                        <span className="unsplash-image-picker__photographer">
                                            {image.user.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="unsplash-image-picker__pagination">
                            <Button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                isSecondary
                            >
                                {__('Previous', 'observata')}
                            </Button>
                            <span className="unsplash-image-picker__page-info">
                                {__('Page', 'observata')} {currentPage} {__('of', 'observata')} {totalPages}
                            </span>
                            <Button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                isSecondary
                            >
                                {__('Next', 'observata')}
                            </Button>
                        </div>
                    </>
                )}

                {!isLoading && searchResults.length === 0 && !error && (
                    <div className="unsplash-image-picker__empty">
                        <p>{__('Enter a search term to find images', 'observata')}</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default UnsplashImagePicker;