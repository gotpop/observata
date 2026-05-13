import './style.css';

import * as React from 'react';

import { Button, Notice, Spinner, TextControl } from '@wordpress/components';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/editor';
import { useCallback, useState } from '@wordpress/element';

import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';

interface UnsplashImage {
	id: string;
	description: string;
	urls: {
		regular: string;
		small: string;
		thumb: string;
	};
	user: {
		name: string;
		username: string;
		portfolio_url: string;
	};
	links: {
		html: string;
	};
	dimensions: {
		width: number;
		height: number;
	};
}

interface SearchResponse {
	images: UnsplashImage[];
	total: number;
	total_pages: number;
	code?: string;
	message?: string;
}

const UnsplashSidebar: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<UnsplashImage[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isDownloading, setIsDownloading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const { editPost } = useDispatch('core/editor');

	const searchImages = useCallback(async (query: string, page: number = 1) => {
		if (!query.trim()) {
			setError('Please enter a search term');
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/wp-json/wp/v2/unsplash/search?query=${encodeURIComponent(query)}&page=${page}&per_page=12`, {
				headers: {
					'X-WP-Nonce': (window as typeof window & { wpApiSettings?: { nonce?: string } }).wpApiSettings?.nonce || '',
				},
			});
			const data: SearchResponse = await response.json();

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

	const handleSearch = useCallback((e: React.FormEvent) => {
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

	const handleImageSelect = useCallback(async (image: UnsplashImage) => {
		setIsDownloading(image.id);
		setError(null);

		try {
			const response = await fetch('/wp-json/wp/v2/unsplash/download', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': (window as typeof window & { wpApiSettings?: { nonce?: string } }).wpApiSettings?.nonce || '',
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
				editPost({ featured_media: data.attachment_id });
			}
		} catch {
			setError('Network error while downloading image. Please try again.');
		} finally {
			setIsDownloading(null);
		}
	}, [editPost]);

	return (
		<>
			<PluginSidebarMoreMenuItem target="observata-unsplash-sidebar">
				Unsplash Images
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				name="observata-unsplash-sidebar"
				title={__('Unsplash Images', 'observata')}
				icon="format-image"
			>
				<div className="unsplash-sidebar">
					<form onSubmit={handleSearch} className="unsplash-sidebar__search-form">
						<TextControl
							value={searchQuery}
							onChange={(value: string) => setSearchQuery(value)}
							placeholder="Search for images..."
							className="unsplash-sidebar__search-input"
						/>
						<Button
							type="submit"
							isPrimary
							disabled={isLoading || !searchQuery.trim()}
							className="unsplash-sidebar__search-button"
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
						<div className="unsplash-sidebar__loading">
							<Spinner />
							<p>{__('Searching images...', 'observata')}</p>
						</div>
					)}

					{!isLoading && searchResults.length > 0 && (
						<>
							<div className="unsplash-sidebar__grid">
								{searchResults.map((image: UnsplashImage) => (
									<div
										key={image.id}
										className="unsplash-sidebar__image-card"
										onClick={() => handleImageSelect(image)}
									>
										<img
											src={image.urls.thumb}
											alt={image.description || image.user.name}
											className="unsplash-sidebar__image"
											loading="lazy"
										/>
										<div className="unsplash-sidebar__image-overlay">
											{isDownloading === image.id ? (
												<Spinner />
											) : (
												<>
													<span className="dashicons dashicons-download"></span>
													<span>{__('Set as Featured Image', 'observata')}</span>
												</>
											)}
										</div>
										<div className="unsplash-sidebar__image-info">
											<span className="unsplash-sidebar__photographer">{image.user.name}</span>
											{image.dimensions.width && (
												<span className="unsplash-sidebar__dimensions">
													{image.dimensions.width} × {image.dimensions.height}
												</span>
											)}
										</div>
									</div>
								))}
							</div>

							{totalPages > 1 && (
								<div className="unsplash-sidebar__pagination">
									<Button
										onClick={handlePrevPage}
										disabled={currentPage === 1 || isLoading}
										isSmall
									>
										{__('Previous', 'observata')}
									</Button>
									<span className="unsplash-sidebar__page-info">
										{__('Page', 'observata')} {currentPage} {__('of', 'observata')} {totalPages}
									</span>
									<Button
										onClick={handleNextPage}
										disabled={currentPage >= totalPages || isLoading}
										isSmall
									>
										{__('Next', 'observata')}
									</Button>
								</div>
							)}
						</>
					)}

					{!isLoading && searchResults.length === 0 && !error && (
						<div className="unsplash-sidebar__empty">
							<p>{__('Search for images to get started.', 'observata')}</p>
						</div>
					)}
				</div>
			</PluginSidebar>
		</>
	);
};

registerPlugin('observata-unsplash-sidebar', {
	icon: 'format-image',
	render: UnsplashSidebar,
});