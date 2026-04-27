<?php
$locations = $attributes['locations'] ?? 'Denmark | Sweden | Finland | Norway';
$copyright = $attributes['copyright'] ?? '© Observata AB 2026';
$contact_email = $attributes['contactEmail'] ?? 'sales@observata.com';
$contact_address = $attributes['contactAddress'] ?? 'Trade Center Halmstad Box 837 SE - 30118 Halmstad Sweden';
?>

<footer id="footer" role="contentinfo">
    <div class="footer-content">
        <div class="footer-top">
            <div class="footer-logo">
                <a href="{{ site.url }}" title="{{ site.name }}">
                    <h1>Observata</h1>
                </a>
            </div>

            <div class="footer-links">
                <a href="https://observata.com/managed-detection-and-response-services/" class="footer-link">Services</a>
                <a href="https://observata.com/pricing/" class="footer-link">Pricing</a>
                <a href="https://observata.com/resources/" class="footer-link">Resources</a>
                <a href="https://observata.com/about-us/" class="footer-link">About Us</a>
                <a href="https://observata.com/contact-us/" class="footer-link">Contact Us</a>
                <a href="https://observata.com/observability-overview/" class="footer-link">Observability</a>
                <a href="https://observata.com/cybersecurity-overview/" class="footer-link">Cybersecurity</a>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="footer-locations">
                <p><?php echo esc_html($locations); ?></p>
            </div>

            <div class="footer-contact">
                <div class="footer-contact-item">
                    <p class="footer-label">Email</p>
                    <p class="footer-value"><a href="mailto:<?php echo esc_html($contact_email); ?>"><?php echo esc_html($contact_email); ?></a></p>
                </div>

                <div class="footer-contact-item">
                    <p class="footer-label">Address</p>
                    <p class="footer-value"><?php echo esc_html($contact_address); ?></p>
                </div>
            </div>

            <div class="footer-copyright">
                <p><?php echo esc_html($copyright); ?></p>
            </div>
        </div>
    </div>
</footer>
