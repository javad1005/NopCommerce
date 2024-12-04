(function ($) {
    $(document).ready(function () {

        var dependencies = [
            {
                module: "header",
                dependencies: ["attachDetach", "overlay", "perfectScrollbar"]
            },
            {
                module: "menu",
                dependencies: ["perfectScrollbar"]
            }
        ];

        var themeSettings = {
			
			// global settings

            productQuantity: {
                quantityInputSelector: '.qty-input',
                incrementSelectors: '.increase',
                decrementSelectors: '.decrease'
            },
			
			// responsive settings
			
			responsive: [
				{
                    breakpoint: 1025,
                    settings: {
						header: {
                            activeClass: 'active',
                            modules: [
								{
                                    opener: '.responsive-nav-wrapper .menu-button',
                                    closer: '.close-menu',
                                    content: '.header-menu',
									scrollbar: false,
                                    overlay: true,
									disablePageScroll: true
                                },
                                {
                                    opener: '.responsive-nav-wrapper .personal-button',
                                    closer: '.close-links',
                                    content: '.header-links-wrapper',
                                    overlay: true,
                                    disablePageScroll: true,
                                },
                                {
                                    opener: '.responsive-nav-wrapper .search-button',
                                    closer: '.close-search',
                                    content: '.store-search-box',
                                    overlay: true,
                                    disablePageScroll: true,
                                },
                                {
                                    opener: '.filter-button',
                                    closer: '.close-filters',
                                    content: '.nopAjaxFilters7Spikes',
                                    scrollbar: false,
                                    overlay: true,
                                    disablePageScroll: true
                                }
                            ]
                        },
                        filters: {
                            closePanelAfterFiltrationDataAttribute: 'closefilterspanelafterfiltrationinmobile'
                        },
						overlay: {
							overlayElementSelector: '.overlayOffCanvas',
							overlayClass: 'active',
							noPageScrollClass: 'scrollYRemove'
                        },
						toggle: {
                            blocks: [
                                {
                                    opener: '.block:not(.filter-block) .title',
                                    content: '.block:not(.filter-block) .listbox',
                                    activeClassOpener: 'opened',
                                    animation: {
                                        type: 'slide',
                                        speed: 'slow'
                                    }
                                },
                                {
                                    opener: '.footer-block .title',
                                    content: '.footer-block .list',
                                    activeClassOpener: 'opened',
                                    animation: {
                                        type: 'slide',
                                        speed: 'slow'
                                    }
                                }
                            ]
                        },
                        equalizer: {
                            blocks: [
                                {
                                    selector: '.cart td.product'
                                }
                            ]
                        }
                    }
                }
			]
        };

        var theme = new window.sevenSpikesTheme(themeSettings, dependencies, false);

        theme.init();

        // invoke custom functions

        handleMobileNavigation();
        updateMobileCartQuantity();
        handleMenuCategoryItems();
        setMenuDropdownPosition();
        closePopupOnOverlayClick();
        handleProductOverview();
        applyAdditionalClasses();
        handleShoppingCartTable();
        clearShoppingCartButton();
        handleCheckoutMethods();



        //   C U S T O M  F U N C T I O N S



        // Set up class names when the navigation panel sticks at the top of the screen, and when the page is scrolled up.

        function handleMobileNavigation() {

            var targetElement = $('.responsive-nav-wrapper');
            var demoStrip = $('.header-storetheme');
            var lastScrollTop = 0;

            var queryElement = document.querySelector('.responsive-nav-wrapper');
            var observer = new IntersectionObserver(
                ([e]) => e.target.classList.toggle('pinned', e.intersectionRatio < 1),
                { threshold: [1] }
            );
            observer.observe(queryElement); // detect when sticky element sticks

            if ($(window).outerWidth() >= themeSettings['responsive'][0]['breakpoint']) {
                setTimeout(function () {
                    targetElement.removeClass('pinned');
                }, 100); // set delay, or the class will be added again
            }
            $(document).on('themeBreakpoint', function (event, settings, breakpoint) {
                if (breakpoint !== null) {
                    targetElement.addClass('pinned up'); // mobile
                }
                else {
                    targetElement.removeClass('pinned up'); // desktop
                }
            });
            $(window).on('scroll', function () {

                var scrollTop = $(this).scrollTop();

                if (scrollTop > lastScrollTop) {
                    targetElement.removeClass('up demo'); // scroll down
                }
                else {
                    targetElement.addClass('up'); // scroll up

                    if (demoStrip.length > 0) {
                        targetElement.addClass('demo'); // nop-templates demo strip
                    }
                }
                lastScrollTop = scrollTop;
            });
        }



        // Update the "mobile" quantity marker when a product is removed from the flyout cart on desktop. It uses the "desktop" marker which is updated by the core script.

        function updateMobileCartQuantity() {

            $(document).on('removeItemFlyoutCart', function () {

                var productsCountElement = $('.cart-link .cart-qty'); // desktop
                var mobileQtyElement = $('.cart-button .cart-qty'); // mobile

                if (productsCountElement.length && mobileQtyElement.length) {

                    var regex = /\d+/;
                    var productsCountString = productsCountElement.text();
                    var productsCount = productsCountString.match(regex) || [0];

                    mobileQtyElement.text(productsCount[0]);
                }
            });
        }



        // Clone all category menu items and move them into a separate menu. This can't be done in the source code because of widget zone duplication.

        function handleMenuCategoryItems() {

            if ($('.header-menu .nav-panel.modified').length > 0) {

                var targetElement = $('.header-menu .drop-menu .sublist');
                var rootCategoryItems = $('.top-menu .root-category, .mega-menu .root-category'); // exclude mega-menu-responsive

                rootCategoryItems.clone(true).appendTo(targetElement);
            }
            if (!$('.header-menu .mega-menu').length > 0) {
                $('.header-menu .drop-menu').addClass('default');
            }
        }



        // Dynamic offset for Mega Menu dropdown (grid) panels, depending on the space between the top-level menu item and the beginning of the menu.

        function setMenuDropdownPosition() {

            var rootMenuItem = $('.mega-menu > li');
            var contentDirection = $('html').attr('dir');
            var calculateOffset;

            rootMenuItem.on('mouseenter', function () {

                if (contentDirection == 'rtl') {
                    calculateOffset = ($(this).parent().width() - $(this).position().left - $(this).width()) / 2 * -1;
                    $(this).children('.dropdown').css('right', calculateOffset);
                }
                else {
                    calculateOffset = $(this).position().left / 2 * -1;
                    $(this).children('.dropdown').css('left', calculateOffset);
                }
            });
        }



        // Workaround for closing "ui-dialog" popups from their screen overlay (as the overlay is a pseudo element, it can't be targeted with JS).

        function closePopupOnOverlayClick() {

            $(document).mousedown(function (e) {
                // detect left click ("1" = left click, "2" = middle click, "3" = right click)
                if (e.which == 1) {
                    // "stopPropagation" will deactivate the "Close" button, so "target" is used instead
                    if (!$(e.target).closest('.ui-dialog-titlebar, .ui-dialog-content').length > 0) {
                        $('.ui-dialog-titlebar-close').click();
                    }
                }
            });
        }



        // Set up additional class names on Product Details pages. Set up down-scrolling for associated (grouped) products.

        function handleProductOverview() {

            $('.overview.primary').children().last().addClass('last');

            var handleQuantityAttributes = function () {
                $('.attributes .qty-box').siblings('select').addClass('qty-select');
            };
            handleQuantityAttributes();
            $(document).on('nopAjaxCartMiniProductDetailsViewShown', handleQuantityAttributes);

            $('.variant-scroll-button').on('click', function () {
                $('html, body').animate({
                    scrollTop: $('.product-variant-list').offset().top - 30
                }, 1000);
            });
        }



        // Set up additional class names for Featured Categories, Product Filters, Account pages, Cart Collaterals, Checkout Adresses, Profile page, and Private Messages.

        function applyAdditionalClasses() {

            var categoryItemBox = $('.home-page-category-grid .category-item');
            categoryItemBox.each(function () {
                if ($(this).find('.sub-category-list').length > 0) {
                    $(this).addClass('tree');
                }
            }); // distinguish featured categories with and without subcategories

            $('.block.product-filters').removeClass('block').children().addClass('block').find('.filter-title').addClass('title');

            $('.password-recovery-page form, .account-page, .return-request-page, .user-agreement-page').find('.buttons, .add-button').addClass('account-buttons');
            $('.password-recovery-page form, .account-page, .return-request-page, .user-agreement-page').find('.button-1').addClass('account-button');

            var cartCollaterals = $('.cart-collaterals');
            if (cartCollaterals.children().length == 0) { cartCollaterals.addClass('empty');
            } // :empty pseudo class doesn't work for empty elements with white space inside, so using JS instead

            $('.checkout-page .address-list-page').addClass('edit-buttons').removeClass('address-list-page');

            $('.profile-page .latest-posts').find('.quote').prev().addClass('poster');
            $('.private-messages col:last-child').addClass('date').removeAttr('width');
        }



        // Handle responsive Shopping Cart tables on mobile resolutions ("add-to-cart" checkboxes, cell footer, and cell height).

        function handleShoppingCartTable() {

            // modify add-to-cart checkboxes and labels to work like buttons 

            $('.cart .add-to-cart label').on('click', function () {
                // detect if label text is visible or not, it's only visible on mobile resolutions
                if ($(this).width() > 30) {
                    $(this).siblings('input').attr('checked', true);
                    $('#addproduct').click();
                }
            });
            // constant height of cell footers depending on the number of elements present
            var subtotalTableCell = $('.cart td.subtotal');

            subtotalTableCell.each(function () {
                if ($(this).children('.discount').length > 0) {
                    $(this).siblings('.unit-price').addClass('hide');
                }
            });
        }



        // This activates the custom "Clear Shopping Cart" button on Shopping Cart page (it's an emulation of the "Update Cart" functionality).

        function clearShoppingCartButton() {

            $('.cart-buttons .clear-cart-button').on('click', function (e) {
                e.preventDefault();
                $('.cart [name="removefromcart"]').attr('checked', 'checked');
                $('.cart-buttons .update-cart-button').click();
            });
        }



        // Detect currently active shipping/payment method and apply custom behavior. Modify class names for consistency.

        function handleCheckoutMethods() {

            var targetElement = $('.method-list li');

            targetElement.each(function () {
                if ($(this).find('input').is(':checked')) {
                    $(this).addClass('selected');
                }
            });
            targetElement.on('click', function () {
                $(this).find('input').prop('checked', true);
                $(this).addClass('selected').siblings('').removeClass('selected');
            });

            $('.method-list .payment-description').toggleClass('payment-description method-description');

            if ($('.payment-info td').length > 1) {
                $('.payment-info tr').addClass('inputs');
            }
        }



        // Trigger additional event on OPC step load. Use the event to apply script to OPC (html markup is not loaded until step load).

        if (window.Checkout) { // check if OPC is present

            var setStepResponse = Checkout.setStepResponse;
            Checkout.setStepResponse = function (response) {
                setStepResponse(response);
                $(document).trigger("opcStepLoad");
            };
            $(document).on("opcStepLoad", function () {
                handleCheckoutMethods();
            });
        }
        // Re-apply additional checkout class names on ROPC panel load and on Payment Method refresh (otherwise they won't work in ROPC)
        $(document).on('nopOnePageCheckoutPanelsLoadedEvent', function () {
            handleCheckoutMethods();
        });
        $(document).on('SevenSpikesROPCPaymentMethodsRefresh', function () {
            handleCheckoutMethods();
        });
        


        // FOOTABLE.js initialization ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (typeof $('body').footable == 'function') {
            $('.recurring-payments .data-table, .downloadable-products-page .data-table, .reward-points-history .data-table, .checkout-page .cart, .order-details-page .data-table, .return-request-page .data-table, .forum-table, .private-messages-page .data-table').footable();
        }
        if ($('.checkout-page').length > 0) {
            $(document).ajaxSuccess(function () {
                if ($('.order-summary-content .cart').length > 0) {
                    $('.order-summary-content .cart').footable();
                }
            });
        }

    }); // document.ready end


    // Bypass perfect-scrollbar.js, no other way to disable it as it's invoked by the Core script. Should be removed from Head.cshtml first.
    $.fn.perfectScrollbar = function () { return };

})(jQuery);