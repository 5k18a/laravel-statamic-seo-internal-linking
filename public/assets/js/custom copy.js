/* =====================================
    Template Name: Orion Construction - Tailwind HTML5 Template
    Author Name: WebbyCrown
    Description: Orion Construction - Tailwind HTML5 Template.
    Version:1.0
========================================*/

/*======================================
[ JS Table of contents ]
01. General Open JS
    + Mobile menu
    + Mobile menu dropdown
    + AOS
    + Page scroll to Header sticky

02. Slider Open JS
    + What we do slider
    + Testimonial slider
    + Customer Reviews slider
    + Photos Gallery slider
    + Trending Attractions slider
    + Popular Tours slider
    + Testimonial full slider

03. Popup Open JS
    + Cookie popup js
    + Newsletter Popup JS
    + Our Teachers popup
    + Enquiry form Popup JS
04. Preloader JS
05. Isotope JS



========================================*/

(function ($) {
  journea_travel_agency = {
    init: function () {
      // Home one js
      this.general_open();
      this.slider_open();
      this.popup_open();
      this.Isotope_js();
      this.Preloader_js();
    },

    /*======================================
     01. General Open JS
    ========================================*/
    general_open: function () {
      /* Mobile menu */
      $(document).on(
        "click",
        ".toggle-menu-button a, .mobile-menu .menu-close a",
        function () {
          $(".mobile-menu").toggleClass("open");
          //$(this).toggleClass("active");
        },
      );

      $(document).on("click", ".mobile-toggle", function () {
        $("#navbar-default").toggleClass("open");
        $(this).toggleClass("active");
      });

      /* Mobile menu dropdown*/
      if ($(window).width() <= 991) {
        $(".main-menu ul > li").each(function (i) {
          if ($(this).has(".dropdown-menu").length) {
            $(this).find(".dropdown-menu").addClass("sub-menu");
            $(this).find("> a").after('<span class="caret-arrow"></span>');
            // $(this).find("> .sub-menu").css("display", "none");
          }
        });
        $(".main-menu ul li .caret-arrow").click(function () {
          var catSubUl = $(this).next(".sub-menu");
          var catSubli = $(this).closest("li");
          if (catSubUl.is(":hidden")) {
            //$("#window > ul > li .sub-menu").slideUp();
            catSubUl.slideDown();
            //$('.caret').removeClass('active');
            $(this).addClass("sub-active");
            catSubli.addClass("sub-active");
          } else {
            catSubUl.slideUp();
            $(this).removeClass("sub-active");
            catSubli.removeClass("sub-active");
          }
        });
      }

      // =======================
      // Navbar Dropdown Start
      // =======================
      document.addEventListener("DOMContentLoaded", () => {
        const navRight = document.querySelector(".nav-right");
        const dropdowns = document.querySelectorAll(".dropdown");
        const headerEl = document.querySelector(".header");
        const pageOverlay = document.getElementById("pageOverlay");
        const HOVER_OPEN_DELAY = 150; // delay in ms before opening dropdown / overlay / bg-white
        const hoverTimers = new Map();
        const ANIMATION_MS = 100;

        const MENU_CLOSE_DELAY = 180;
        const OVERLAY_HIDE_DELAY = 300;

        const openMenus = new Set();
        const closeTimers = new Map();
        let overlayTimer = null;
        let isSearchOpen = false;

        const isDesktop = () => window.innerWidth >= 991;
        const anyDropdownHovered = () =>
          Array.from(dropdowns).some((d) => d.matches(":hover"));
        const anyMenuOpen = () =>
          document.querySelector(".dropdown-menu.open") !== null;

        // ---------------- Overlay helpers ----------------
        let overlayHideTimer = null;

        function showOverlayImmediate() {
          if (!pageOverlay) return;
          clearTimeout(overlayHideTimer);
          pageOverlay.classList.remove("hidden");
          requestAnimationFrame(() => {
            pageOverlay.classList.add("opacity-100");
            pageOverlay.classList.remove("opacity-0");
          });
        }

        function hideOverlayImmediate() {
          if (!pageOverlay) return;
          clearTimeout(overlayHideTimer);
          overlayHideTimer = setTimeout(() => {
            if (!anyMenuOpen() && !isHoveringAnyDropdown()) {
              pageOverlay.classList.remove("opacity-100");
              pageOverlay.classList.add("opacity-0");
              setTimeout(() => {
                if (!anyMenuOpen() && !isHoveringAnyDropdown()) {
                  pageOverlay.classList.add("hidden");
                }
              }, ANIMATION_MS);
            }
          }, 100);
        }

        function isHoveringAnyDropdown() {
          return Array.from(dropdowns).some((d) => d.matches(":hover"));
        }

        function updateOverlayState() {
          if (anyMenuOpen()) {
            showOverlayImmediate();
            navRightSetWhite();
          } else {
            hideOverlayImmediate();
            if (!isSearchOpen && !isMobileMenuOpen()) navRightSetTransparent();
          }
        }

        // ---------------- navRight color helpers ----------------
        function navRightSetWhite() {
          if (!navRight) return;
          navRight.classList.add("bg-white", "text-black");
          navRight.querySelectorAll(".navbar > li > a").forEach((a) => {
            a.classList.add("text-black");
            a.classList.remove("text-white");
          });
          if (typeof mobileMenuToggle !== "undefined" && mobileMenuToggle) {
            mobileMenuToggle.classList.add("text-black");
            mobileMenuToggle.classList.remove("text-white");
          }
          if (typeof searchButton !== "undefined" && searchButton) {
            searchButton.classList.add("text-black");
            searchButton.classList.remove("text-white");
          }
          if (typeof updateAllSVGFills === "function") updateAllSVGFills();
        }

        function navRightSetTransparent() {
          if (!navRight) return;
          navRight.classList.remove("bg-white", "!bg-white", "text-black");
          navRight.classList.add("bg-transparent");
          navRight.querySelectorAll(".navbar > li > a.nav-tab").forEach((a) => {
            a.classList.remove("text-black");
            a.classList.add("text-white");
          });
          if (typeof mobileMenuToggle !== "undefined" && mobileMenuToggle) {
            mobileMenuToggle.classList.remove("text-black");
            mobileMenuToggle.classList.add("text-white");
          }
          if (typeof searchButton !== "undefined" && searchButton) {
            searchButton.classList.remove("text-black");
            searchButton.classList.add("text-white");
          }
          if (typeof updateAllSVGFills === "function") updateAllSVGFills();
        }

        function navRightRemoveWhite() {
          if (!navRight) return;
          navRight.classList.remove(
            "bg-transparent",
            "!bg-white",
            "text-white",
          );
          navRight.classList.add("bg-white");
          navRight.querySelectorAll(".navbar > li > a.nav-tab").forEach((a) => {
            a.classList.add("text-black");
            a.classList.remove("text-white");
          });
          if (typeof mobileMenuToggle !== "undefined" && mobileMenuToggle) {
            mobileMenuToggle.classList.add("text-black");
            mobileMenuToggle.classList.remove("text-white");
          }
          if (typeof searchButton !== "undefined" && searchButton) {
            searchButton.classList.add("text-black");
            searchButton.classList.remove("text-white");
          }
          if (typeof updateAllSVGFills === "function") updateAllSVGFills();
        }

        // ---------------- animations ----------------
        function animateOpenMenu(menu) {
          if (!menu || menu.classList.contains("open")) return;
          clearTimeout(closeTimers.get(menu));
          closeTimers.delete(menu);

          menu.classList.remove("hidden");
          menu.style.maxHeight = "0px";
          menu.style.opacity = "0";
          menu.style.overflow = "hidden";
          void menu.offsetHeight;
          menu.style.transition = `max-height ${ANIMATION_MS}ms ease, opacity ${ANIMATION_MS}ms ease`;
          menu.style.maxHeight = menu.scrollHeight + "px";
          menu.style.opacity = "1";

          setTimeout(() => {
            menu.classList.add("open");
            menu.style.maxHeight = "none";
            menu.style.transition = "";
            menu.style.overflow = "";
            openMenus.add(menu);
            updateOverlayState();
          }, ANIMATION_MS);
        }

        function animateCloseMenu(menu) {
          if (!menu || menu.dataset.closing === "1") return;
          menu.dataset.closing = "1";
          clearTimeout(closeTimers.get(menu));
          closeTimers.delete(menu);

          menu.style.maxHeight = menu.scrollHeight + "px";
          menu.style.opacity = "1";
          menu.style.overflow = "hidden";
          void menu.offsetHeight;
          menu.style.transition = `max-height ${ANIMATION_MS}ms ease, opacity ${ANIMATION_MS}ms ease`;
          menu.style.maxHeight = "0px";
          menu.style.opacity = "0";

          openMenus.delete(menu);

          setTimeout(() => {
            menu.classList.add("hidden");
            menu.classList.remove("open");
            menu.style.maxHeight = "";
            menu.style.opacity = "";
            menu.style.transition = "";
            menu.style.overflow = "";
            delete menu.dataset.closing;
            updateOverlayState();
          }, ANIMATION_MS);
        }

        // ---------------- open/close scheduling ----------------
        function openDropdown(dropdown) {
          if (!dropdown) return;
          const menu =
            dropdown.querySelector(".dropdown-menu") ||
            dropdown.querySelector("ul");
          if (!menu) return;
          clearTimeout(closeTimers.get(menu));
          closeTimers.delete(menu);
          animateOpenMenu(menu);
          updateOverlayState();
        }

        function closeDropdown(dropdown) {
          if (!dropdown) return;
          const menu =
            dropdown.querySelector(".dropdown-menu") ||
            dropdown.querySelector("ul");
          if (!menu) return;
          if (closeTimers.has(menu)) return;
          const timer = setTimeout(() => {
            animateCloseMenu(menu);
            closeTimers.delete(menu);
          }, MENU_CLOSE_DELAY);
          closeTimers.set(menu, timer);
        }

        // ---------------- attach handlers ----------------
        dropdowns.forEach((dropdown) => {
          const toggle = dropdown.querySelector(".dropdown-toggle");
          const backBtn = dropdown.querySelector(".back-btn");

          backBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            const menu =
              dropdown.querySelector(".dropdown-menu") ||
              dropdown.querySelector("ul");
            animateCloseMenu(menu);
            updateOverlayState();
          });

          toggle?.addEventListener("click", (e) => {
            if (isDesktop()) return;

            const href = toggle.getAttribute("href");
            if (href === "#" || href === "javascript:;" || !href)
              e.preventDefault();

            const menu =
              dropdown.querySelector(".dropdown-menu") ||
              dropdown.querySelector("ul");
            if (!menu) return;

            if (menu.classList.contains("open")) {
              clearTimeout(closeTimers.get(menu));
              closeTimers.delete(menu);
              animateCloseMenu(menu);
            } else {
              clearTimeout(closeTimers.get(menu));
              closeTimers.delete(menu);
              animateOpenMenu(menu);
            }
            updateOverlayState();
          });

          // Desktop hover
          if (isDesktop()) {
            dropdown.addEventListener("mouseenter", () => {
              const menu =
                dropdown.querySelector(".dropdown-menu") ||
                dropdown.querySelector("ul");
              if (!menu) return;

              // clear any existing close timers
              clearTimeout(closeTimers.get(menu));
              closeTimers.delete(menu);

              // set a delay before opening
              const timer = setTimeout(() => {
                openDropdown(dropdown); // open dropdown menu
                showOverlayImmediate(); // show overlay
                navRightSetWhite(); // set nav bg-white
              }, HOVER_OPEN_DELAY);

              hoverTimers.set(dropdown, timer);
            });

            dropdown.addEventListener("mouseleave", () => {
              const menu =
                dropdown.querySelector(".dropdown-menu") ||
                dropdown.querySelector("ul");
              if (!menu) return;

              // clear the hover timer if mouse leaves before delay
              if (hoverTimers.has(dropdown)) {
                clearTimeout(hoverTimers.get(dropdown));
                hoverTimers.delete(dropdown);
              }

              closeDropdown(dropdown); // close dropdown menu
              updateOverlayState(); // update overlay / navRight color
            });
          }

          // Nested submenu
          const nestedLinks = dropdown.querySelectorAll("li > a");
          nestedLinks.forEach((link) => {
            const li = link.parentElement;
            if (!li) return;
            const submenu = li.querySelector("ul, .dropdown-menu");
            const arrow = li.querySelector(".dropdown-arrow");

            if (submenu) {
              li.addEventListener("click", (e) => {
                if (isDesktop()) return;
                if (submenu.classList.contains("open")) return;
                e.preventDefault();
                e.stopPropagation();
                animateOpenMenu(submenu);
                arrow?.classList.add("rotate-180");
                updateOverlayState();
              });
            }
          });
        });

        // Click outside to close (mobile)
        document.addEventListener("click", (e) => {
          if (!e.target.closest(".dropdown") && window.innerWidth < 991) {
            dropdowns.forEach((d) => {
              const menu =
                d.querySelector(".dropdown-menu") || d.querySelector("ul");
              if (menu) animateCloseMenu(menu);
            });
            removeNavWhiteIfNoSearch();
            hideOverlayImmediate();
          }
        });

        // Sticky header
        window.addEventListener("scroll", () => {
          if (window.scrollY > 0) headerEl?.classList.add("sticky-header");
          else headerEl?.classList.remove("sticky-header");

          if (
            !isSearchOpen &&
            window.scrollY === 0 &&
            !navbarDefault.classList.contains("block") &&
            !anyMenuOpen()
          )
            removeNavWhiteIfNoSearch();
          if (typeof updateAllSVGFills === "function") updateAllSVGFills();
        });

        function isMobileMenuOpen() {
          return (
            mobileMenuToggle?.classList.contains("open") &&
            navbarDefault?.classList.contains("block")
          );
        }

        function updateNavRightForMobileMenu() {
          if (!navRight) return;
          if (isMobileMenuOpen()) {
            navRightSetWhite();
          } else if (!isSearchOpen) {
            navRightSetTransparent();
          }
        }

        function removeNavWhiteIfNoSearch() {
          if (!navRight) return;
          const menuOpen = anyMenuOpen();
          const mobileOpen = isMobileMenuOpen();
          if (!isSearchOpen && !menuOpen && !mobileOpen) {
            navRight.classList.remove("bg-white", "text-black", "lg:relative");
            navRight.classList.add("bg-transparent");

            navRight
              .querySelectorAll(".navbar > li > a.nav-tab")
              .forEach((a) => {
                a.classList.remove("text-black");
                a.classList.add("text-white");
              });

            if (typeof mobileMenuToggle !== "undefined" && mobileMenuToggle) {
              mobileMenuToggle.classList.remove("text-black");
              mobileMenuToggle.classList.add("text-white");
            }

            if (typeof searchButton !== "undefined" && searchButton) {
              searchButton.classList.remove("text-black");
              searchButton.classList.add("text-white");
            }

            if (typeof updateAllSVGFills === "function") updateAllSVGFills();
          }
        }

        // --- Search Bar Logic ---
        const searchButton = document.getElementById("searchButton");
        const searchBox = document.getElementById("searchBox");
        const searchInput = document.getElementById("searchInput");
        const closeBtnMobile = document.getElementById("closeSearch");
        const closeBtnDesktop = document.getElementById("searchCloseInside");
        const mobileMenuToggle =
          document.querySelector(".mobile-toggle") ||
          document.getElementById("menuToggle");
        const navbarDefault = document.getElementById("navbar-default");

        function openSearch() {
          isSearchOpen = true;

          navRight.classList.add("lg:relative", "bg-white", "text-black");
          navRight.classList.remove("bg-transparent");
          navRight.querySelectorAll(".navbar > li > a").forEach((a) => {
            a.classList.add("text-black");
            a.classList.remove("text-white");
          });

          if (mobileMenuToggle?.classList.contains("open")) {
            mobileMenuToggle.classList.remove("open", "active");
          }

          if (window.innerWidth >= 991) {
            searchBox.classList.remove("lg:w-full");
            searchBox.classList.add("lg:w-0");
            searchBox.classList.remove("max-h-screen", "max-h-0");

            // fade in desktop close button AFTER a delay
            if (closeBtnDesktop) {
              closeBtnDesktop.classList.add("opacity-0", "pointer-events-none");
              setTimeout(() => {
                if (isSearchOpen) {
                  closeBtnDesktop.classList.remove(
                    "opacity-0",
                    "pointer-events-none",
                  );
                  closeBtnDesktop.classList.add("opacity-100");
                }
              }, 300); // delay before showing
            }
          } else {
            searchBox.classList.remove("translate-y-0");
            searchBox.classList.add("-translate-y-1/2");
            searchBox.classList.remove("max-h-screen");
            searchBox.classList.add("max-h-0");

            closeBtnMobile.classList.remove("hidden");
            searchButton.classList.add("hidden");
          }

          searchBox.classList.remove("hidden");
          searchBox.classList.add("flex");

          void searchBox.offsetWidth; // force reflow

          if (window.innerWidth >= 991) {
            searchBox.classList.remove("lg:w-0");
            searchBox.classList.add("lg:w-full");
          } else {
            searchBox.classList.remove("-translate-y-1/2");
            searchBox.classList.add("translate-y-0");
            searchBox.classList.remove("max-h-0");
            searchBox.classList.add("max-h-screen");
          }

          setTimeout(() => searchInput.focus(), 300);
          updateAllSVGFills();
        }

        function closeSearch() {
          isSearchOpen = false;
          navRightSetTransparent();

          if (window.innerWidth >= 991) {
            searchBox.classList.remove("lg:w-full");
            searchBox.classList.add("lg:w-0");

            // immediately hide desktop close button
            if (closeBtnDesktop) {
              closeBtnDesktop.classList.remove("opacity-100");
              closeBtnDesktop.classList.add("opacity-0", "pointer-events-none");
            }
          } else {
            searchBox.classList.remove("translate-y-0");
            searchBox.classList.add("-translate-y-1/2");
            searchBox.classList.remove("max-h-screen");
            searchBox.classList.add("max-h-0");

            closeBtnMobile.classList.add("hidden");
            searchButton.classList.remove("hidden");
          }

          searchInput.value = "";

          setTimeout(() => {
            if (!isSearchOpen) {
              searchBox.classList.remove("flex");
              searchBox.classList.add("hidden");
              removeNavWhiteIfNoSearch();
            }
          }, 300);

          updateAllSVGFills();
        }

        // Event listeners
        if (searchButton) searchButton.addEventListener("click", openSearch);
        if (closeBtnMobile)
          closeBtnMobile.addEventListener("click", closeSearch);
        if (closeBtnDesktop)
          closeBtnDesktop.addEventListener("click", closeSearch);

        function updateAllSVGFills() {
          const navRightEl = document.querySelector(".nav-right");
          const searchSVG = document.querySelector("#searchButton #searchIcon");
          const menuToggleSVG = document.querySelector("#menuToggle svg");
          const scrolled = window.scrollY > 0;
          const menuOpen = mobileMenuToggle?.classList.contains("open");

          if (
            navRightEl.classList.contains("bg-white") ||
            scrolled ||
            isSearchOpen ||
            menuOpen
          ) {
            if (searchSVG) searchSVG.style.fill = "black";
            if (menuToggleSVG) menuToggleSVG.style.fill = "black";
          } else {
            if (searchSVG) searchSVG.style.fill = "white";
            if (menuToggleSVG) menuToggleSVG.style.fill = "white";
          }
        }

        // Event listeners
        if (searchButton) searchButton.addEventListener("click", openSearch);
        if (closeBtnMobile)
          closeBtnMobile.addEventListener("click", closeSearch);
        if (closeBtnDesktop)
          closeBtnDesktop.addEventListener("click", closeSearch);
        closeBtnDesktop.classList.add("opacity-100");
        closeBtnDesktop.classList.remove("opacity-0", "pointer-events-none");
        if (mobileMenuToggle && navbarDefault) {
          mobileMenuToggle.addEventListener("click", () => {
            const isMenuOpen = !mobileMenuToggle.classList.contains("open");

            if (isMenuOpen) {
              navbarDefault.classList.remove("hidden", "lg:block");
              navbarDefault.classList.add("block");
              if (isSearchOpen) closeSearch();
              showOverlayImmediate();

              navRightSetWhite(); // ✅ make white when menu opens
            } else {
              navbarDefault.classList.remove("block");
              navbarDefault.classList.add("hidden");
              hideOverlayImmediate();
              navRightSetTransparent();

              removeNavWhiteIfNoSearch(); // ✅ reset only if nothing else open
            }

            mobileMenuToggle.classList.toggle("open");
            updateNavRightForMobileMenu(); // ✅ call the new helper
          });
        }

        // MutationObserver to enforce nav-right background for mobile menu
        const navRightEl = document.querySelector(".nav-right");
        const enforceNavRightForMobileMenu = () => {
          if (!navbarDefault || !navRightEl) return;
          if (window.innerWidth >= 991) return;
          const classes = navbarDefault.className;
          const isOpen =
            classes.includes("mobile-nav") &&
            classes.includes("open") &&
            classes.includes("block");
          if (isOpen) {
            navRightEl.classList.add("bg-white", "text-black");
          } else {
            removeNavWhiteIfNoSearch();
          }
        };
        enforceNavRightForMobileMenu();
        const mo = new MutationObserver(enforceNavRightForMobileMenu);
        if (navbarDefault) {
          mo.observe(navbarDefault, {
            attributes: true,
            attributeFilter: ["class"],
          });
        }

       updateAllSVGFills();

        // Smooth scroll menu click
        $(".scroll-menu").on("click", "a", function (event) {
          event.preventDefault();
          const full_url = this.href;
          const parts = full_url.split("#");
          const trgt = parts[1];
          const target_offset = $("#" + trgt).offset();
          const target_top = target_offset.top;
          $("html, body").animate({ scrollTop: target_top - 100 }, 0);
        });

        // Click outside dropdowns on mobile
        $(document).on("click touchstart", function (e) {
          if (
            !$(e.target).closest(".dropdown").length &&
            window.innerWidth < 991
          ) {
            $(".dropdown-menu").addClass("hidden");
            $(".dropdown-toggle svg").css("transform", "");
            removeNavWhiteIfNoSearch();
          }
        });

        // Toggle nav-right on mobile menu open/close
        $("#menuToggle").on("click", function () {
          if (window.innerWidth < 991) {
            setTimeout(() => {
              if ($("#navbar-default").is(":visible")) {
                $(".nav-right").addClass("bg-white text-black");
              } else {
                removeNavWhiteIfNoSearch();
              }
            }, 250);
          }
        });

        // Initial fill update
        updateAllSVGFills();
      });

      document.addEventListener("DOMContentLoaded", () => {
        const MOBILE_MAX = 1170;

        // loop over each dropdown parent li
        document
          .querySelectorAll(".dropdown-menu li.relative")
          .forEach((li) => {
            const trigger = li.querySelector(":scope > div:first-of-type"); // clickable row
            const submenu = li.querySelector(":scope > div:nth-of-type(2)"); // submenu div

            if (!trigger || !submenu) return;

            trigger.addEventListener("click", (e) => {
              if (window.innerWidth <= MOBILE_MAX) {
                e.preventDefault();
                e.stopPropagation();

                // close other siblings
                li.parentElement
                  .querySelectorAll(":scope > li")
                  .forEach((sibling) => {
                    if (sibling !== li) {
                      const sibSub = sibling.querySelector(
                        ":scope > div:nth-of-type(2)",
                      );
                      if (sibSub) {
                        sibSub.classList.add("hidden");
                        sibSub.classList.remove("block");
                      }
                    }
                  });

                // toggle current submenu
                if (submenu.classList.contains("hidden")) {
                  submenu.classList.remove("hidden");
                  submenu.classList.add("block");
                } else {
                  submenu.classList.add("hidden");
                  submenu.classList.remove("block");
                }

                // toggle arrow icon
                const caret = trigger.querySelector("svg");
                if (caret) caret.classList.toggle("rotate-90");
              }
            });
          });
      });
      // =======================
      // Navbar Dropdown End
      // =======================
      if ($("#container").length > 0) {
        $("#container").imagesLoaded({
          background: true,
        });
      }

      /*https://codepen.io/digvijayad/pen/RegBxg*/
      if ($(".repeater").length > 0) {
        $(".repeater").repeater({
          initEmpty: false,
          defaultValues: {
            "text-input": "foo",
          },
          show: function () {
            $(this).slideDown();
          },
          hide: function (deleteElement) {
            if (confirm("Are you sure you want to delete this element?")) {
              $(this).slideUp(deleteElement);
            }
          },
          ready: function (setIndexes) {},
          isFirstItemUndeletable: true,
        });
      }

      // ================================  home-3    ======================================

      // blog &news section
      document.addEventListener("DOMContentLoaded", () => {
        const cards = document.querySelectorAll(".card");
        const firstCard = document.querySelector('.card[data-featured="true"]');
        if (!firstCard) return; // stop if no featured card found

        const firstCardContent = firstCard.querySelectorAll(".card-content");

        cards.forEach((card) => {
          if (card.dataset.featured === "false") {
            card.addEventListener("mouseenter", () => {
              // shrink first card + hide its content
              firstCard.classList.replace("lg:flex-[3]", "lg:flex-[1]");
              firstCardContent.forEach((el) =>
                el.classList.add("lg:opacity-0"),
              );

              // expand hovered + show its content
              card.classList.replace("lg:flex-[1]", "lg:flex-[3]");
              card
                .querySelectorAll(".card-content")
                .forEach((el) => el.classList.remove("lg:opacity-0"));
            });

            card.addEventListener("mouseleave", () => {
              // reset first card
              firstCard.classList.replace("lg:flex-[1]", "lg:flex-[3]");
              firstCardContent.forEach((el) =>
                el.classList.remove("lg:opacity-0"),
              );

              // reset hovered
              card.classList.replace("lg:flex-[3]", "lg:flex-[1]");
              card
                .querySelectorAll(".card-content")
                .forEach((el) => el.classList.add("lg:opacity-0"));
            });
          }

          // ✅ Hover on first card itself
          if (card.dataset.featured === "true") {
            card.addEventListener("mouseenter", () => {
              card.classList.replace("lg:flex-[1]", "lg:flex-[3]");
              firstCardContent.forEach((el) =>
                el.classList.remove("lg:opacity-0"),
              );
            });
          }
        });
      });
    },

    /*======================================
     02. Slider Open JS
    ========================================*/
    slider_open: function () {
      /* Our Work slider */
      var swiper = new Swiper(".project-1 .project-slider", {
        slidesPerView: 2.73,
        spaceBetween: 85,
        mousewheel: {
          invert: false, // false = natural scroll direction
          releaseOnEdges: true, // lets page scroll when at edges
          sensitivity: 1, // adjust scroll speed
        },
        navigation: {
          nextEl: ".customers-purchased-section .swiper-button-next",
          prevEl: ".customers-purchased-section .swiper-button-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 1.2,
            spaceBetween: 20,
          },
          389: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          472: {
            slidesPerView: 1.8,
            spaceBetween: 30,
          },
          600: {
            slidesPerView: 2.1,
            spaceBetween: 40,
          },
          991: {
            slidesPerView: 2.3,
            spaceBetween: 50,
          },
          1170: {
            slidesPerView: 2.6,
            spaceBetween: 60,
          },
          1380: {
            slidesPerView: 3.1,
            spaceBetween: 70,
          },
          1752: {
            slidesPerView: 2.73,
            spaceBetween: 85,
          },
        },
      });

      // /* Our Projects slider */
      document.addEventListener("DOMContentLoaded", function () {
        var swiper = new Swiper(".our-projects-home-2 .projects-2", {
          slidesPerView: 1,
          spaceBetween: 20,
          navigation: {
            nextEl: ".our-projects-home-2 .swiper-button-next",
            prevEl: ".our-projects-home-2 .swiper-button-prev",
          },
          breakpoints: {
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            992: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1170: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1199: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          },
        });
      });

      /* Our Blog Grid slider */
      var swiper = new Swiper(".blog-grid-slider .blogs-2", {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
          nextEl: ".blog-grid-slider .swiper-button-next",
          prevEl: ".blog-grid-slider .swiper-button-prev",
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1.8,
            spaceBetween: 30,
          },
          992: {
            slidesPerView: 2.3,
            spaceBetween: 30,
          },
          1171: {
            slidesPerView: 2.5,
            spaceBetween: 50,
          },
          1752: {
            slidesPerView: 2.5,
            spaceBetween: 55,
          },
        },
      });

      /* Special offers & Discounts slider */
      var swiper = new Swiper(".our-gallery-slider .mySwiper", {
        slidesPerView: 1,
        spaceBetween: 40,
        loop: true,
        autoplay: true,
        navigation: {
          nextEl: ".our-gallery-slider .swiper-button-next",
          prevEl: ".our-gallery-slider .swiper-button-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1199: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        },
      });

      /* Special offers & Discounts slider */
      var swiper = new Swiper(".project-detail-slider .mySwiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        //loop: true,
        navigation: {
          nextEl: ".project-detail-slider .swiper-button-next",
          prevEl: ".project-detail-slider .swiper-button-prev",
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1199: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
        },
      });
      // ========================================= version 2.0 new js ===============================================

      // First initialize thumbs slider
      const typesThumbs = new Swiper(".card-types .types", {
        spaceBetween: 26,
        slidesPerView: 4,
        slideToClickedSlide: true, // this is CRITICAL for click syncing
        watchSlidesProgress: true,

        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1199: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1300: {
            slidesPerView: 3,
            spaceBetween: 26,
          },
          1756: {
            slidesPerView: 4,
            spaceBetween: 26,
          },
        },
      });

      // Then initialize main slider and link thumbs
      const typesMain = new Swiper(".card-types .types2", {
        spaceBetween: 10,
        thumbs: {
          swiper: typesThumbs,
        },
        pagination: {
          el: ".card-types .swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".card-types .swiper-button-next",
          prevEl: ".card-types .swiper-button-prev",
        },
      });

      // Team Member
      var swiper = new Swiper(".team", {
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          430: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          500: {
            slidesPerView: 2,
            spaceBetween: 35,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 35,
          },
          1199: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          1380: {
            slidesPerView: 4,
            spaceBetween: 35,
          },
          1752: {
            slidesPerView: 4,
            spaceBetween: 50,
          },
        },
      });

      // Blogs cards
      var swiper = new Swiper(".blogs-1", {
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          430: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          500: {
            slidesPerView: 2,
            spaceBetween: 35,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 45,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1199: {
            slidesPerView: 3,
            spaceBetween: 55,
          },
          1380: {
            slidesPerView: 3,
            spaceBetween: 64,
          },
          1752: {
            slidesPerView: 3,
            spaceBetween: 80,
          },
        },
      });

      var swiper = new Swiper(".company-logos", {
        slidesPerView: 6,
        spaceBetween: 30,
        loop: true,
        allowTouchMove: false,
        speed: 10000,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
        },
        freeMode: {
          enabled: true,
          momentum: false,
          minimumVelocity: 0.1,
        },
        breakpoints: {
          0: { slidesPerView: 2, spaceBetween: 10 },
          376: { slidesPerView: 3, spaceBetween: 30 },
          500: { slidesPerView: 4, spaceBetween: 30 },
          768: { slidesPerView: 4, spaceBetween: 30 },
          992: { slidesPerView: 5, spaceBetween: 50 },
          1199: { slidesPerView: 6, spaceBetween: 50 },
          1380: { slidesPerView: 6, spaceBetween: 50 },
          1752: { slidesPerView: 6, spaceBetween: 30 },
        },
      });

      document.addEventListener("DOMContentLoaded", function () {
        const s = document.querySelector(".our-testimonials-section");
        if (!s) return;

        const main = new Swiper(s.querySelector(".testimonial"), {
          loop: true,
          spaceBetween: 10,
          navigation: {
            nextEl: s.querySelector(".swiper-button-next"),
            prevEl: s.querySelector(".swiper-button-prev"),
          },
        });

        const thumbs = new Swiper(s.querySelector(".client"), {
          loop: false,
          spaceBetween: 20,
          slidesPerView: 5,
          centeredSlides: true,
          slideToClickedSlide: true,
          breakpoints: {
            0: { slidesPerView: 1, spaceBetween: 0 },
            640: { slidesPerView: 3, spaceBetween: 0 },
            992: { slidesPerView: 5, spaceBetween: 10 },
          },
        });

        const update = (i = main.realIndex) => {
          const active = main.slides[main.activeIndex];
          s.querySelector("#client-name").textContent =
            active.getAttribute("data-name") || "";
          s.querySelector("#client-role").textContent =
            active.getAttribute("data-role") || "";
          thumbs.slides.forEach((el) => el.classList.remove("active-thumb"));
          if (thumbs.slides[i]) thumbs.slides[i].classList.add("active-thumb");
        };

        main.on("slideChange", () => {
          thumbs.slideToLoop(main.realIndex, 500);
          update();
        });

        thumbs.on("click", () => {
          if (thumbs.clickedIndex != null) {
            main.slideToLoop(thumbs.clickedIndex, 500, true);
            update(thumbs.clickedIndex);
          }
        });

        update(0);
      });

      // INDEX-2 ==============================================\
      // hero
      // document.addEventListener("DOMContentLoaded", function () {
      //   new Swiper(".home-2-hero", {
      //     loop: true,
      //     navigation: {
      //       nextEl: ".swiper-button-next",
      //       prevEl: ".swiper-button-prev",
      //     },
      //   });
      // });
      var swiper = new Swiper(".home-2-hero", {
        spaceBetween: 10,
        slidesPerView: 1,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });

      // OUR GALLERY constant-speed marquee (no Swiper) in index-2.html
      document.addEventListener("DOMContentLoaded", function () {
        // -----------------
        // Marquee Init
        // -----------------
        const containers = document.querySelectorAll(
          ".our-gallery-marquee .js-marquee",
        );
        containers.forEach((track) => initMarquee(track));

        function initMarquee(track) {
          const speed = parseFloat(track.getAttribute("data-speed")) || 40; // px/sec
          const dir = track.getAttribute("data-direction") === "right" ? 1 : -1;

          if (dir === 1) {
            const originals = Array.from(track.children);
            const imgs = originals.flatMap((el) =>
              Array.from(el.querySelectorAll("img")),
            );
            const pending = imgs.filter((im) => !im.complete);

            const start = () => {
              const originalWidth = Math.round(track.scrollWidth);
              const containerWidth = track.parentElement.clientWidth;
              if (track.scrollWidth < originalWidth + containerWidth + 10) {
                originals.forEach((ch) => {
                  const clone = ch.cloneNode(true);
                  clone.classList.add("cloned");
                  track.appendChild(clone);
                });
              }

              track.style.willChange = "transform";
              track.style.backfaceVisibility = "hidden";

              const firstItem = originals[0];
              const firstWidth = Math.round(
                firstItem.getBoundingClientRect().width ||
                  firstItem.scrollWidth,
              );
              let offset = -(originalWidth - firstWidth);
              let last = performance.now();
              function step(now) {
                const dt = (now - last) / 1000;
                last = now;
                offset += speed * dt;
                if (offset >= 0) offset = -(originalWidth - firstWidth);
                track.style.transform = `translate3d(${offset}px,0,0)`;
                requestAnimationFrame(step);
              }
              requestAnimationFrame(step);
            };

            if (pending.length) {
              let loaded = 0;
              const done = () => {
                loaded += 1;
                if (loaded === pending.length) start();
              };
              pending.forEach((im) => {
                im.addEventListener("load", done, { once: true });
                im.addEventListener("error", done, { once: true });
              });
            } else {
              start();
            }
            return;
          }

          // Left direction
          const children = Array.from(track.children);
          const contentWidth = track.scrollWidth;
          children.forEach((ch) => {
            const clone = ch.cloneNode(true);
            clone.classList.add("cloned");
            track.appendChild(clone);
          });
          let offset = 0;
          let last = performance.now();
          function step(now) {
            const dt = (now - last) / 1000;
            last = now;
            offset += dir * speed * dt;
            if (dir < 0 && -offset >= contentWidth) offset = 0;
            track.style.transform = `translate3d(${offset}px,0,0)`;
            requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }

        // -----------------
        // Lightbox Init
        // -----------------
        let currentIndex = 0;
        let galleryImages = [];

        function setupLightbox() {
          // Only real images → skip cloned ones
          galleryImages = Array.from(
            document.querySelectorAll(".js-gallery img"),
          ).filter((img) => !img.closest(".cloned"));

          galleryImages.forEach((img, index) => {
            img.addEventListener("click", (e) => {
              e.preventDefault();
              openLightbox(index);
            });
          });
        }

        function openLightbox(index) {
          currentIndex = index;
          const lightbox = document.getElementById("galleryLightbox");
          lightbox.classList.remove("hidden");
          lightbox.classList.add("flex");
          // 🔒 Lock scroll
          document.body.style.overflow = "hidden";
          updateLightbox();
        }

        window.closeLightbox = function () {
          document.getElementById("galleryLightbox").classList.add("hidden");
          // ✅ Restore scroll
          document.body.style.overflow = "";
        };

        function updateLightbox() {
          const main = document.getElementById("lightboxMain");
          const thumbs = document.getElementById("lightboxThumbs");
          if (!galleryImages.length) return;

          const img = galleryImages[currentIndex];
          main.innerHTML = `<img src="${img.src}" class="xl:max-h-[70vh] sm:max-h-[60vh] max-h-[90vh] object-contain mx-auto">`;

          thumbs.innerHTML = "";
          galleryImages.forEach((thumb, i) => {
            const t = document.createElement("img");
            t.src = thumb.src;
            t.className =
              "w-20 h-20 object-cover cursor-pointer border-2 " +
              (i === currentIndex ? "border-white" : "border-transparent");
            t.addEventListener("click", () => {
              currentIndex = i;
              updateLightbox();
            });
            thumbs.appendChild(t);
          });
        }

        window.nextImage = function () {
          currentIndex = (currentIndex + 1) % galleryImages.length;
          updateLightbox();
        };

        window.prevImage = function () {
          currentIndex =
            (currentIndex - 1 + galleryImages.length) % galleryImages.length;
          updateLightbox();
        };

        window.toggleFullscreen = function () {
          const mainImg = document.querySelector("#lightboxMain img");
          if (!mainImg) return;
          if (mainImg.requestFullscreen) {
            mainImg.requestFullscreen();
          } else if (mainImg.webkitRequestFullscreen) {
            mainImg.webkitRequestFullscreen();
          } else if (mainImg.msRequestFullscreen) {
            mainImg.msRequestFullscreen();
          }
        };

        // Initialize lightbox
        setupLightbox();
      });

      var swiper = new Swiper(".client-2", {
        loop: true,
        spaceBetween: 10,
        slidesPerView: 1,
        freeMode: true,
        effect: "fade",
        watchSlidesProgress: true,
      });
      var swiper2 = new Swiper(".testimonials-2 .testimonial-2", {
        loop: true,
        autoHeight: true,
        spaceBetween: 10,
        navigation: {
          nextEl: ".testimonials-2 .swiper-button-next",
          prevEl: ".testimonials-2 .swiper-button-prev",
        },
        thumbs: {
          swiper: swiper,
        },
      });

      // ======================= INDEX-3 =============================================
      // home-3 hero
      var swiper = new Swiper(".home-3-hero", {
        spaceBetween: 10,
        slidesPerView: 1,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });

      // ======================= INDEX-4 =============================================
      // home-4 hero
      document.addEventListener("DOMContentLoaded", () => {
        var swiper = new Swiper(".home-4-hero .home-4-hero-img", {
          spaceBetween: 10,
          slidesPerView: 1,
          freeMode: true,
          watchSlidesProgress: true,
        });
        var swiper2 = new Swiper(".home-4-hero .home-4-hero-content", {
          spaceBetween: 10,
          navigation: {
            nextEl: ".home-4-hero .swiper-button-next",
            prevEl: ".home-4-hero .swiper-button-prev",
          },
          thumbs: {
            swiper: swiper,
          },
        });
      });

      var swiper = new Swiper(".project-2 .project-slider", {
        slidesPerView: 2.73,
        spaceBetween: 85,
        mousewheel: {
          invert: false, // false = natural scroll direction
          releaseOnEdges: true, // lets page scroll when at edges
          sensitivity: 1, // adjust scroll speed
        },
        navigation: {
          nextEl: ".customers-purchased-section .swiper-button-next",
          prevEl: ".customers-purchased-section .swiper-button-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 1.2,
            spaceBetween: 20,
          },
          389: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          472: {
            slidesPerView: 1.8,
            spaceBetween: 30,
          },
          600: {
            slidesPerView: 2.1,
            spaceBetween: 40,
          },
          992: {
            slidesPerView: 2.3,
            spaceBetween: 50,
          },
          1170: {
            slidesPerView: 2.6,
            spaceBetween: 60,
          },
          1380: {
            slidesPerView: 2.55,
            spaceBetween: 70,
          },
          1752: {
            slidesPerView: 2.55,
            spaceBetween: 85,
          },
        },
      });
      document.addEventListener("DOMContentLoaded", function () {
        var swiper = new Swiper(".testimonial-home-4 .testimonial-3", {
          slidesPerView: 1,
          spaceBetween: 20,
          navigation: {
            nextEl: ".testimonial-home-4 .swiper-button-next",
            prevEl: ".testimonial-home-4 .swiper-button-prev",
          },
          breakpoints: {
            992: {
              slidesPerView: 2,
              spaceBetween: 60,
            },
            1380: {
              slidesPerView: 2,
              spaceBetween: 80,
            },
            1752: {
              slidesPerView: 2,
              spaceBetween: 100,
            },
          },
        });
      });
      // const swiper = new Swiper(".testimonial-3", {
      //   slidesPerView: 1,
      //   spaceBetween: 30,
      //   navigation: {
      //     nextEl: ".swiper-button-next",
      //     prevEl: ".swiper-button-prev",
      //   },
      //   loop: true,
      // });

      // Dhara 24-09
      // ===================== project details ================
      // gallery-wrapper Member
      var swiper = new Swiper(".gallery-wrapper", {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: ".gallery-section .swiper-button-next",
          prevEl: ".gallery-section .swiper-button-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          575: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          992: {
            slidesPerView: 2.7,
            spaceBetween: 50,
          },
        },
      });
    },

    /*======================================
     03. Popup Open JS
    ========================================*/
    popup_open: function () {},

    /*======================================
     04. Preloader JS
    ========================================*/
    Preloader_js: function () {
      //After 2s preloader is fadeOut
      $(".preloader").delay(2000).fadeOut("slow");
      setTimeout(function () {
        //After 2s, the no-scroll class of the body will be removed
        $("body").removeClass("no-scroll");
      }, 2000); //Here you can change preloader time
    },

    /*======================================
     05. Isotope JS
    ========================================*/
    Isotope_js: function () {},
  };
  journea_travel_agency.init();
})(jQuery);

// Our Story section: video modal logic (plain JS)
document.addEventListener("DOMContentLoaded", function () {
  const playBtn = document.getElementById("playBtn");
  let videoModal = document.getElementById("videoModal");
  const closeBtn = document.getElementById("closeBtn");
  const storyVideo = document.getElementById("storyVideo");

  // Ensure the modal is mounted directly under <body>
  if (videoModal && videoModal.parentElement !== document.body) {
    document.body.appendChild(videoModal);
  }

  function openVideoModal() {
    videoModal.classList.remove("hidden");
    videoModal.classList.add("flex");
    storyVideo.currentTime = 0;
    storyVideo.play();
    document.body.style.overflow = "hidden"; // scroll lock
  }

  function closeVideoModal() {
    videoModal.classList.add("hidden");
    videoModal.classList.remove("flex");
    storyVideo.pause();
    storyVideo.currentTime = 0;
    document.body.style.overflow = ""; // restore scroll
  }

  if (playBtn && videoModal && closeBtn && storyVideo) {
    playBtn.addEventListener("click", openVideoModal);
    closeBtn.addEventListener("click", closeVideoModal);
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }
});

const hoverImage = document.querySelector(".hover-image"); // your floating image element

if (hoverImage) {
  document.querySelectorAll(".faqs-list").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const imgUrl = el.getAttribute("data-img");
      hoverImage.src = imgUrl;
      hoverImage.classList.add("opacity-100");
    });

    el.addEventListener("mouseleave", () => {
      hoverImage.classList.remove("opacity-100");
    });

    el.addEventListener("mousemove", (e) => {
      const container = el.closest(".hover-image-section");
      if (!container) return;

      const rect = container.getBoundingClientRect();
      hoverImage.style.left = `${e.clientX - rect.left + 10}px`;
      hoverImage.style.top = `${e.clientY - rect.top + 10}px`;
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const items = [
    "» 1 asdasd a",
    "» 2 asdasd as",
    "» 3 asdasd as",
    "» asdasd as",
  ];

  const marquee = document.getElementById("marquee");
  if (!marquee) return; // stop if element is not found

  // Fill marquee with items twice for looping
  function fillMarquee() {
    marquee.innerHTML = "";
    for (let i = 0; i < 2; i++) {
      items.forEach((text) => {
        const p = document.createElement("p");
        p.className = "px-4 text-black text-sm h-[45px] flex items-center";
        p.textContent = text;
        marquee.appendChild(p);
      });
    }
  }

  fillMarquee();

  // Animation loop
  let offset = 0;
  const speed = 0.5; // pixels per frame
  function animate() {
    offset -= speed;
    if (Math.abs(offset) >= marquee.scrollWidth / 2) {
      offset = 0;
    }
    marquee.style.transform = `translateX(${offset}px)`;
    requestAnimationFrame(animate);
  }
  animate();
});

// on sticky add padding in heading in projects section
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("stickyHeader");

  if (!header) return; // stop if header doesn't exist

  function getStickyTop() {
    return parseInt(window.getComputedStyle(header).top, 10) || 0;
  }

  function checkSticky() {
    const rect = header.getBoundingClientRect();
    const stickyTop = getStickyTop();

    if (rect.top === stickyTop) {
      header.classList.add("is-sticky");
    } else {
      header.classList.remove("is-sticky");
    }
  }

  window.addEventListener("scroll", checkSticky);
  window.addEventListener("resize", checkSticky);
  checkSticky();
});

document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("playBtn");
  const thumbnail = document.getElementById("videoThumbnail");
  const video = document.getElementById("videoPlayer");

  if (playBtn && thumbnail && video) {
    playBtn.addEventListener("click", () => {
      thumbnail.classList.add("hidden"); // hide thumbnail
      playBtn.classList.add("hidden"); // hide play button
      video.classList.remove("hidden"); // show video
      video.play(); // start video
    });
  }
});

// document.addEventListener("DOMContentLoaded", () => {
//   // init intl-tel-input
//   const phoneInput = document.querySelector("#phone");
//   const iti = window.intlTelInput(phoneInput, {
//     initialCountry: "in",
//     separateDialCode: true,
//     preferredCountries: ["in", "us", "gb"],
//     formatOnDisplay: true,
//     nationalMode: false,
//   });

//   const form = document.querySelector("#contactForm");

//   // validation function for a single input
//   function validateGroup(group) {
//     const input = group.querySelector('input[name], textarea[name]');
//     const errorContainer = group.querySelector('p');
//     const errorTextEl = errorContainer.querySelector('.error-text');
//     const svg = errorContainer.querySelector('.error-icon');

//     let value = input.value ?? '';
//     value = value.trim();

//     let message = '';

//     if (!value) {
//       message = 'This field is required';
//     } else {
//       const name = input.name;
//       if (name === 'fullname') {
//         if (!/^[A-Za-z\s]+$/.test(value)) message = 'Full name must only contain letters';
//       } else if (name === 'phone') {
//         // Clean phone characters intl-tel-input might add
//         const cleaned = value.replace(/[^\d]/g, '');
//         if (!/^\d+$/.test(cleaned) || cleaned.length < 4) message = 'Phone number must only contain numbers';
//       } else if (name === 'message') {
//         if (value.length < 10) message = 'Please type at least 10 characters';
//       } else if (input.type === 'email') {
//         if (!/^\S+@\S+\.\S+$/.test(value)) message = 'Please enter a valid email';
//       }
//     }

//     if (message) {
//       // add visual error classes (Tailwind)
//       input.classList.add('border-red-500', 'ring-2', 'ring-red-500', 'shadow-[0_0_10px_0_#D21C1C26]');
//       // show message + svg
//       errorTextEl.textContent = message;
//       errorContainer.classList.remove('hidden');
//       if (svg) svg.classList.remove('hidden');
//       return false;
//     } else {
//       // remove error visuals
//       input.classList.remove('border-red-500', 'ring-2', 'ring-red-500', 'shadow-[0_0_10px_0_#D21C1C26]');
//       errorTextEl.textContent = '';
//       errorContainer.classList.add('hidden');
//       if (svg) svg.classList.add('hidden');
//       return true;
//     }
//   }

//   // live validation on input/textarea events
//   form.querySelectorAll('.form-group').forEach(group => {
//     const input = group.querySelector('input[name], textarea[name]');
//     if (!input) return;
//     // validate while typing (debounced lightly)
//     input.addEventListener('input', () => validateGroup(group));
//     input.addEventListener('blur', () => validateGroup(group));
//   });

//   // submit handler
//   form.addEventListener('submit', function(e) {
//     e.preventDefault();
//     let isValid = true;
//     const groups = Array.from(form.querySelectorAll('.form-group'));

//     for (const group of groups) {
//       const ok = validateGroup(group);
//       if (!ok) {
//         isValid = false;
//       }
//     }

//     if (!isValid) {
//       // scroll to first invalid
//       const firstInvalid = form.querySelector('.form-group input.border-red-500, .form-group textarea.border-red-500');
//       if (firstInvalid) {
//         firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         firstInvalid.focus();
//       }
//       return; // do not submit
//     }

//     // all good -> submit (or process via AJAX)
//     form.submit();
//   });
// });

