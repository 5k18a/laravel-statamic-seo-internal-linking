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
// --- ELEMENTS ---

const sidebar = document.getElementById("themeSidebar");
const toggleBtn = document.getElementById("themeToggleBtn");
const header = document.getElementById("mainHeader");
const internalCloseBtn = document.getElementById("themeSidebarClose");
const headerButtons = document.querySelectorAll(".header-options button");
const themeButtons = document.querySelectorAll(".theme-color-button button");

// --- OVERLAY SETUP ---
let themeOverlay = document.getElementById("themeSidebarOverlay");
if (!themeOverlay) {
  themeOverlay = document.createElement("div");
  themeOverlay.id = "themeSidebarOverlay";
  themeOverlay.className =
    "fixed inset-0 bg-[#00000080] opacity-0 pointer-events-none transition-opacity duration-200";
  themeOverlay.style.zIndex = "900";
  document.body.appendChild(themeOverlay);
}

// --- HELPER ---
const isSidebarOpen = () =>
  sidebar && !sidebar.classList.contains("translate-x-full");

// --- SIDEBAR OPEN/CLOSE ---
function openThemeSidebar() {
  if (!sidebar) return;
  sidebar.classList.remove("translate-x-full");
  sidebar.style.zIndex = "1000";
  sidebar.setAttribute("aria-hidden", "false");
  themeOverlay.classList.remove("pointer-events-none");
  void themeOverlay.offsetWidth;
  themeOverlay.classList.add("opacity-100");
  themeOverlay.classList.remove("opacity-0");
  if (toggleBtn) {
    toggleBtn.style.visibility = "hidden";
    toggleBtn.setAttribute("aria-expanded", "true");
  }
}

function closeThemeSidebar() {
  if (!sidebar) return;
  sidebar.classList.add("translate-x-full");
  sidebar.setAttribute("aria-hidden", "true");
  themeOverlay.classList.add("opacity-0");
  themeOverlay.classList.remove("opacity-100");
  setTimeout(() => themeOverlay.classList.add("pointer-events-none"), 200);
  if (toggleBtn) {
    toggleBtn.style.visibility = "visible";
    toggleBtn.setAttribute("aria-expanded", "false");
  }
}

// Toggle sidebar with button
if (toggleBtn) {
  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isSidebarOpen() ? closeThemeSidebar() : openThemeSidebar();
  });
}

// Close sidebar with overlay or close button
themeOverlay.addEventListener("click", closeThemeSidebar);
if (internalCloseBtn) {
  internalCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeThemeSidebar();
  });
}

// Close sidebar on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isSidebarOpen()) closeThemeSidebar();
});


// COOKIE UPDATE START  

$(document).ready(function () {

  const $overlay = $("#cookieOverlay");
  const $popup = $("#initialPopup");
  const $settings = $("#settingsPanel");
  const $reopen = $("#cookieReopenBtn");

  const COOKIE_KEY = "cookieAccepted";
  let isCookieOpen = false;

  // -------------------------------
  // SHOW COOKIE POPUP
  // -------------------------------
  function showPopup(type = "main") {
    isCookieOpen = true;
    // Show overlay
    $overlay.show().removeClass("hidden opacity-0");

    // HIDE reopen button while popup is open
    $reopen
      .removeClass("cookie-reopen-visible")
      .addClass("cookie-reopen-hidden");

    // document.body.style.overflow = "hidden";

    if (type === "settings") {
      $popup.hide();
      $settings.removeClass("hidden").css("display", "flex");
    } else {
      $settings.hide();
      $popup.show();
    }
  }

  // -------------------------------
  // HIDE COOKIE POPUP
  // -------------------------------
  function hidePopup() {
    isCookieOpen = false;
    $popup.hide();
    $settings.hide();
    $overlay.hide().addClass("hidden opacity-0");


    // SHOW reopen button
    $reopen
      .removeClass("cookie-reopen-hidden")
      .addClass("cookie-reopen-visible");
  }

  // -------------------------------
  // INITIAL LOAD
  // -------------------------------
// -------------------------------
// INITIAL LOAD — treat any saved preference as "already chosen"
// -------------------------------
const savedCookie = localStorage.getItem(COOKIE_KEY);
if (savedCookie) {
  // previously chosen (accepted / rejected / custom) — keep popup hidden
  hidePopup();

  // ensure reopen button is visible (in case some other code hid it)
  $reopen
    .removeClass("cookie-reopen-hidden")
    .addClass("cookie-reopen-visible");
} else {
  // no saved choice → show popup
  showPopup("main");
}


  // -------------------------------
  // ACCEPT BUTTON
  // -------------------------------
  $(document).on("click", ".acceptCookies", function (e) {
    e.preventDefault();
    localStorage.setItem(COOKIE_KEY, "accepted");
    hidePopup();
  });

  // -------------------------------
  // REJECT BUTTON
  // -------------------------------
  $(document).on("click", ".rejectAll", function (e) {
    e.preventDefault();
    localStorage.setItem(COOKIE_KEY, "rejected");
    hidePopup();
  });

  // -------------------------------
  // SETTINGS BUTTON
  // -------------------------------
  $(document).on("click", ".settings_button", function (e) {
    e.preventDefault();
    showPopup("settings");
  });

  // -------------------------------
  // CLOSE BUTTON
  // -------------------------------
  $(document).on("click", ".closeCookie", function (e) {
    e.preventDefault();
    e.stopPropagation();
    hidePopup();
  });

  // -------------------------------
  // REOPEN BUTTON
  // -------------------------------
  $("#cookieReopenBtn").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    showPopup("main");
  });

  // -------------------------------
// CONFIRM CHOICES BUTTON
// -------------------------------
$(document).on("click", ".confirm_choices", function (e) {
  e.preventDefault();

  // store a consistent 'accepted' value so other logic (and future checks) treat it as a saved choice
  localStorage.setItem(COOKIE_KEY, "accepted");

  // hide popup and restore page scroll
  hidePopup();
});



  // -------------------------------
  // OVERLAY CLICK
  // -------------------------------
  $overlay.on("click", function (e) {
    if (e.target === this && isCookieOpen) {
      hidePopup();
    }
  });

});


// COOKIE UPDATE END

(function ($) {
  window.journea_travel_agency = {
    init: function () {
      // Home one js
      this.general_open();
      this.slider_open();
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
        }
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
            $(this)
              .find("> a")
              .after('<span class="caret-arrow"></span>');
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
        // --- Elements ---
        const navRight = document.querySelector(".nav-right");
        const headerEl = document.querySelector(".header");
        const searchButton = document.getElementById("searchButton");
        const searchToggleWrapper = document.getElementById(
          "searchToggleWrapper"
        );
        const searchBox = document.getElementById("searchBox");
        const searchInput = document.getElementById("searchInput");
        const closeBtnMobile = document.getElementById("closeSearch");
        const closeBtnDesktop =
          document.getElementById("searchCloseInside");
        const mobileMenuToggle =
          document.querySelector(".mobile-toggle") ||
          document.getElementById("menuToggle");
        const navbarDefault = document.getElementById("navbar-default");
        const dropdowns = document.querySelectorAll(".dropdown");
        const pageOverlay = document.getElementById("pageOverlay");
        const headerBtn = document.querySelector(".header-btn");

        let searchPanel = null;
        const originalSearchParent = searchBox?.parentElement;
        const suggestionsStaticEl =
          document.getElementById("searchSuggestions") || null;
        const originalSuggestionsParent =
          suggestionsStaticEl?.parentElement || null;

        let isSearchOpen = false;
        let isHeaderStickyEnabled = true;
        let nonStickyPositionClass = "absolute";

        if (headerEl) {
          if (headerEl.classList.contains("relative"))
            nonStickyPositionClass = "relative";
          else if (headerEl.classList.contains("absolute"))
            nonStickyPositionClass = "absolute";
          else {
            nonStickyPositionClass = "relative";
            headerEl.classList.add("relative");
          }
          headerEl.classList.remove(
            "fixed",
            "sticky",
            "sticky-header"
          );
          headerEl.classList.add("top-0", "left-0", "w-full", "z-50");
        }
        $(".header").hover(
          function () {
            $(this).addClass("header-hover");
          },
          function () {
            $(this).removeClass("header-hover");
          }
        );

        const isDesktop = () => window.innerWidth >= 991;
        const NO_TOGGLE_CLASS = "no-toggle-color";
        function shouldToggleColors() {
          return !(
            headerEl && headerEl.classList.contains(NO_TOGGLE_CLASS)
          );
        }

        // ---------- Helper Functions ----------
        // robust max-height open/close animation for suggestions
        function animateSuggestions(open = true, onComplete = null) {
          if (!suggestionsStaticEl) {
            if (typeof onComplete === "function") onComplete();
            return;
          }

          const el = suggestionsStaticEl;
          const DURATION = 350; // ms

          // remove previous handler if any
          if (el._suggestionsTransitionHandler) {
            el.removeEventListener(
              "transitionend",
              el._suggestionsTransitionHandler
            );
            el._suggestionsTransitionHandler = null;
          }

          // ensure overflow hidden during animation
          el.style.overflow = "hidden";

          function transitionEndHandler(e) {
            // listen only for max-height (ignore other property transitions)
            if (
              e &&
              e.propertyName &&
              e.propertyName !== "max-height"
            )
              return;

            el.removeEventListener(
              "transitionend",
              transitionEndHandler
            );
            el._suggestionsTransitionHandler = null;

            // clear transition & maxHeight so layout becomes natural
            el.style.transition = "";
            el.style.overflow = "";
            el.style.maxHeight = "";
            el.style.opacity = "";

            if (open) {
              el.classList.remove("hidden", "max-h-0");
            } else {
              el.classList.add("hidden", "max-h-0");
            }

            if (typeof onComplete === "function") onComplete();
          }

          el._suggestionsTransitionHandler = transitionEndHandler;
          el.addEventListener("transitionend", transitionEndHandler);

          if (open) {
            // make visible to measure
            el.classList.remove("hidden", "max-h-0");

            // start from 0
            el.style.maxHeight = "0px";
            el.style.opacity = "1";
            // force reflow
            void el.offsetHeight;

            const full = el.scrollHeight || 0;
            el.style.transition = `max-height ${DURATION}ms ease, opacity ${Math.round(
              DURATION * 0.9
            )}ms linear`;
            // animate to the measured height
            el.style.maxHeight = full + "px";

            // fallback in case transitionend doesn't fire
            setTimeout(() => {
              if (el._suggestionsTransitionHandler) {
                transitionEndHandler({
                  propertyName: "max-height",
                });
              }
            }, DURATION + 80);
          } else {
            // closing: animate from current scrollHeight -> 0
            // ensure element is visible and measured
            const full = el.scrollHeight || 0;
            el.style.maxHeight = full + "px";
            // force reflow
            void el.offsetHeight;
            el.style.transition = `max-height ${DURATION}ms ease, opacity ${Math.round(
              DURATION * 0.9
            )}ms linear`;
            // animate to zero
            requestAnimationFrame(() => {
              el.style.maxHeight = "0px";
              el.style.opacity = "0";
            });

            // fallback
            setTimeout(() => {
              if (el._suggestionsTransitionHandler) {
                transitionEndHandler({
                  propertyName: "max-height",
                });
              }
            }, DURATION + 100);
          }
        }

        // --- SVG helpers ---
        function getDrawableShapes(svg) {
          return svg.querySelectorAll(
            "path, circle, rect, line, polyline, polygon"
          );
        }
        function resolveCurrentColorString(value, element) {
          if (!value) return value;
          if (value.trim() === "currentColor") {
            try {
              return (
                window.getComputedStyle(element).color || value
              );
            } catch {
              return value;
            }
          }
          return value;
        }
        function detectPreferredColorProp(svg) {
          const shapes = getDrawableShapes(svg);
          for (let i = 0; i < shapes.length; i++) {
            const s = shapes[i];
            // const strokeAttr = s.getAttribute("stroke");
            // if (strokeAttr && strokeAttr !== "none")
            //   return { prop: "stroke", raw: strokeAttr, target: s };
            const fillAttr = s.getAttribute("fill");
            if (fillAttr && fillAttr !== "none")
              return { prop: "fill", raw: fillAttr, target: s };
          }
          const target = shapes[0] || svg;
          try {
            const cs = window.getComputedStyle(target);
            // const stroke = cs.getPropertyValue("stroke");
            // if (stroke && stroke !== "none")
            //   return { prop: "stroke", raw: stroke, target };
            const fill = cs.getPropertyValue("fill");
            if (fill && fill !== "none")
              return { prop: "fill", raw: fill, target };
            const color = cs.getPropertyValue("color");
            // if (color && color !== "rgba(0, 0, 0, 0)")
            //   return { prop: "stroke", raw: color, target };
          } catch { }
          return null;
        }
        function applyPropToSvg(svg, prop, color) {
          try {
            svg.style[prop] = color;
          } catch { }
          svg.querySelectorAll(
            "path, circle, rect, line, polyline, polygon"
          ).forEach((el) => {
            try {
              el.style[prop] = color;
            } catch { }
          });
        }
        function removePropFromSvg(svg, prop) {
          try {
            svg.style.removeProperty(prop);
          } catch { }
          svg.querySelectorAll(
            "path, circle, rect, line, polyline, polygon"
          ).forEach((el) => {
            try {
              el.style.removeProperty(prop);
            } catch { }
          });
        }

        // --- Lock / unlock ---
        function lockAllSVGFills() {
          if (!headerEl) return;
          const svgs = headerEl.querySelectorAll("svg");
          svgs.forEach((svg) => {
            if (svg.dataset.locked === "1") return;
            const detected = detectPreferredColorProp(svg);
            if (!detected) return;
            const resolved = resolveCurrentColorString(
              detected.target || svg
            );
            if (!resolved) return;
            svg.dataset.originalInlineStyle =
              svg.getAttribute("style") || "";
            svg.dataset.locked = "1";
            svg.dataset.lockProp = detected.prop;
            applyPropToSvg(svg, detected.prop, resolved);
          });
        }
        function unlockAllSVGFills() {
          if (!headerEl) return;
          const svgs = headerEl.querySelectorAll("svg");
          svgs.forEach((svg) => {
            if (svg.dataset.locked !== "1") return;
            const prop = svg.dataset.lockProp || "fill";
            removePropFromSvg(svg, prop);
            if (svg.dataset.originalInlineStyle) {
              svg.setAttribute(
                "style",
                svg.dataset.originalInlineStyle
              );
            } else {
              if (
                !svg.getAttribute("style") ||
                svg.getAttribute("style").trim() === ""
              )
                svg.removeAttribute("style");
            }
            delete svg.dataset.originalInlineStyle;
            delete svg.dataset.locked;
            delete svg.dataset.lockProp;
          });
        }

        if (headerEl && window.MutationObserver) {
          const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
              if (m.attributeName === "class") {
                const noToggle =
                  headerEl.classList.contains(
                    NO_TOGGLE_CLASS
                  );
                if (noToggle) {
                  unlockAllSVGFills();
                } else {
                  unlockAllSVGFills();
                  updateAllSVGFills();
                }
                if (typeof updateHeaderBtnState === "function")
                  updateHeaderBtnState();
              }
            }
          });
          observer.observe(headerEl, {
            attributes: true,
            attributeFilter: ["class"],
          });
        }

        // watch navRight class changes (e.g., bg-white toggles)
        if (navRight) {
          const navObserver = new MutationObserver((mutations) => {
            for (const m of mutations) {
              if (m.attributeName === "class") {
                if (typeof updateHeaderBtnState === "function")
                  updateHeaderBtnState();
              }
            }
          });
          navObserver.observe(navRight, {
            attributes: true,
            attributeFilter: ["class"],
          });
        }

        if (!shouldToggleColors()) {
          unlockAllSVGFills();
        }

        const setSVGColor = (svgEl, color) => {
          if (!svgEl) return;
          const detected = detectPreferredColorProp(svgEl);
          const prop =
            detected && detected.prop ? detected.prop : "fill";
          applyPropToSvg(svgEl, prop, color);
        };

        // ---------- Dropdown toggle sync ----------
        function isMenuVisible(menu) {
          if (!menu) return false;

          // 1) If the menu is NOT hidden in CSS → it's open
          if (!menu.classList.contains("hidden")) return true;

          // 2) If the menu has .open → treat as open
          if (menu.classList.contains("open")) return true;

          // 3) Extra safety: check actual element height (desktop hover menus)
          const rect = menu.getBoundingClientRect();
          if (rect.height > 0 && rect.width > 0) return true;

          return false;
        }

        function updateHeaderBtnState() {
          if (!shouldToggleColors()) return;

          // find the button (use existing headerBtn if present, else try some sensible fallbacks)
          const hb =
            headerBtn ||
            (navRight && navRight.querySelector("a.btn")) ||
            document.querySelector("a.btn.btn-dark-reverse") ||
            document.querySelector(".header a.btn");

          if (!hb) return;
          // do not toggle buttons inside dropdown menus
          if (hb.closest(".dropdown-menu")) return;

          const isHovered =
            !!headerEl?.classList.contains("header-hover");

          // highest priority: when page is scrolled — always dark
          if (window.scrollY > 0) {
            hb.classList.add("btn-dark-reverse");
            hb.classList.remove("btn-green-bg");
            return;
          }

          // decide based on visible background of navRight/header
          let isWhite = false;
          try {
            if (
              (headerEl &&
                headerEl.classList.contains("bg-white")) ||
              (navRight &&
                navRight.classList.contains("bg-white"))
            )
              isWhite = true;

            if (!isWhite && navRight) {
              const navBg =
                window.getComputedStyle(navRight)
                  .backgroundColor || "";
              if (
                /rgb\(255,255,255\)|#ffffff|rgba\(255,255,255,1\)/i.test(
                  navBg.replace(/\s+/g, "")
                )
              )
                isWhite = true;
            }

            if (!isWhite && headerEl) {
              const hBg =
                window.getComputedStyle(headerEl)
                  .backgroundColor || "";
              if (
                /rgb\(255,255,255\)|#ffffff|rgba\(255,255,255,1\)/i.test(
                  hBg.replace(/\s+/g, "")
                )
              )
                isWhite = true;
            }
          } catch (e) {
            /* ignore and fallback to non-white */
          }

          // hover should force dark; otherwise follow white/green logic
          const useDark = isHovered || isWhite;
          hb.classList.toggle("btn-dark-reverse", useDark);
          hb.classList.toggle("btn-green-bg", !useDark);

          // tiny retry to catch late DOM changes (scroll/search handlers racing)
          setTimeout(() => {
            try {
              if (window.scrollY > 0) {
                hb.classList.add("btn-dark-reverse");
                hb.classList.remove("btn-green-bg");
                return;
              }
              const hoverNow =
                !!headerEl?.classList.contains("header-hover");
              // re-evaluate background quickly
              let nowWhite = false;
              if (
                (headerEl &&
                  headerEl.classList.contains("bg-white")) ||
                (navRight &&
                  navRight.classList.contains("bg-white"))
              )
                nowWhite = true;
              if (!nowWhite && navRight) {
                const navBg2 =
                  window.getComputedStyle(navRight)
                    .backgroundColor || "";
                if (
                  /rgb\(255,255,255\)|#ffffff|rgba\(255,255,255,1\)/i.test(
                    navBg2.replace(/\s+/g, "")
                  )
                )
                  nowWhite = true;
              }
              if (!nowWhite && headerEl) {
                const hBg2 =
                  window.getComputedStyle(headerEl)
                    .backgroundColor || "";
                if (
                  /rgb\(255,255,255\)|#ffffff|rgba\(255,255,255,1\)/i.test(
                    hBg2.replace(/\s+/g, "")
                  )
                )
                  nowWhite = true;
              }

              const retryDark = hoverNow || nowWhite;
              hb.classList.toggle("btn-dark-reverse", retryDark);
              hb.classList.toggle("btn-green-bg", !retryDark);
            } catch (e) { }
          }, 40);
        }

        // ---------- Overlay helpers, nav background, search open/close, mobile menu, sticky, dropdowns ----------
        const ensureOverlayEl = () => {
          if (pageOverlay) return pageOverlay;
          const el = document.createElement("div");
          el.id = "pageOverlay";
          el.className = "fixed inset-0 opacity-0 hidden z-0";
          document.body.appendChild(el);
          pageOverlay = el;
          return el;
        };

        const showOverlay = () => {
          const ov = ensureOverlayEl();
          ov.classList.remove("hidden", "opacity-0");
          ov.classList.add("opacity-100");
          ov.style.display = "block";
          headerEl?.classList.add("dropdown-open");
        };
        const hideOverlayImmediate = () => {
          const ov = ensureOverlayEl();
          ov.classList.add("hidden", "opacity-0");
          ov.classList.remove("opacity-100");
          ov.style.display = "";
          ov.style.pointerEvents = "none";
          headerEl?.classList.remove("dropdown-open");
        };
        const isMobileMenuOpen = () =>
          !!(
            mobileMenuToggle?.classList.contains("open") &&
            navbarDefault?.classList.contains("block")
          );

        // overlay click closes menus
        if (pageOverlay) {
          pageOverlay.addEventListener("click", () => {
            dropdowns.forEach((d) => {
              const m =
                d.querySelector(".dropdown-menu") ||
                d.querySelector("ul");
              if (!m) return;
              m.classList.add("hidden");
              m.classList.remove("open");
            });
            if (mobileMenuToggle)
              mobileMenuToggle.classList.remove("open");
            if (navbarDefault)
              navbarDefault.classList.remove("block");
            hideOverlayImmediate();
            updateAllSVGFills?.();
          });
        }

        const navRightSetWhite = () => {
          if (!shouldToggleColors()) return;
          if (!navRight) return;

          // --- Homepage ---
          if (is_homepage) {
            // Transparent background + white text
            navRight.classList.add("bg-transparent", "text-white");
            navRight.classList.remove("bg-white", "text-black");

            navRight
              .querySelectorAll(".navbar > li > a.nav-tab")
              .forEach((a) => {
                a.classList.add("text-white");
                a.classList.remove("text-black");
              });

            if (mobileMenuToggle) {
              mobileMenuToggle.classList.add("text-white");
              mobileMenuToggle.classList.remove("text-black");
            }
            if (searchButton) {
              searchButton.classList.add("text-white");
              searchButton.classList.remove("text-black");
            }
          }

          // --- Other Pages ---
          else {
            // White background + black text
            navRight.classList.add("bg-white", "text-black");
            navRight.classList.remove("bg-transparent");

            navRight
              .querySelectorAll(".navbar > li > a.nav-tab")
              .forEach((a) => {
                a.classList.add("text-black");
                a.classList.remove("text-white");
              });

            if (mobileMenuToggle) {
              mobileMenuToggle.classList.add("text-black");
              mobileMenuToggle.classList.remove("text-white");
            }
            if (searchButton) {
              searchButton.classList.add("text-black");
              searchButton.classList.remove("text-white");
            }
          }
        };

        const navRightSetTransparent = () => {
          if (!shouldToggleColors()) return;
          if (!navRight) return;

          // --- Homepage ---
          if (is_homepage) {
            // Transparent background + white text
            navRight.classList.remove("bg-white", "text-black");
            navRight.classList.add("bg-transparent", "text-white");

            navRight
              .querySelectorAll(".navbar > li > a.nav-tab")
              .forEach((a) => {
                a.classList.remove("text-black");
                a.classList.add("text-white");
              });

            if (mobileMenuToggle) {
              mobileMenuToggle.classList.remove("text-black");
              mobileMenuToggle.classList.add("text-white");
            }

            if (searchButton) {
              searchButton.classList.remove("text-black");
              searchButton.classList.add("text-white");
            }
          }

          // --- Other Pages ---
          else {
            // White background + black text
            navRight.classList.add("bg-white", "text-black");
            navRight.classList.remove("bg-transparent");

            navRight
              .querySelectorAll(".navbar > li > a.nav-tab")
              .forEach((a) => {
                a.classList.remove("text-white");
                a.classList.add("text-black");
              });

            if (mobileMenuToggle) {
              mobileMenuToggle.classList.remove("text-white");
              mobileMenuToggle.classList.add("text-black");
            }

            if (searchButton) {
              searchButton.classList.remove("text-white");
              searchButton.classList.add("text-black");
            }
          }
        };

        const removeNavWhiteIfNoSearch = () => {
          if (
            !isSearchOpen &&
            !mobileMenuToggle?.classList.contains("open") &&
            !anyMenuOpen()
          ) {
            navRightSetTransparent();
            // If we're at the top of the page ensure header returns to transparent
            if (headerEl && window.scrollY === 0) {
              headerEl.classList.remove("bg-white");
            }
            if (typeof updateAllSVGFills === "function")
              updateAllSVGFills();
          }
        };

        // --- Search open/close ---
        function openSearch() {
          if (isSearchOpen) return;
          // Close any open dropdowns or mobile menu when opening search
          try {
            closeAllDropdowns();
          } catch (e) { }
          if (
            mobileMenuToggle &&
            mobileMenuToggle.classList.contains("open")
          ) {
            mobileMenuToggle.classList.remove("open");
            mobileMenuToggle.classList.remove("active");
            if (navbarDefault) {
              navbarDefault.classList.remove("block");
              navbarDefault.classList.add("hidden");
            }
          }
          isSearchOpen = true;
          const isMobile = window.innerWidth <= 991;
          navRightSetWhite();
          if (isMobile) headerEl?.classList.add("bg-white");
          if (typeof updateOverlayState === "function")
            updateOverlayState();

          if (isMobile) {
            if (!searchPanel) {
              searchPanel = document.createElement("div");
              searchPanel.id = "searchPanel";
              headerEl?.appendChild(searchPanel);
            }
            if (
              searchBox &&
              searchPanel &&
              searchBox.parentElement !== searchPanel
            )
              searchPanel.appendChild(searchBox);

            searchBox.classList.remove("hidden", "max-h-0");
            searchBox.style.display = "flex";
            searchBox.style.flexDirection = "row";
            searchBox.style.position = "relative";
            searchBox.style.left = "0";
            searchBox.style.right = "0";
            searchBox.style.width = "100%";
            searchBox.style.background = "white";
            searchBox.style.zIndex = "61";
            searchBox.style.transform = "translateY(-8px)";
            searchBox.style.opacity = "0";
            searchBox.style.transition =
              "transform 1s ease, opacity 0.35s ease";

            if (suggestionsStaticEl) {
              if (suggestionsStaticEl.parentElement !== headerEl)
                headerEl.appendChild(suggestionsStaticEl);

              // remove inline positioning/width so CSS controls it
              suggestionsStaticEl.style.position = "";

              // add the CSS class we wrote above
              suggestionsStaticEl.classList.add(
                "search-suggestions-panel"
              );

              // open animation
              animateSuggestions(true);
            }

            void searchBox.offsetWidth;
            requestAnimationFrame(() => {
              searchBox.style.transform = "translateY(0)";
              searchBox.style.opacity = "1";
            });
          } else {
            navRight?.classList.add("relative");
            searchBox.classList.remove("hidden", "max-h-0");
            searchBox.style.display = "flex";
            searchBox.style.flexDirection = "row";
            searchBox.style.width = "0";
            searchBox.style.opacity = "0";
            searchBox.style.position = "absolute";
            searchBox.style.top = "0";
            searchBox.style.right = "0";
            searchBox.style.transition =
              "width 1s ease, opacity 1s ease";

            void searchBox.offsetWidth;
            requestAnimationFrame(() => {
              searchBox.style.width = "100%";
              searchBox.style.opacity = "1";
            });

            if (suggestionsStaticEl) {
              if (suggestionsStaticEl.parentElement !== headerEl)
                headerEl.appendChild(suggestionsStaticEl);
              suggestionsStaticEl.style.position = "absolute";
              suggestionsStaticEl.style.top = "100%";
              suggestionsStaticEl.style.zIndex = "55";
              // open animation for desktop too
              animateSuggestions(true);
            }
          }

          searchInput?.focus();
          if (closeBtnMobile) {
            closeBtnMobile.classList.remove(
              "hidden",
              "opacity-0",
              "pointer-events-none"
            );
            closeBtnMobile.classList.add("opacity-100");
          }
          if (closeBtnDesktop) {
            closeBtnDesktop.classList.remove(
              "opacity-0",
              "pointer-events-none"
            );
            closeBtnDesktop.classList.add("opacity-100");
          }
          searchButton?.classList.add("hidden");
          updateAllSVGFills();
          if (typeof updateHeaderBtnState === "function")
            updateHeaderBtnState();
        }

        function closeSearch() {
          if (!isSearchOpen) return;
          isSearchOpen = false;
          const isMobile = window.innerWidth <= 991;

          if (isMobile) {
            // animate searchBox out
            searchBox.style.transform = "translateY(-10px)";
            searchBox.style.opacity = "0";
            searchBox.style.transition =
              "transform 1.5s ease, opacity 0.25s ease";

            // after search box animation finishes, hide it and then animate suggestions
            setTimeout(() => {
              // hide search box
              searchBox.classList.add("hidden");
              searchBox.style.display = "";
              searchBox.style.transition = "";
              searchBox.style.transform = "";
              searchBox.style.opacity = "";
              searchBox.classList.remove("flex", "flex-row", "w-full");
              searchBox.style.position = "";
              searchBox.style.top = "";
              searchBox.style.left = "";
              searchBox.style.right = "";
              searchBox.style.width = "";
              searchBox.style.background = "";
              searchBox.style.zIndex = "";
              headerEl?.classList.remove("bg-white");

              // suggestions are inside searchPanel — animate close and then move them
              if (suggestionsStaticEl) {
                animateSuggestions(false, () => {
                  // when moving back
                  if (
                    originalSuggestionsParent &&
                    suggestionsStaticEl.parentElement !==
                    originalSuggestionsParent
                  ) {
                    originalSuggestionsParent.appendChild(
                      suggestionsStaticEl
                    );
                  }
                  suggestionsStaticEl.classList.remove(
                    "search-suggestions-panel"
                  );
                  suggestionsStaticEl.classList.add(
                    "hidden", "max-h-0"
                  );
                });
              }

              // remove panel
              if (
                searchPanel &&
                searchPanel.parentElement === headerEl
              ) {
                searchPanel.remove();
                searchPanel = null;
              }
            }, 250);
          } else {
            // desktop: animate searchBox width out, then after that trigger suggestions close and move
            searchBox.style.width = "0";
            searchBox.style.opacity = "0";
            searchBox.style.transition =
              "width 1.5s ease, opacity 1s ease";

            setTimeout(() => {
              // hide search box
              searchBox.classList.add("hidden");
              searchBox.style.display = "";
              searchBox.style.transition = "";
              searchBox.style.width = "";
              searchBox.style.opacity = "";
              searchBox.classList.remove(
                "flex", "flex-row", "w-full"
              );
              searchBox.style.position = "";
              searchBox.style.top = "";
              searchBox.style.right = "";

              // animate suggestions close, then move them back to their original parent
              if (suggestionsStaticEl) {
                animateSuggestions(false, () => {
                  if (
                    originalSuggestionsParent &&
                    suggestionsStaticEl.parentElement !==
                    originalSuggestionsParent
                  ) {
                    originalSuggestionsParent.appendChild(
                      suggestionsStaticEl
                    );
                  }
                  suggestionsStaticEl.classList.add(
                    "hidden", "max-h-0"
                  );
                });
              }
            }, 350);
          }

          searchInput.value = "";
          if (closeBtnMobile)
            closeBtnMobile.classList.add(
              "hidden", "opacity-0", "pointer-events-none"
            );
          if (closeBtnDesktop)
            closeBtnDesktop.classList.add(
              "opacity-0", "pointer-events-none"
            );
          if (searchButton) searchButton.classList.remove("hidden");
          navRight?.classList.remove("relative");
          removeNavWhiteIfNoSearch();
          if (typeof updateOverlayState === "function")
            updateOverlayState();
          updateAllSVGFills();
          if (typeof updateHeaderBtnState === "function")
            updateHeaderBtnState();
        }

        searchButton?.addEventListener("click", (e) => {
          e.stopPropagation();
          openSearch();
        });
        searchToggleWrapper?.addEventListener("click", (e) => {
          e.stopPropagation();
          if (e.target.closest("#searchButton")) {
            openSearch();
          }
        });
        closeBtnMobile?.addEventListener("click", (e) => {
          e.stopPropagation();
          closeSearch();
        });
        closeBtnDesktop?.addEventListener("click", (e) => {
          e.stopPropagation();
          closeSearch();
        });

        if (mobileMenuToggle && navbarDefault) {
          mobileMenuToggle.addEventListener("click", () => {
            const isMenuOpen =
              !mobileMenuToggle.classList.contains("open");
            if (isMenuOpen) {
              navbarDefault.classList.remove(
                "hidden",
                "lg:block"
              );
              navbarDefault.classList.add("block");
              if (isSearchOpen) closeSearch();
              navRightSetWhite();
              showOverlay();
            } else {
              navbarDefault.classList.remove("block");
              navbarDefault.classList.add("hidden");
              removeNavWhiteIfNoSearch();
              updateOverlayState();
            }
            mobileMenuToggle.classList.toggle("open");
            updateAllSVGFills();
            if (typeof updateHeaderBtnState === "function")
              updateHeaderBtnState();
          });
        }

        window.setHeaderSticky = function (isSticky) {
          if (!headerEl) return;
          isHeaderStickyEnabled = !!isSticky;
          if (!isHeaderStickyEnabled) {
            headerEl.classList.remove(
              "sticky-header", "fixed", "sticky"
            );
            headerEl.classList.remove(
              nonStickyPositionClass === "relative" ? "absolute" : "relative"
            );
            headerEl.classList.add(nonStickyPositionClass);
          } else {
            if (window.scrollY > 0) {
              headerEl.classList.add("sticky-header", "fixed");
              headerEl.classList.remove("absolute", "relative");
            }
          }
        };

        document
          .querySelectorAll('[data-sticky="off"]')
          .forEach((btn) =>
            btn.addEventListener("click", (e) => {
              e.preventDefault();
              window.setHeaderSticky(false);
            })
          );
        document.querySelectorAll('[data-sticky="on"]').forEach((btn) =>
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            window.setHeaderSticky(true);
          })
        );

        function updateDropdownToggleColors() {
          if (!shouldToggleColors()) return;

          dropdowns.forEach((d) => {
            const toggle = d.querySelector(".dropdown-toggle");
            const menu =
              d.querySelector(".dropdown-menu") ||
              d.querySelector("ul");
            if (!toggle) return;
            const visible = isMenuVisible(menu);
            if (visible) {
              toggle.classList.add(
                "text-primary-900", "border-b", "border-primary-900"
              );
              toggle
                .querySelectorAll("svg")
                .forEach((svg) =>
                  setSVGColor(
                    svg,
                    window.getComputedStyle(toggle).color
                  )
                );
            } else {
              toggle.classList.remove(
                "text-primary-900", "border-primary-900"
              );
              const isWhiteBg =
                (headerEl &&
                  headerEl.classList.contains("bg-white")) ||
                (navRight &&
                  navRight.classList.contains("bg-white"));
              const color = isWhiteBg ? "black" : "white";
              toggle
                .querySelectorAll("svg")
                .forEach((svg) => setSVGColor(svg, color));
            }
          });
        }

        // ---------- Dropdown animation (smooth + flicker-free) ----------
        function animateDropdown(menu, open = true, onComplete = null) {
          if (!menu) return;
          const DURATION = 250;

          if (menu._transitioning) return; // prevent overlapping transitions
          menu._transitioning = true;
          menu.style.overflow = "hidden";

          if (menu._ddHandler) {
            menu.removeEventListener(
              "transitionend",
              menu._ddHandler
            );
            menu._ddHandler = null;
          }

          const endOnce = (e) => {
            // listen only for max-height (ignore other property transitions)
            if (
              e &&
              e.propertyName &&
              e.propertyName !== "max-height"
            )
              return;

            menu.removeEventListener("transitionend", endOnce);
            menu._transitioning = false;
            menu.style.transition = "";
            menu.style.overflow = "";
            menu.style.maxHeight = "";
            menu.style.opacity = "";
            menu.style.transform = "";

            // if (!open) {
            //   menu.classList.add("hidden");
            //   menu.classList.remove("open");
            // } else {
            //   menu.classList.add("open");
            // }

            if (typeof onComplete === "function") onComplete();
          };

          menu._ddHandler = endOnce;
          menu.addEventListener("transitionend", endOnce);

          if (open) {
            menu.classList.remove("hidden", "closing");
            menu.classList.add("open");
            menu.style.maxHeight = "0px";
            menu.style.opacity = "0";
            menu.style.transform = "translateY(-8px)";
            void menu.offsetHeight;

            const full = menu.scrollHeight || 0;
            menu.style.transition = `max-height ${DURATION}ms ease, opacity ${DURATION}ms ease, transform ${DURATION}ms ease`;
            menu.style.maxHeight = `${full}px`;
            menu.style.opacity = "1";
            menu.style.transform = "translateY(0)";
          } else {
            const full = menu.scrollHeight || 0;
            menu.style.maxHeight = `${full}px`;
            menu.style.opacity = "1";
            menu.style.transform = "translateY(0)";
            void menu.offsetHeight;

            menu.style.transition = `max-height ${DURATION}ms ease, opacity ${DURATION}ms ease, transform ${DURATION}ms ease`;
            menu.style.maxHeight = "0px";
            menu.style.opacity = "0";
            menu.style.transform = "translateY(-8px)";
          }

          // Fallback in case transitionend doesn't fire
          setTimeout(() => {
            if (menu._transitioning) endOnce();
          }, DURATION + 80);
        }

        function openDropdownMenu(menu) {
          if (!menu) return;

          if (isDesktop()) {
            // Prevent flicker by forcing reflow before transition
            menu.classList.remove("hidden", "closing");
            menu.classList.add("will-open");
            void menu.offsetHeight; // force reflow

            animateDropdown(menu, true, () => {
              menu.classList.remove("will-open");
              // ensure overlay state updated
              try {
                showOverlay();
              } catch (e) { }
              try {
                updateOverlayState?.();
              } catch (e) { }
            });
          } else {
            // Mobile version unchanged
            menu.classList.remove("hidden", "closing");
            menu.dataset.mobilePanel = "1";

            menu.classList.remove("hidden");
            menu.classList.add("open");

            // REMOVE all inline styles so CSS takes control
            menu.removeAttribute("style");

            menu.style.transition = "transform 300ms ease";
            void menu.offsetWidth;
            menu.classList.add("open");
            menu.style.transform = "translateX(0)";
          }
        }

        function closeDropdownMenu(menu) {
          if (!menu) return;
          if (isDesktop()) {
            // Mark this menu as closing first
            menu.classList.add("closing");

            // Check if any OTHER menus are still open (excluding the one being closed)
            let otherMenusOpen = false;
            dropdowns.forEach((d) => {
              const m =
                d.querySelector(".dropdown-menu") ||
                d.querySelector("ul");
              if (m && m !== menu && isMenuVisible(m)) {
                otherMenusOpen = true;
              }
            });

            // Hide overlay IMMEDIATELY if no other menus, search, or mobile menu is open
            if (
              !otherMenusOpen &&
              !isSearchOpen &&
              !isMobileMenuOpen()
            ) {
              hideOverlayInstant();
            }

            animateDropdown(menu, false, () => {
              // After dropdown animation completes, double-check overlay state
              if (typeof updateOverlayState === "function") {
                const stillOpen = anyMenuOpen();
                if (
                  !stillOpen &&
                  !isSearchOpen &&
                  !isMobileMenuOpen()
                ) {
                  hideOverlayInstant();
                } else {
                  try {
                    updateOverlayState();
                  } catch (err) { }
                }
              }
            });
            return;
          }
          if (
            menu.classList.contains("hidden") &&
            !menu.classList.contains("open")
          )
            return;
          // Keep 'open' during animation; remove it at the end
          menu.classList.add("closing");

          // Check if any OTHER menus are still open (excluding the one being closed)
          let otherMenusOpen = false;
          dropdowns.forEach((d) => {
            const m =
              d.querySelector(".dropdown-menu") ||
              d.querySelector("ul");
            if (m && m !== menu && isMenuVisible(m)) {
              otherMenusOpen = true;
            }
          });

          // Hide overlay IMMEDIATELY if no other menus, search, or mobile menu is open
          if (
            !otherMenusOpen &&
            !isSearchOpen &&
            !isMobileMenuOpen()
          ) {
            hideOverlayInstant();
          }

          // Mobile slide-out to right if it was opened as a mobile panel
          const isMobilePanel = menu.dataset.mobilePanel === "1";
          if (isMobilePanel) {
            if (!menu.style.transition)
              menu.style.transition = "transform 250ms ease";
            // animate out
            void menu.offsetWidth;
            menu.style.transform = "translateX(100%)";
          }

          const done = () => {
            menu.classList.add("hidden");
            menu.classList.remove("closing", "open");
            if (isMobilePanel) {
              // clear inline off-canvas styles
              menu.style.position = "";
              menu.style.marginTop = "";
              menu.style.top = "";
              menu.style.right = "";
              menu.style.height = "";
              menu.style.width = "";
              menu.style.zIndex = "";
              menu.style.background = "";
              menu.style.transform = "";
              menu.style.transition = "";
              delete menu.dataset.mobilePanel;
            }
            if (typeof updateOverlayState === "function")
              updateOverlayState();
          };
          const onEnd = (e) => {
            if (e && e.target !== menu) return;
            if (
              e &&
              e.propertyName &&
              !["opacity", "transform"].includes(e.propertyName)
            )
              return;
            menu.removeEventListener("transitionend", onEnd);
            done();
          };
          menu.addEventListener("transitionend", onEnd);
          // Fallback timeout in case transitionend doesn't fire
          setTimeout(done, 350);
        }

        const anyMenuOpen = () => {
          let open = false;
          dropdowns.forEach((d) => {
            const m =
              d.querySelector(".dropdown-menu") ||
              d.querySelector("ul");

            if (!m) return;
            if (isMenuVisible(m)) open = true;
          });
          return open;
        };

        const updateOverlayState = () => {
          const shouldShow =
            isSearchOpen || isMobileMenuOpen() || anyMenuOpen();
          if (shouldShow) {
            showOverlay();
            try {
              // (removed: prevent body/page from scrolling while an overlay is open)
            } catch (e) { }
          } else {
            // Use immediate hide to avoid delayed overlay showing after dropdown close
            hideOverlayImmediate();
            try {
              // (removed: re-enable scrolling)
            } catch (e) { }
          }
        };

        // Helper: close all dropdown menus
        function closeAllDropdowns(exceptMenu = null) {
          dropdowns.forEach((d) => {
            const m =
              d.querySelector(".dropdown-menu") ||
              d.querySelector("ul");
            if (!m) return;
            if (m === exceptMenu) return;
            if (isMenuVisible(m) || m.classList.contains("open")) {
              closeDropdownMenu(m);
            }
          });
        }

        // Dropdown attach handlers
        // ensure dropdown links aren't forced to dark button styling
        document.querySelectorAll(".dropdown-menu .btn-dark-reverse")
          .forEach((el) => el.classList.remove("btn-dark-reverse"));

        dropdowns.forEach((dropdown) => {
          const toggle = dropdown.querySelector(".dropdown-toggle");
          const backBtn = dropdown.querySelector(".back-btn");
          const menu =
            dropdown.querySelector(".dropdown-menu") ||
            dropdown.querySelector("ul");
          if (!toggle || !menu) return;

          // Hover: delayed open to prevent accidental triggers when cursor moves quickly
          let hoverOpenTimer = null;

          // Click: open/close this menu, but first close others immediately
          toggle.addEventListener("click", (e) => {
            // detect if user clicked arrow
            const arrow = e.target.closest(".dropdown-arrow-area");

            // IF CLICKED ON TEXT → LET IT GO TO LINK (both desktop & mobile)
            if (!arrow) {
              return; // do nothing, allow browser navigation
            }

            // IF CLICKED ON ARROW → OPEN DROPDOWN
            e.preventDefault();
            e.stopPropagation();

            const wasOpen = isMenuVisible(menu);
            closeAllDropdowns(menu);

            if (wasOpen) {
              closeDropdownMenu(menu);
            } else {
              openDropdownMenu(menu);
              navRightSetWhite();
              showOverlay();
            }

            updateOverlayState();
            updateAllSVGFills();
            updateDropdownToggleColors();
            updateHeaderBtnState?.();
          });

          dropdown.addEventListener("pointerenter", () => {
            if (!isDesktop()) return;

            // Clear any existing timer
            if (hoverOpenTimer) {
              clearTimeout(hoverOpenTimer);
              hoverOpenTimer = null;
            }

            // Add delay before opening (prevents accidental opening when cursor moves quickly from address bar)
            hoverOpenTimer = setTimeout(() => {
              // Close others and open this
              closeAllDropdowns(menu);
              openDropdownMenu(menu);
              navRightSetWhite();
              showOverlay();
              updateAllSVGFills();
              updateDropdownToggleColors();
              updateHeaderBtnState?.();
              hoverOpenTimer = null;
            }, 200); // 200ms delay - enough to prevent accidental hovers
          });

          // Leave: close this menu and cancel any pending open timer
          dropdown.addEventListener("pointerleave", () => {
            if (!isDesktop()) return;

            // Cancel pending open timer if cursor leaves before delay completes
            if (hoverOpenTimer) {
              clearTimeout(hoverOpenTimer);
              hoverOpenTimer = null;
            }

            // Close menu (if open)
            if (menu) {
              menu.classList.add("hidden");
              menu.classList.remove("open");
            }

            removeNavWhiteIfNoSearch();
            updateOverlayState();
            updateAllSVGFills();
            updateDropdownToggleColors();
            if (typeof updateHeaderBtnState === "function")
              updateHeaderBtnState();
          });
        });

        // -----------------------------------------
        // UNIVERSAL BACK-BTN FOR ALL SUB MENUS
        // -----------------------------------------
        document.querySelectorAll(".dropdown-menu .back-btn")
          .forEach((btn) => {
            btn.addEventListener("click", function (e) {
              e.preventDefault();
              e.stopPropagation();

              const menu = this.closest(".dropdown-menu");
              if (!menu) return;

              // Close current submenu
              // menu.classList.add("hidden");
              // menu.classList.remove("open");

              // Hide overlay
              const overlay =
                document.getElementById("pageOverlay");
              if (overlay) {
                overlay.classList.remove("show");
                overlay.classList.add(
                  "opacity-0",
                  "pointer-events-none"
                );
              }

              // Reset header UI states
              if (
                typeof updateDropdownToggleColors === "function"
              )
                updateDropdownToggleColors();
              if (typeof updateAllSVGFills === "function")
                updateAllSVGFills();
              if (typeof updateHeaderBtnState === "function")
                updateHeaderBtnState();
            });
          });

        // Close dropdowns when clicking outside
        document.addEventListener("click", (e) => {
          if (
            !e.target.closest(".dropdown") &&
            !e.target.closest("#searchBox") &&
            !e.target.closest("#searchButton") &&
            !e.target.closest(".search-toggle")
          ) {
            dropdowns.forEach((d) => {
              const menu =
                d.querySelector(".dropdown-menu") ||
                d.querySelector("ul");
              if (menu) {
                menu.classList.add("hidden");
                menu.classList.remove("open");
              }
            });
            closeSearch();
            removeNavWhiteIfNoSearch();
            updateOverlayState();
            updateAllSVGFills();
            updateDropdownToggleColors();
            if (typeof updateHeaderBtnState === "function")
              updateHeaderBtnState();
          }
        });

        if (pageOverlay) {
          pageOverlay.addEventListener("mouseenter", () => {
            if (!isDesktop()) return;

            // CLOSE ALL MENUS
            dropdowns.forEach((d) => {
              const menu =
                d.querySelector(".dropdown-menu") ||
                d.querySelector("ul");
              if (!menu) return;
              // menu.classList.add("hidden");
              // menu.classList.remove("open");
            });

            // REMOVE HEADER HOVER (IMPORTANT)
            if (headerEl) {
              headerEl.classList.remove("header-hover");
            }

            // NORMAL COLOR + STATE UPDATES
            removeNavWhiteIfNoSearch();
            updateOverlayState();
            updateAllSVGFills();
            updateDropdownToggleColors();

            if (typeof updateHeaderBtnState === "function")
              updateHeaderBtnState();
          });
        }

        // ---------- SVG fill updater (exposed on window) ----------
        function updateAllSVGFills() {
          if (!shouldToggleColors()) return;

          const dropdownOpen = !!document.querySelector(
            ".dropdown .dropdown-menu.open:not(.hidden), .dropdown ul.open:not(.hidden)"
          );
          const color =
            isSearchOpen ||
              dropdownOpen ||
              headerEl.classList.contains("header-hover") || //  <-- ADD THIS
              mobileMenuToggle.classList.contains("open") ||
              (!headerEl.classList.contains("no-toggle-color") &&
                window.scrollY > 0)
              ? "black"
              : "white";

          document
            .querySelectorAll("#searchButton svg")
            .forEach((el) => setSVGColor(el, color));
          document
            .querySelectorAll("#menuToggle svg")
            .forEach((el) => setSVGColor(el, color));
          document
            .querySelectorAll(".nav-right svg")
            .forEach((svgEl) => {
              if (svgEl.closest(".back-btn")) return;
              if (svgEl.closest(".dropdown-menu li.relative"))
                return;
              if (svgEl.classList.contains("dropdown-arrow"))
                return;
              setSVGColor(svgEl, color);
            });
          document
            .querySelectorAll(
              ".dropdown-svg, .dropdown .dropdown-toggle svg"
            )
            .forEach((el) => setSVGColor(el, color));
          document
            .querySelectorAll(".back-btn svg")
            .forEach((el) => setSVGColor(el, color));
          document
            .querySelectorAll(
              ".dropdown-menu svg, .dropdown-menu .transform"
            )
            .forEach((el) => setSVGColor(el, color));

          updateDropdownToggleColors();
          if (typeof updateHeaderBtnState === "function")
            updateHeaderBtnState();
        }

        window.updateAllSVGFills = updateAllSVGFills;

        // --- Header-btn color toggle (fully integrated) ---
        function updateHeaderBtnState() {
          if (!shouldToggleColors()) return;

          const hb =
            headerBtn ||
            (navRight && navRight.querySelector("a.btn")) ||
            document.querySelector("a.btn.btn-dark-reverse");

          if (!hb) return;
          if (hb.closest(".dropdown-menu")) return;

          const isHovered =
            headerEl?.classList.contains("header-hover");
          const headerHasWhite =
            headerEl?.classList.contains("bg-white");
          const navRightHasWhite =
            navRight?.classList.contains("bg-white");

          // ---------------------------------------------------------
          // 1️⃣ SCROLLED DOWN → ALWAYS dark
          // ---------------------------------------------------------
          if (window.scrollY > 0) {
            hb.classList.add("btn-dark-reverse");
            hb.classList.remove("btn-green-bg");
            return;
          }

          // ---------------------------------------------------------
          // 2️⃣ AT TOP + HEADER NOT HOVER + HEADER NOT WHITE
          //    → ALWAYS GREEN
          // ---------------------------------------------------------
          if (
            window.scrollY === 0 &&
            !isHovered &&
            !headerHasWhite &&
            !navRightHasWhite
          ) {
            hb.classList.add("btn-green-bg");
            hb.classList.remove("btn-dark-reverse");
            return;
          }

          // ---------------------------------------------------------
          // 3️⃣ HOVER OR WHITE BACKGROUND → DARK
          // ---------------------------------------------------------
          const useDark =
            isHovered || headerHasWhite || navRightHasWhite;
          hb.classList.toggle("btn-dark-reverse", useDark);
          hb.classList.toggle("btn-green-bg", !useDark);
        }

        // Function to update navbar text and icon colors based on header background
        function updateNavColors() {
          if (!shouldToggleColors()) return;
          if (!headerEl) return;

          const isWhite = headerEl.classList.contains("bg-white");
          const color = isWhite ? "black" : "white";

          // Update navbar text colors
          navRight.querySelectorAll(".navbar > li").forEach((li) => {
            li.classList.remove("text-black", "text-white");
            li.classList.add(`text-${color}`);
          });

          // Update mobile menu toggle color
          if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove(
              "text-black",
              "text-white"
            );
            mobileMenuToggle.classList.add(`text-${color}`);
          }

          // Update search button color
          if (searchButton) {
            searchButton.classList.remove(
              "text-black",
              "text-white"
            );
            searchButton.classList.add(`text-${color}`);
          }

          // Update SVG colors
          document
            .querySelectorAll("#searchButton svg")
            .forEach((svg) => setSVGColor(svg, color));
          document
            .querySelectorAll("#menuToggle svg")
            .forEach((svg) => setSVGColor(svg, color));
          document
            .querySelectorAll(".nav-right svg")
            .forEach((svg) => {
              if (svg.closest(".back-btn")) return;
              if (svg.closest(".dropdown-menu li.relative"))
                return;
              if (svg.classList.contains("dropdown-arrow"))
                return;
              setSVGColor(svg, color);
            });
          document
            .querySelectorAll(
              ".dropdown-svg, .dropdown .dropdown-toggle svg"
            )
            .forEach((svg) => setSVGColor(svg, color));
          document
            .querySelectorAll(".back-btn svg")
            .forEach((svg) => setSVGColor(svg, color));
          document
            .querySelectorAll(
              ".dropdown-menu svg, .dropdown-menu .transform"
            )
            .forEach((svg) => setSVGColor(svg, color));
        }

        // Call updateNavColors on page load to set initial colors
        updateNavColors();
        updateHeaderBtnState();

        // keep header button state in sync with scroll/resize
        window.addEventListener("scroll", updateHeaderBtnState, {
          passive: true,
        });
        window.addEventListener("resize", updateHeaderBtnState);
        headerEl?.addEventListener("mouseenter", updateHeaderBtnState);
        headerEl?.addEventListener("mouseleave", updateHeaderBtnState);
        navRight?.addEventListener("mouseenter", updateHeaderBtnState);
        navRight?.addEventListener("mouseleave", updateHeaderBtnState);

        ["openSearch", "closeSearch"].forEach((fn) => {
          if (typeof window[fn] === "function") {
            const originalFn = window[fn];
            window[fn] = function (...args) {
              originalFn(...args);
              updateHeaderBtnState();
              updateDropdownToggleColors();
            };
          }
        });

        if (mobileMenuToggle) {
          mobileMenuToggle.addEventListener("click", () =>
            setTimeout(() => {
              updateHeaderBtnState();
              updateDropdownToggleColors();
            }, 10)
          );
        }

        // Initial pass
        updateAllSVGFills();
        window.addEventListener("resize", () => {
          updateAllSVGFills();
          updateDropdownToggleColors();
          updateHeaderBtnState();
        });
        updateHeaderBtnState();
        updateDropdownToggleColors();

        /* ============================
           MOBILE STEPWISE MENUS
        ============================ */

        if (window.innerWidth <= 991) {
          // Open First Step (Pages)
          document
            .querySelectorAll(".dropdown .dropdown-toggle")
            .forEach((btn) => {
              btn.addEventListener("click", function () {
                const menu = this.parentElement.querySelector(".dropdown-menu");
                if (!menu) return;

                // Hard reset to closed state for animation every time
                
                menu.classList.add("step-hide");
                menu.classList.remove("step-open");
                // void menu.offsetHeight; // force reflow

                // Enable transitions and animate open
                
                menu.classList.add("step-open");
                menu.classList.remove("step-hide");
              });
            });

          // Back button (first step)
          document.querySelectorAll(".dropdown-menu .back-btn button")
            .forEach((btn) => {
              btn.addEventListener("click", function () {
                const panel = this.closest(".dropdown-menu");
                panel.classList.remove("step-open");
                panel.classList.add("step-hide");

                setTimeout(() => {
                  // panel.classList.add("hidden");
                  // Reset styles to ensure animation on next open
                  panel.style.transform = "";
                  panel.classList.remove("step-hide");
                  // panel.classList.add("step-open");
                  panel.style.opacity = "";
                  panel.style.transition = "";
                }, 350);
              });
            });

          // Open second step (nested menu)
          document.querySelectorAll(".pages-submenu-parent").forEach((parent) => {
            const clickable = parent.querySelector("div");

            clickable.addEventListener("click", function (e) {
              e.preventDefault();
              e.stopPropagation();

              const panel = parent.querySelector(".pages-submenu-panel");
              if (!panel) return;

              // ✅ PASS THE CLICKED LABEL
              ensureNestedBackButton($(panel), $(clickable));

              // Hard reset to closed state for animation every time
              panel.style.transition = "none";
              panel.style.transform = "translateX(100%)";
              panel.style.opacity = "0";
              panel.classList.add("step-hide");
              panel.classList.remove("step-open");
              void panel.offsetHeight; // force reflow

              // Enable transitions and animate open
              panel.style.transition = "transform 350ms ease, opacity 350ms ease";
              panel.style.transform = "translateX(0)";
              panel.style.opacity = "1";
              panel.classList.remove("step-hide");
              panel.classList.add("step-open");
            });
          });


          // Back button for nested menus (second step)
          document.querySelectorAll(".pages-submenu-panel .back-btn button")
            .forEach((btn) => {
              btn.addEventListener("click", function () {
                const panel = this.closest(
                  ".pages-submenu-panel"
                );
                // panel.classList.remove("step-open");
                // panel.classList.add("step-hide");

                // setTimeout(() => {
                //   panel.classList.add("step-open");
                //   panel.classList.remove("step-hide");
                // }, 350);
              });
            });
        }

        function ensureNestedBackButton($panel, $parentTrigger) {
          if (!$panel || !$panel.length) return;

          let $backWrapper = $panel.find(".nested-back-btn");

          // CREATE BACK BUTTON IF NOT EXISTS
          if (!$backWrapper.length) {
            const backHTML = `
      <div class="nested-back-btn bg-white lg:py-3 sm:py-4 py-3 border-b border-[#00000015] lg:hidden">
        <button class="text-xl gap-3 flex items-center" aria-label="Back">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6.56 12.23L1.33 7l5.23-5.23M2.05 7h10.62"
              stroke="black" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="nested-back-title !text-primary-900 md:text-base text-[15px] font-medium p-0 uppercase"></span>
        </button>
      </div>
    `;
            $panel.prepend(backHTML);
            $backWrapper = $panel.find(".nested-back-btn");
          }

          /* ✅ SET TITLE FROM PARENT MENU */
          const $titleEl = $backWrapper.find(".nested-back-title");
          if ($titleEl.length && $parentTrigger && $parentTrigger.length) {
            const title = $.trim($parentTrigger.text()) || "Back";
            $titleEl.text(title);
          }

          /* BACK CLICK (bind once) */
          const $backBtn = $backWrapper.find("button");

          if (!$backBtn.data("bound")) {
            $backBtn.on("click", function (e) {
              e.preventDefault();
              e.stopPropagation();

              // CLOSE CURRENT STEP
              $panel.removeClass("step-open");

              // OPEN PARENT MENU
              const $parentMenu = $panel.closest(".dropdown-menu");
              if ($parentMenu.length) {
                $parentMenu.addClass("step-open");
              }
            });

            $backBtn.data("bound", true);
          }
        }


        // ================================
        // STEP MENU – OPEN (jQuery)
        // ================================
        // let menuStack = [];

        // function openStepMenu(menu) {
        //   if (!menu) return;

        //   const current = menuStack[menuStack.length - 1];

        //   if (current) {
        //     current.classList.remove("is-active");
        //     current.classList.add("is-prev");
        //   }

        //   menu.classList.add("step-menu");
        //   menu.classList.add("is-active");
        //   menu.classList.remove("is-prev", "hidden");

        //   menuStack.push(menu);
        // }

        // function closeStepMenu() {
        //   if (menuStack.length <= 1) return;

        //   const current = menuStack.pop();
        //   const previous = menuStack[menuStack.length - 1];

        //   current.classList.remove("is-active");
        //   current.classList.add("hidden");

        //   previous.classList.remove("is-prev");
        //   previous.classList.add("is-active");
        // }



      });

      document.addEventListener("DOMContentLoaded", () => {
        const counters = document.querySelectorAll(".count-up");
        if (!counters.length) return;

        function animate(el, start, end, duration, suffix = "") {
          let startTime = null;

          function update(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min(
              (timestamp - startTime) / duration,
              1
            );
            const value = Math.floor(
              start + (end - start) * progress
            );
            el.textContent = value + suffix;

            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
        }

        const observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const el = entry.target;
                const end = parseInt(el.dataset.number) || 0;
                const suffix = el.dataset.suffix || "";
                animate(el, 0, end, 2000, suffix);
                obs.unobserve(el);
              }
            });
          },
          { threshold: 0.6 }
        );

        counters.forEach((el) => observer.observe(el));
      });

      document.addEventListener("DOMContentLoaded", () => {
        const MOBILE_MAX = 1170;

        // loop over each dropdown parent li
        document
          .querySelectorAll(".dropdown-menu li.relative")
          .forEach((li) => {
            const trigger = li.querySelector(
              ":scope > div:first-of-type"
            ); // clickable row
            const submenu = li.querySelector(
              ":scope > div:nth-of-type(2)"
            ); // submenu div

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
                      const sibSub =
                        sibling.querySelector(
                          ":scope > div:nth-of-type(2)"
                        );
                      if (sibSub) {
                        sibSub.classList.add("hidden");
                        sibSub.classList.remove(
                          "block"
                        );
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
            if (
              confirm(
                "Are you sure you want to delete this element?"
              )
            ) {
              $(this).slideUp(deleteElement);
            }
          },
          ready: function (setIndexes) { },
          isFirstItemUndeletable: true,
        });
      }

      // ================================  home-3    ======================================

      // blog &news section
      document.addEventListener("DOMContentLoaded", () => {
        const cards = document.querySelectorAll(".card");
        const firstCard = document.querySelector(
          '.card[data-featured="true"]'
        );
        if (!firstCard) return; // stop if no featured card found

        const firstCardContent =
          firstCard.querySelectorAll(".card-content");

        cards.forEach((card) => {
          if (card.dataset.featured === "false") {
            card.addEventListener("mouseenter", () => {
              // shrink first card + hide its content
              firstCard.classList.replace(
                "lg:flex-[3]",
                "lg:flex-[1]"
              );
              firstCardContent.forEach((el) =>
                el.classList.add("lg:opacity-0")
              );

              // expand hovered + show its content
              card.classList.replace(
                "lg:flex-[1]",
                "lg:flex-[3]"
              );
              card.querySelectorAll(".card-content").forEach(
                (el) => el.classList.remove("lg:opacity-0")
              );
            });

            card.addEventListener("mouseleave", () => {
              // reset first card
              firstCard.classList.replace(
                "lg:flex-[1]",
                "lg:flex-[3]"
              );
              firstCardContent.forEach((el) =>
                el.classList.remove("lg:opacity-0")
              );

              // reset hovered
              card.classList.replace(
                "lg:flex-[3]",
                "lg:flex-[1]"
              );
              card.querySelectorAll(".card-content").forEach(
                (el) => el.classList.add("lg:opacity-0")
              );
            });
          }

          // ✅ Hover on first card itself
          if (card.dataset.featured === "true") {
            card.addEventListener("mouseenter", () => {
              card.classList.replace(
                "lg:flex-[1]",
                "lg:flex-[3]"
              );
              firstCardContent.forEach((el) =>
                el.classList.remove("lg:opacity-0")
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
            slidesPerView: 1.5,
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
          1199: {
            slidesPerView: 2.5,
            spaceBetween: 35,
          },
          1380: {
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

        const thumbs = new Swiper(s.querySelector(".user"), {
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
          const nameEl = s.querySelector("#user-name");
          const roleEl = s.querySelector("#user-role");

          if (nameEl) {
            nameEl.textContent =
              active.getAttribute("data-name") || "";
          }
          if (roleEl) {
            roleEl.textContent =
              active.getAttribute("data-role") || "";
          }

          thumbs.slides.forEach((el) =>
            el.classList.remove("active-thumb")
          );
          if (thumbs.slides[i])
            thumbs.slides[i].classList.add("active-thumb");
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
            slidesPerView: 1,
            spaceBetween: 20,
          },
          389: {
            slidesPerView: 1.2,
            spaceBetween: 20,
          },
          472: {
            slidesPerView: 1.9,
            spaceBetween: 30,
          },
          768: {
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

      /* related blogs slider */
      var swiper = new Swiper(
        ".blog-grid-slider .blogs-2.related-blogs-2",
        {
          slidesPerView: 1,
          spaceBetween: 10,
          navigation: {
            nextEl: ".blog-grid-slider .swiper-button-next",
            prevEl: ".blog-grid-slider .swiper-button-prev",
          },
          breakpoints: {
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            992: {
              slidesPerView: 2,
              spaceBetween: 50,
            },
          },
        }
      );
    },

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
    Isotope_js: function () { },
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

// marqee slider
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
        p.className =
          "px-4 text-black text-sm h-[45px] flex items-center";
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

// video play/pause button
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

// number counting for coming soon page
document.addEventListener("DOMContentLoaded", () => {
  // Check if countdown elements exist
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
    // Elements not found → exit without error
    return;
  }

  // Read initial values from HTML
  const daysInit = parseInt(daysEl.textContent, 10);
  const hoursInit = parseInt(hoursEl.textContent, 10);
  const minutesInit = parseInt(minutesEl.textContent, 10);
  const secondsInit = parseInt(secondsEl.textContent, 10);

  // Set target date based on HTML values
  const now = new Date().getTime();
  const targetDate =
    now +
    daysInit * 24 * 60 * 60 * 1000 +
    hoursInit * 60 * 60 * 1000 +
    minutesInit * 60 * 1000 +
    secondsInit * 1000;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  // Start updating
  updateCountdown();
  setInterval(updateCountdown, 1000);
});

// Highlight active section when scrolling
const sections = document.querySelectorAll("h4[id], p[id]");
const navLinks = document.querySelectorAll("[data-target]");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 1000;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-target") === current) {
      link.classList.add("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
   setTimeout(() => {
    document.querySelectorAll('[id$="-"]').forEach(el => {

        el.id = el.id.replace(/-+$/, '');
    });
     }, 1000);
});

// ============ Handle taps on inline SVG (mobile) to open step submenus only ============
// Delegated handler: when user taps the `.dropdown-svg` inside a top-level dropdown toggle,
// open the dropdown (if needed) and toggle the first nested step submenu (pages/services/projects).
// Helper: present a nested panel as an overlay inside the dropdown menu

document.addEventListener("click", function (e) {
  const svg =
    e.target && e.target.closest ? e.target.closest(".dropdown-svg") : null;
  if (!svg) return;

  // only handle on mobile
  if (window.innerWidth >= 992) return;

  e.preventDefault();
  e.stopPropagation();

  const dropdown = svg.closest(".dropdown");
  if (!dropdown) return;

  const menu =
    dropdown.querySelector(".dropdown-menu") ||
    dropdown.querySelector("ul");
  if (!menu) return;

  // Ensure top-level menu is visible (non-animated open)
  menu.classList.remove("hidden");
  menu.classList.add("open");

  // Attempt to open only the nested panel matching this top-level toggle text.
  // Fallback: open the first panel if no match.
  const toggle = dropdown.querySelector(".dropdown-toggle");
  const toggleText = ((toggle && toggle.textContent) || "")
    .trim()
    .toLowerCase();

  // Close any open nested panels first
  menu.querySelectorAll(
    "li.relative, .pages-submenu-parent, .services-submenu-parent, .projects-submenu-parent"
  ).forEach((rp) => {
    const panel =
      rp.querySelector(":scope > div:nth-of-type(2)") ||
      rp.querySelector(".pages-submenu-panel, .submenu-panel");
    if (panel) {
      panel.classList.add("hidden");
      panel.classList.remove("block", "open");
    }
  });

  // Try to find a matching parent by text
  let targetParent = null;
  if (toggleText) {
    const candidates = menu.querySelectorAll(
      "li.relative, .pages-submenu-parent, .services-submenu-parent, .projects-submenu-parent"
    );
    candidates.forEach((cand) => {
      if (targetParent) return;
      const labelEl = cand.querySelector(
        ":scope > div:first-of-type, :scope > a"
      );
      if (!labelEl) return;
      const txt = (labelEl.textContent || "").trim().toLowerCase();
      if (!txt) return;
      if (
        txt === toggleText ||
        txt.includes(toggleText) ||
        toggleText.includes(txt)
      ) {
        targetParent = cand;
      }
    });
  }

  // Fallback to first candidate
  if (!targetParent)
    targetParent = menu.querySelector(
      "li.relative, .pages-submenu-parent, .services-submenu-parent, .projects-submenu-parent"
    );
  if (!targetParent) return;

  const nestedPanel =
    targetParent.querySelector(":scope > div:nth-of-type(2)") ||
    targetParent.querySelector(".pages-submenu-panel, .submenu-panel");
  if (!nestedPanel) return;
  const li = targetParent.closest("li") || targetParent;
  // Ensure it has a back-button (for dynamically inserted panels)
  try {
    ensureNestedBackButton($(nestedPanel), $(menu));
  } catch (e) { }
  // Present the nested panel as an overlay (third-step) without removing/hiding other items
  // showNestedOverlay(nestedPanel, menu);
  // add active class for styling if needed
  li.classList.add("submenu-active");
});

$(document).ready(function () {
  $(document).on("submit", ".get-free-quote-form", function (e) {
    e.preventDefault();
    const $form = $(this);
    const email = $form.find("#email").val();
    var $message = $form.find(".form-message");

    let footer = $(this).closest("footer");

    $.ajax({
      url: newsLetterUrl,
      method: "get",
      data: {
        email: email,
      },
      dataType: "json",
      success: function (response) {
        // You get a JSON response from Statamic
        if (response.status === true) {
          if (footer) {
            $message
              .text(response.message)
              .css("color", "#ffcb79")
              .fadeIn();
          } else {
            $message
              .text(response.message)
              .css("color", "#186f65")
              .fadeIn();
          }
          setTimeout(() => {
            $form[0].reset();
          }, 1000);
        } else {
          $message
            .text(response.message)
            .css("color", "#df5243")
            .fadeIn();
        }
      },
      error: function (response) { },
    });
  });

  let scrollPosition = 0;

  function unlockScroll() {
    $("body").css({
      position: "",
      top: "",
      width: "",
      overflow: "",
    });
    $(window).scrollTop(scrollPosition);
  }

  // --- Cookie Helpers ---
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000); // days to milliseconds
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  }

  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  const isSubscribed = getCookie("newsletter_subscribed");
  const isClosed = getCookie("newsletter_closed");
  const $newsletterOverlay = $("#newsletterOverlay");

  // Only show popup if no cookie found
  if (!isSubscribed && !isClosed) {
    if ($newsletterOverlay.length) {
      $newsletterOverlay.removeClass("hidden");
    }
  } else {
    // Hide popup immediately if cookie exists
    if ($newsletterOverlay.length) {
      $newsletterOverlay.addClass("hidden");
    }
  }

  // --- Close Newsletter Popup ---
  window.closeNewsletter = function () {
    if ($newsletterOverlay.length) {
      $newsletterOverlay.addClass("hidden");

      // Hide popup for 7 days
      setCookie("newsletter_closed", "true", 7);
    }
  };

  window.closeNewsletters = function () {
    if ($newsletterOverlay.length) {
      $newsletterOverlay.addClass("hidden");
    }
  };

  $(document).on("submit", ".newsletter-form", function (e) {
    e.preventDefault();
    const $form = $(this);
    const email = $form.find("#email").val();
    var $message = $form.find(".form-message");

    $.ajax({
      url: newsLetterUrl,
      method: "get",
      data: {
        email: email,
      },
      dataType: "json",
      success: function (response) {
        // You get a JSON response from Statamic
        if (response.status === true) {
          $message
            .text(response.message)
            .css("color", "#186f65")
            .fadeIn();
          setCookie("newsletter_subscribed", "true", 365); // hide permanently (1 year)
          setTimeout(() => {
            $form[0].reset();
            closeNewsletters();
          }, 1000);
        } else {
          $message
            .text(response.message)
            .css("color", "#df5243")
            .fadeIn();
        }
      },
      error: function (response) {
        console.log(response);
      },
    });
  });

  $(document).on("submit", "#quotationForm", function (e) {
    e.preventDefault();

    const $form = $(this);
    const formData = new FormData(this);
    const $message = $form.find(".form-message");

    // Reset messages
    $form.find(".error-message").addClass("hidden");
    $form.find(".error-message .field-error").html("");
    $form.find(".form-control").removeClass("error");

    $message.html("");

    $.ajax({
      url: $form.attr("action"),
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      headers: { "X-Requested-With": "XMLHttpRequest" },
      success: function () {
        $form.trigger("reset");
        $message.addClass("text-green-600");
        $message.html(
          "Thanks! Your quotation request has been sent successfully."
        );
      },
      error: function (response) {
        if (response.responseJSON.error) {
          $.each(
            response.responseJSON.error,
            function (field, message) {
              const $input = $form.find('[name="' + field + '"]');
              const $errorWrapper = $form.find(
                '.error-message[data-error-for="' + field + '"]'
              );
              const $errorText = $errorWrapper.find(
                '.error-text[data-error-for="' + field + '"]'
              );

              // Add red border or error style to the input
              $input.addClass("error");

              // Set error message text inside <span>
              $errorText.html(
                Array.isArray(message)
                  ? message.join("<br>")
                  : message
              );

              // Show the wrapper (was hidden initially)
              $errorWrapper
                .removeClass("hidden opacity-0")
                .addClass("flex opacity-100");
            }
          );
        }
      },
    });
  });

  // Initialize intlTelInput for all phone inputs
  const phoneInputs = document.querySelectorAll("#phone");
  phoneInputs.forEach((phoneInput) => {
    if (phoneInput && window.intlTelInput) {
      window.intlTelInput(phoneInput, {
        initialCountry: "auto",
        autoHideDialCode: true,
        nationalMode: false,
        placeholderNumberType: "NONE",
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.1.1/js/utils.min.js",
        geoIpLookup: function (callback) {
          fetch("https://ipapi.co/json")
            .then((res) => res.json())
            .then((data) => callback(data.country_code))
            .catch(() => callback("in"));
        },
      });
      phoneInput.value = "";
    }
  });

  phoneInputs.forEach((phoneInput) => {
    phoneInput.addEventListener("input", (e) => {
      const iti = window.intlTelInputGlobals.getInstance(phoneInput);
      if (iti) {
        const countryData = iti.getSelectedCountryData();

        const dialCode = countryData.dialCode || "";

        // Get the full value with country code
        let fullValue = e.target.value.replace(/\D/g, "");

        // If the number starts with the country code, separate it
        if (dialCode && fullValue.startsWith(dialCode)) {
          const numberWithoutCode = fullValue.slice(dialCode.length);

          // Limit the actual phone number to 10 digits
          if (numberWithoutCode.length > 10) {
            const limitedNumber = numberWithoutCode.slice(0, 10);
            e.target.value = dialCode + limitedNumber;
          }
        } else {
          // If no country code detected, just limit to 10 digits
          if (fullValue.length > 10) {
            e.target.value = fullValue.slice(0, 10);
          }
        }
      }
    });
  });

  const $dropArea = $("#dropArea");
  const $fileInput = $("#file_upload");
  const $uploadButton = $("#uploadButton");
  const $fileLabel = $("#fileLabel");
  const $fileInfo = $("#fileInfo");
  const $removeFiles = $("#removeFiles");

  // Open file picker
  $uploadButton.on("click", function (e) {
    e.preventDefault();
    $fileInput.trigger("click");
  });

  $dropArea.on("click", function (e) {
    // Prevent re-triggering when the file input itself fires the event
    if (e.target === $fileInput[0]) return;

    // Ignore clicks on the "Remove" button or links
    if (!$(e.target).is("button, a, #removeFiles")) {
      $fileInput.trigger("click");
    }
  });

  // File selected
  $fileInput.on("change", function () {
    const files = Array.from(this.files);
    if (files.length > 0) {
      $fileLabel.text(files.map((f) => f.name).join(", "));
      $fileInfo.removeClass("hidden");
    } else {
      $fileInfo.addClass("hidden");
    }
  });

  // Drag hover styling
  $dropArea.on("dragenter dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $dropArea.addClass("bg-gray-100");
  });

  $dropArea.on("dragleave drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $dropArea.removeClass("bg-gray-100");
  });

  // File dropped
  $dropArea.on("drop", function (e) {
    const files = e.originalEvent.dataTransfer.files;
    $fileInput[0].files = files;

    const names = Array.from(files)
      .map((f) => f.name)
      .join(", ");
    $fileLabel.text(names);
    $fileInfo.removeClass("hidden");
  });

  // Remove files
  $removeFiles.on("click", function () {
    $fileInput.val("");
    $fileLabel.text("");
    $fileInfo.addClass("hidden");
  });

  $(document).on("submit", "#contactForm", function (e) {
    e.preventDefault();
    const $form = $(this);

    var $message = $form.find(".form-message").addClass("hidden");
    $message.html("");
    $form.find(".error-message").addClass("hidden");
    $form.find(".error-message .field-error").html("");
    $form.find(".form-control").removeClass("error");

    const formData = new FormData(this);

    $.ajax({
      // Statamic sets form action automatically
      url: contactAdd,
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        // You get a JSON response from Statamic
        if (response.success) {
          $form.trigger("reset");
          $("#fileLabel").html("");
          $message.removeClass("hidden");
          let popup = $form.closest("#newsletterOverlay");
          if (popup) {
            setCookie("newsletter_subscribed", "true", 365); // hide permanently (1 year)
            setTimeout(() => {
              $form[0].reset();
              closeNewsletters();
            }, 1000);
          }

          $message.text("Thank you! We'll be in touch shortly.");
        }
      },
      error: function (response) {
        
        if (response.responseJSON.errors) {
          $.each(
            response.responseJSON.errors,
            function (field, message) {
              
              const $input = $form.find('[name="' + field + '"]');
              const $errorWrapper = $form.find(
                '.error-message[data-error-for="' + field + '"]'
              );
              const $errorText = $errorWrapper.find(
                '.error-text[data-error-for="' + field + '"]'
              );

              // Add red border or error style to the input
              $input.addClass("error");

              // Set error message text inside <span>
              $errorText.html(
                Array.isArray(message)
                  ? message.join("<br>")
                  : message
              );

              // Show the wrapper (was hidden initially)
              $errorWrapper
                .removeClass("hidden opacity-0")
                .addClass("flex opacity-100");
            }
          );
        }
      },
    });
  });

  $(document).on("submit", "#commentForm", function (e) {
    e.preventDefault();
    const $form = $(this);
    // find parent reply container
    const $replyBox = $form.closest(".reply-sibling");

    var $message = $form.find(".form-message").addClass("hidden");
    $message.html("");
    $form.find(".error-message").addClass("hidden");
    $form.find(".error-message .field-error").html("");
    $form.find(".form-control").removeClass("error");

    const formData = new FormData(this);

    $.ajax({
      // Statamic sets form action automatically
      url: $form.attr("action"),
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        // You get a JSON response from Statamic
        if (response.success) {
          $form.trigger("reset");
          $("#fileLabel").html("");
          $message.removeClass("hidden");
          $message.text(
            "Thank you! Your comment has been submitted."
          );
          location.reload();
        }
      },
      error: function (response) {
        if (response.responseJSON.error) {
          $.each(
            response.responseJSON.error,
            function (field, message) {
              const $input = $form.find('[name="' + field + '"]');
              const $errorWrapper = $form.find(
                '.error-message[data-error-for="' + field + '"]'
              );
              const $errorText = $errorWrapper.find(
                '.error-text[data-error-for="' + field + '"]'
              );
              // Add red border or error style to the input
              $input.addClass("error");
              // Set error message text inside <span>
              $errorText.html(
                Array.isArray(message)
                  ? message.join("<br>")
                  : message
              );
              // Show the wrapper (was hidden initially)
              $errorWrapper
                .removeClass("hidden opacity-0")
                .addClass("flex opacity-100");
            }
          );
        }
      },
    });
  });

  $(document).on("submit", "#enquiryForm", function (e) {
    e.preventDefault();
    const $form = $(this);

    var $message = $form.find(".form-message").addClass("hidden");
    $message.html("");
    $form.find(".error-message").addClass("hidden");
    $form.find(".error-message .field-error").html("");
    $form.find(".form-control").removeClass("error");

    const formData = new FormData(this);

    $.ajax({
      // Statamic sets form action automatically
      url: $form.attr("action"),
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        // You get a JSON response from Statamic
        if (response.success) {
          $form.trigger("reset");
          $("#fileLabel").html("");
          $message.removeClass("hidden");
          $message.text("Thank you! We'll be in touch shortly.");
        }
      },
      error: function (response) {
        if (response.responseJSON.error) {
          $.each(
            response.responseJSON.error,
            function (field, message) {
              const $input = $form.find('[name="' + field + '"]');
              const $errorWrapper = $form.find(
                '.error-message[data-error-for="' + field + '"]'
              );
              const $errorText = $errorWrapper.find(
                '.error-text[data-error-for="' + field + '"]'
              );
              // Add red border or error style to the input
              $input.addClass("error");
              // Set error message text inside <span>
              $errorText.html(
                Array.isArray(message)
                  ? message.join("<br>")
                  : message
              );
              // Show the wrapper (was hidden initially)
              $errorWrapper
                .removeClass("hidden opacity-0")
                .addClass("flex opacity-100");
            }
          );
        }
      },
    });
  });

  $.ajaxSetup({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    },
  });

  $(document).on("click", ".apply-btn", function (e) {
    e.preventDefault();

    const jobId = $(this).data("job-id");
    const redirectUrl = $(this).attr("href");

    // Call Statamic route to store session
    $.post("/set-job-session", { job_id: jobId }, function () {
      window.location.href = redirectUrl;
    });
  });

  function serviceIndexUpdate() {
    // ---- config: change selector if needed ----
    const containerSelector = ".grid_append";
    const itemSelector = ".grid-item-append";

    // ---- utility: single element processing ----
    function processElement(el, newIndex) {
      try {
        // update attributes (iterate over all attributes)
        const atts = Array.from(el.attributes || []);
        atts.forEach((att) => {
          const name = att.name;
          const value = att.value;
          if (!value) return;

          let updated = value;

          // Replace Antlers placeholder {{ index + 1 }}
          updated = updated.replace(
            /\{\{\s*index\s*\+\s*1\s*\}\}/g,
            String(newIndex)
          );

          // Replace patterns like: selected === 1 , selected !== 1 , selected === 1-6 etc.
          updated = updated.replace(
            /selected\s*(===|!==)\s*[\d-]+/g,
            (m, op) => `selected ${op} ${newIndex}`
          );
          // Replace simple assignment selected = 1 or selected = 1-6
          updated = updated.replace(
            /selected\s*=\s*[\d-]+/g,
            `selected = ${newIndex}`
          );

          // If changed, set attribute
          if (updated !== value) {
            el.setAttribute(name, updated);
            console.debug(
              "[index-update] attr updated:",
              name,
              "=>",
              updated
            );
          }
        });

        // update innerHTML / text occurrences (if any)
        if (typeof el.innerHTML === "string") {
          let inner = el.innerHTML;
          let updatedInner = inner;

          updatedInner = updatedInner.replace(
            /\{\{\s*index\s*\+\s*1\s*\}\}/g,
            String(newIndex)
          );
          updatedInner = updatedInner.replace(
            /selected\s*(===|!==)\s*[\d-]+/g,
            (m, op) =>
              `selected ${m.match(/(===|!==)/)[0]} ${newIndex}`
          );
          updatedInner = updatedInner.replace(
            /selected\s*=\s*[\d-]+/g,
            `selected = ${newIndex}`
          );

          if (updatedInner !== inner) {
            el.innerHTML = updatedInner;
            console.debug(
              "[index-update] innerHTML updated for index",
              newIndex
            );
          }
        }

        // set numeric data-index
        el.setAttribute("data-index", String(newIndex));

        // Re-init Alpine for this subtree (recommended)
        if (window.Alpine && typeof Alpine.initTree === "function") {
          try {
            Alpine.initTree(el);
          } catch (err) {
            console.warn(
              "Alpine.initTree failed for element",
              el,
              err
            );
          }
        }
      } catch (err) {
        console.error("processElement error", err, el);
      }
    }

    // ---- process all items inside a given container element ----
    function processContainer($container) {
      const base = parseInt($container.attr("data-limit"), 10) || 0;
      $container.find(itemSelector).each(function (i) {
        // newIndex = base + position (1-based)
        // const newIndex = base + (i + 1);
        const newIndex = i + 1;
        processElement(this, newIndex);
      });
    }

    // ---- initial run for existing containers ----
    $(document).ready(function () {
      $(containerSelector).each(function () {
        processContainer($(this));
      });
    });

    // ---- optional: automatically process nodes appended later using MutationObserver ----
    (function watchAppends() {
      const observerConfig = { childList: true, subtree: true };

      const observer = new MutationObserver(function (mutations) {
        mutations.forEach((m) => {
          // new nodes added
          m.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;

            // If a new container is added, process it wholly
            if (node.matches && node.matches(containerSelector)) {
              processContainer($(node));
              return;
            }

            // If a new item is added directly, find its container and re-run container processing
            if (node.matches && node.matches(itemSelector)) {
              const $container =
                $(node).closest(containerSelector);
              if ($container.length) processContainer($container);
              else
                processElement(
                  node,
                  parseInt(
                    node.getAttribute("data-index"),
                    10
                  ) || 1
                );
              return;
            }

            // If subtree contains items, process them by finding containing parent
            const $items = $(node).find(itemSelector);
            if ($items.length) {
              $items.each(function () {
                const $container =
                  $(this).closest(containerSelector);
                if ($container.length)
                  processContainer($container);
                else {
                  // fallback: compute index from its position among siblings
                  const siblings = $(this)
                    .siblings(itemSelector)
                    .addBack();
                  const pos = siblings.index(this);
                  processElement(this, pos + 1);
                }
              });
            }
          });
        });
      });

      observer.observe(document.documentElement, observerConfig);
      // store for possible future disconnect
      window.__IndexUpdaterObserver = observer;
    })();

    // ---- expose helper if you want to call manually from AJAX success ----
    window.updateServiceIndexes = function (containerSelectorOrElement) {
      const $el =
        containerSelectorOrElement instanceof jQuery
          ? containerSelectorOrElement
          : $(containerSelectorOrElement);
      if (!$el.length) return;
      if ($el.is(containerSelector)) processContainer($el);
      else
        $el.each(function () {
          const $c = $(this).closest(containerSelector);
          if ($c.length) processContainer($c);
        });
    };
  }
  initFaqHoverImage();
  function initFaqHoverImage() {
    const $hoverImage = $(".hover-image");
    if (!$hoverImage.length) return;

    // Remove old events to avoid duplicates after AJAX append
    $(".faqs-title, .faqs-content p").off(
      "mouseenter mouseleave mousemove"
    );

    $(".faqs-list").each(function () {
      const $faq = $(this);
      const $title = $faq.find(".faqs-title");
      const $para = $faq.find(".faqs-content p");

      function bindHover($el) {
        if (!$el.length) return;

        $el.on("mouseenter", function () {
          if (!$faq.hasClass("active")) return;

          const imgUrl = $faq.data("img");
          if (imgUrl) {
            
            $hoverImage.attr("src", imgUrl).addClass("opacity-100");
          }
        });

        $el.on("mouseleave", function () {
          $hoverImage.removeClass("opacity-100");
        });

        $el.on("mousemove", function (e) {
          const $container = $faq.closest(".hover-image-section");
          if (!$container.length) return;

          const rect = $container[0].getBoundingClientRect();
          $hoverImage.css({
            left: e.clientX - rect.left + 10 + "px",
            top: e.clientY - rect.top + 10 + "px",
          });
        });
      }

      bindHover($title);
      bindHover($para);
    });

    // Fix height for first open item
    const $active = $(".faqs-list.active").first();
    if ($active.length) {
      const $content = $active.find(".faqs-content");
      if ($content.length) {
        requestAnimationFrame(() => {
          $content.css("max-height", $content[0].scrollHeight + "px");
        });
      }
    }
  }

  function initCardHoverEffects(){
   const $cards = $(".card");
    const $firstCard = $('.card[data-featured="true"]');

    if (!$firstCard.length) return;

    const $firstCardContent = $firstCard.find(".card-content");

    $cards.each(function () {
        const $card = $(this);
        const isFeatured = $card.data("featured") === true;

        // -------------------------------
        // Non-featured cards
        // -------------------------------
        if (!isFeatured) {
            $card.on("mouseenter", function () {
                // shrink first card + hide its content
                $firstCard.removeClass("lg:flex-[3]").addClass("lg:flex-[1]");
                $firstCardContent.addClass("lg:opacity-0");

                // expand hovered + show its content
                $card.removeClass("lg:flex-[1]").addClass("lg:flex-[3]");
                $card.find(".card-content").removeClass("lg:opacity-0");
            });

            $card.on("mouseleave", function () {
                // reset first card
                $firstCard.removeClass("lg:flex-[1]").addClass("lg:flex-[3]");
                $firstCardContent.removeClass("lg:opacity-0");

                // reset hovered card
                $card.removeClass("lg:flex-[3]").addClass("lg:flex-[1]");
                $card.find(".card-content").addClass("lg:opacity-0");
            });
        }

        // -------------------------------
        // Featured card hover
        // -------------------------------
        if (isFeatured) {
            $card.on("mouseenter", function () {
                $card.removeClass("lg:flex-[1]").addClass("lg:flex-[3]");
                $firstCardContent.removeClass("lg:opacity-0");
            });
        }
    });
}

initCardHoverEffects();

 /* =========================================================
       LIGHTBOX SYSTEM  (converted to jQuery)
    ========================================================= */

    let currentIndex = 0;
    let galleryImages = [];

    function setupLightbox() {
        galleryImages = $(".js-gallery img")
            .filter(function () {
                return !$(this).closest(".cloned").length;
            })
            .toArray();

        $(".js-gallery").on("click", function (e) {
            const img = $(e.target).closest("img")[0];
            if (!img) return;

            const index = galleryImages.findIndex((g) => g.src === img.src);
            if (index >= 0) openLightbox(index);
        });
    }

    let scrollTop = 0;

    function openLightbox(index) {
        currentIndex = index;

        $("#galleryLightbox").removeClass("hidden").addClass("flex");

        scrollTop = $(window).scrollTop();

        $("body").css({
            position: "fixed",
            top: `-${scrollTop}px`,
            left: 0,
            right: 0,
        });

        updateLightbox();
    }

    window.closeLightbox = function () {
        $("#galleryLightbox").addClass("hidden");

        $("body").css({
            position: "",
            top: "",
            left: "",
            right: "",
        });

        $(window).scrollTop(scrollTop);
    };

    function updateLightbox() {
        if (!galleryImages.length) return;

        const img = galleryImages[currentIndex];

        $("#lightboxMain").html(
            `<img src="${img.src}" class="xl:max-h-[70vh] sm:max-h-[60vh] max-h-[90vh] object-contain mx-auto">`
        );

        const $thumbs = $("#lightboxThumbs").empty();

        galleryImages.forEach((thumb, i) => {
            const $t = $("<img>", {
                src: thumb.src,
                class: "w-20 h-20 object-cover cursor-pointer border-2 " + (i === currentIndex ? "border-white" : "border-transparent"),
            });

            $t.on("click", function () {
                currentIndex = i;
                updateLightbox();
            });

            $thumbs.append($t);
        });
    }

    window.nextImage = function () {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateLightbox();
    };

    window.prevImage = function () {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightbox();
    };

    window.toggleFullscreen = function () {
        const img = $("#lightboxMain img")[0];
        if (!img) return;

        if (img.requestFullscreen) img.requestFullscreen();
        else if (img.webkitRequestFullscreen) img.webkitRequestFullscreen();
        else if (img.msRequestFullscreen) img.msRequestFullscreen();
    };

    setupLightbox();

  $(document).on("click", ".ajax-load-more-grid", function (e) {
    e.preventDefault();

    var $button = $(this);
    var nextPageUrl = $button.attr("href");
    var currentPage = parseInt($(".currentPage").val());
    var lastPage = parseInt($(".lastPage").val());
    var pageNum = 1;
    if (nextPageUrl) {
      var urlParams = new URLSearchParams(nextPageUrl.split("?")[1]);
      pageNum = parseInt(urlParams.get("page")) || 1;
    }

    const appEnv = document
      .querySelector('meta[name="app-env"]')
      ?.getAttribute("content");
    if (appEnv === "production") {
      if (nextPageUrl && nextPageUrl.startsWith("http:")) {
        nextPageUrl = nextPageUrl.replace(/^http:/, "https:");
      }
    }

    $button.find("img").removeClass("hidden");
    if (!nextPageUrl || currentPage >= lastPage) {
      $button.find("img").addClass("hidden");
      $button.remove();
      return;
    }

    $button.prop("disabled", true).addClass("loading");
    $.ajax({
      url: nextPageUrl,
      type: "GET",
      dataType: "html",
      headers: { "X-Requested-With": "XMLHttpRequest" },
      success: function (response) {
        var $response = $("<div>").html(response);
        var $newItems = $response.find(".grid-item-append");
        var $newLoadMoreWrap = $response.find(".load-more-wrap");
        $button.find("img").addClass("hidden");

        if ($newItems.length) {
          $(".grid_append").append($newItems);
        }
        setupLightbox();
         setTimeout(function() {
            initCardHoverEffects();
          }, 1000);

        //service one page index update
        if ($(".grid_append.service-one").length) {
          serviceIndexUpdate();

          setTimeout(function () {
            initFaqHoverImage();
            initCardHoverEffects();
          }, 1000);
        }

        $(".service-item-number").each(function (i) {
          const num = i + 1;
          $(this).text(num < 10 ? "0" + num : num);
        });

        if ($newLoadMoreWrap.length) {
          $(".load-more-wrap").html($newLoadMoreWrap.html());
        } else {
          $(".load-more-wrap").remove();
        }

        if (pageNum == lastPage) {
          $(".load-more-wrap").remove();
        }
      },
      error: function (xhr, status, error) {
        $button.find("img").addClass("hidden");
        
      },
      complete: function () {
        $button.prop("disabled", false).removeClass("loading");
      },
    });
  });

  const $resultBox = $("#searchSuggestions");
  const $loader = $("#search-loader");
  const $svg = $("#search-loader svg");
  const $viewAllBtns = $(".toggle-view-btn");

  const $searchBox = $("#searchBox");
  const $searchInput = $("#searchInput");

  let timeout;
  let angle = 0;
  let rotateInterval;

  function rotate() {
    rotateInterval = setInterval(() => {
      angle = (angle + 6) % 360;
      $svg.css("transform", `rotate(${angle}deg)`);
    }, 16);
  }
  rotate();

  $(document).on("keyup", $searchInput, function () {
    const query = $.trim($searchInput.val());
    clearTimeout(timeout);

    if (query.length < 2) {
      $resultBox.html("").removeClass("hidden");
      $loader.addClass("hidden");
      $viewAllBtns.each(function () {
        const type = $(this).data("type");
        $(this).attr("href", `/${type}?s=`);
      });
      $(".search-menu-bar").css("overflow", "visible");
      return;
    }

    $loader.removeClass("hidden");
    timeout = setTimeout(() => {
      $(".search-menu-bar").css("overflow", "visible");
      $.ajax({
        url: `${headerSearch}?q=${encodeURIComponent(query)}`,
        method: "GET",
        success: function (html) {
          $resultBox
            .removeClass("hidden")
            .html(html)
            .addClass("show");
          $(".toggle-view-btn").each(function () {
            const type = $(this).data("type");
            if (type) {
              $(this)
                .attr(
                  "href",
                  `/${type}?s=${encodeURIComponent(query)}`
                )
                .attr("data-query", query);
            }
          });
        },
        error: function () {
          $resultBox
            .html(
              '<p class="text-red-600">Error loading results.</p>'
            )
            .addClass("hidden");
        },
        complete: function () {
          $loader.addClass("hidden");
        },
      });
    }, 500);
  });

  const $commentsList = $(".comments-list");
  if (!$commentsList.length) return;

  const REPLY_FORM_HTML = $("#comment-form").prop("outerHTML");

  // Accordion helpers
  const accOpen = ($el) => {
    $el.removeClass("hidden").css({
      overflow: "hidden",
      transition:
        "max-height 250ms ease, opacity 200ms ease, transform 200ms ease",
      maxHeight: "0px",
      opacity: "0",
      transform: "translateY(-4px)",
    });
    requestAnimationFrame(() => {
      $el.css({
        maxHeight: $el.prop("scrollHeight") + "px",
        opacity: "1",
        transform: "translateY(0)",
      });
    });
    $el.one("transitionend", function () {
      $el.css({
        maxHeight: "",
        overflow: "",
        transition: "",
        opacity: "",
        transform: "",
      });
    });
  };

  const accClose = ($el, remove = false) => {
    $el.css({
      overflow: "hidden",
      transition:
        "max-height 250ms ease, opacity 200ms ease, transform 200ms ease",
      maxHeight: $el.prop("scrollHeight") + "px",
    });
    requestAnimationFrame(() => {
      $el.css({
        maxHeight: "0px",
        opacity: "0",
        transform: "translateY(-4px)",
      });
    });
    $el.one("transitionend", function () {
      if (remove) $el.remove();
      else
        $el.addClass("hidden").css({
          maxHeight: "",
          overflow: "",
          transition: "",
          opacity: "",
          transform: "",
        });
    });
  };

  $commentsList.on("click", "a", function (e) {
    const $a = $(this);
    const text = $a.text().toLowerCase();
    const href = ($a.attr("href") || "").trim();
    const blog_id = $a.data("blog_id");
    const parent_id = $a.data("parent_id");

    // Only trigger for reply links
    if (!/reply/.test(text) && href !== "#") return;
    e.preventDefault();

    const $content = $a.closest(".comments-content");
    const $row = $content.parent();
    let $box = $row.next(".reply-sibling");

    // Close all other reply forms first
    $(".reply-sibling")
      .not($box)
      .each(function () {
        accClose($(this), true); // Hide any open forms
      });

    // If form does not exist — create it
    if (!$box.length) {
      const formHtml = $(REPLY_FORM_HTML).clone(true);

      // ✅ set parent_id value if exists inside form
      formHtml.find('input[name="parent_id"]').val(parent_id);
      formHtml.find('input[name="blog_id"]').val(blog_id);

      $box = $(
        '<div class="reply-sibling mt-5 sm:mt-6 reply-form hidden"></div>'
      )
        .css("border-left", "1px solid #00000026")
        .html(formHtml)
        .insertAfter($row);

      const $form = $box.find("form");
      const $cancelBtn = $box.find(".reply-cancel");

      // Cancel button closes the form
      $cancelBtn.on("click", function (e) {
        e.preventDefault();
        accClose($box, true);
      });

      accOpen($box); // open new one
    } else {
      // If already exists, toggle it
      if ($box.hasClass("hidden")) accOpen($box);
      else accClose($box, true);
    }
  });

  // Hide avatars in replies
  $("<style>")
    .text(
      `
      .reply-wrap img{display:none!important}
      .reply-wrap>.overflow-hidden{display:none!important;width:0!important;max-width:0!important;margin:0!important;padding:0!important}
      .comments-list>.reply-wrap,.comments-list>.reply-sibling{border-top-width:0!important;border-top-style:none!important}
  `
    )
    .appendTo("head");

  function lockScroll() {
    scrollPosition = $(window).scrollTop();
    $("body").css({
      top: `-${scrollPosition}px`,
      width: "100%",
    });
  }
});

$(document).ready(function () {
  const $popup = $(".cookieOverlay");

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 86400000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  }

  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  // Hide popup if already accepted
  if (localStorage.getItem("cookieConsent") || getCookie("OptanonConsent")) {
    $popup.removeClass("open").hide();
  }

  function handleConsent(selected = []) {
    
    setCookie("OptanonAlertBoxClosed", new Date().toISOString(), 365);

    if (selected == "all") {
      selected = ["targeting", "performance", "necessary", "functional"];
      localStorage.setItem("cookieConsent", JSON.stringify(selected));
    }else{
      localStorage.setItem("cookieConsent", JSON.stringify(selected));
    }
    const groups = {
      C0001: 1, // Necessary
      C0002: selected.includes("functional") ? 1 : 0,
      C0003: selected.includes("performance") ? 1 : 0,
      C0004: selected.includes("targeting") ? 1 : 0,
    };

    // Build cookie string
    const groupsString = Object.entries(groups)
      .reverse() // ensures order C0004→C0001
      .map(([key, val]) => `${key}:${val}`)
      .join(",");

    const consent = `landingPath=NotLandingPage&datestamp=${encodeURIComponent(
      new Date().toString()
    )}&version=202403.1.0&groups=${groupsString}&hosts=`;
    setCookie("OptanonConsent", consent, 365);
    $popup.removeClass("open").fadeOut();
    unlockScroll();
  }

  // Define all cookie categories
  const categories = ["targeting", "performance", "necessary", "functional"];

  // --- Add smooth accordion transition ---
  categories.forEach((category) => {
    const content = document.getElementById(category + "Content");
    if (content) {
      content.style.transition = "max-height 0.3s ease-out";
    }
  });

  // --- Open Settings Panel ---
  $(document).on("click", ".settings_button", function () {
    const $initialPopup = $("#initialPopup");
    const $settingsPanel = $("#settingsPanel");

    if ($initialPopup.length && $settingsPanel.length) {
      $initialPopup.addClass("hidden");
      $settingsPanel
        .removeClass("hidden")
        .addClass("flex animate-slide-up");
      setDefaultAccordion();
    }
  });

  // --- Show Cookie Popup ---
  showCookiePopup();

  function showCookiePopup() {
    const $cookieOverlay = $("#cookieOverlay");
    if ($cookieOverlay.length) {
      $cookieOverlay.removeClass("hidden");
      setTimeout(() => {
        $cookieOverlay.removeClass("opacity-0");
      }, 10);
      // lockScroll();
    }
  }

  // --- Close Popup ---
  window.closeCookiePopup = function () {
    const $cookieOverlay = $("#cookieOverlay");
    if ($cookieOverlay.length) {
      $cookieOverlay.addClass("hidden");
      setTimeout(() => {
        // Hide popup for 7 days
        setCookie("OptanonConsent", "true", 7);
        $cookieOverlay.addClass("hidden");
        // unlockScroll();
        resetAccordions();
      }, 300);
    }
  };

  // --- Accept / Reject ---
  $(document).on("click", ".acceptCookies", function () {
    
    $(".updateToggle").prop('checked', true);
    handleConsent("all");
  });

  $(document).on("click", ".rejectAll", function () {
    
    closeCookiePopup();
  });

  $(document).on("click", ".closeCookie", function (e) {
    e.preventDefault();
    closeCookiePopup();
  });

  $(document).on("click", ".confirm_choices", function (e) {
    e.preventDefault();
    

    const selected = [];
    $(".updateToggle:checked").each(function () {
      selected.push($(this).attr("name"));
    });
    
    handleConsent(selected);
  });


 const savedConsent = JSON.parse(localStorage.getItem("cookieConsent") || "[]");

  $(".updateToggle").each(function () {
    const name = $(this).attr("name");
    $(this).prop("checked", savedConsent.includes(name));
  });

  // --- Accordion Toggle ---
  window.toggleAccordion = function (category) {
    const $content = $("#" + category + "Content");
    const $icon = $("#" + category + "Icon");
    const $button = $(`button[onclick="toggleAccordion('${category}')"]`);
    const $box = $button.closest(".accordion-box");

    if (!$content.length || !$icon.length || !$box.length) return;

    // Close all other categories
    categories.forEach((otherCat) => {
      if (otherCat !== category) {
        const $otherContent = $("#" + otherCat + "Content");
        const $otherIcon = $("#" + otherCat + "Icon");
        const $otherBox = $(
          `button[onclick="toggleAccordion('${otherCat}')"]`
        ).closest(".accordion-box");

        if (
          $otherContent.length &&
          $otherIcon.length &&
          $otherBox.length
        ) {
          $otherContent.css("max-height", "0px");
          $otherIcon.removeClass("rotate-180");
          $otherBox
            .removeClass("border-black")
            .addClass("border-gray-300");
        }
      }
    });

    // Toggle selected one
    if ($icon.hasClass("rotate-180")) {
      $content.css("max-height", "0px");
      $icon.removeClass("rotate-180");
      $box.removeClass("border-black").addClass("border-gray-300");
    } else {
      $content.css("max-height", $content.prop("scrollHeight") + "px");
      $icon.addClass("rotate-180");
      $box.addClass("border-black").removeClass("border-gray-300");
    }
  };

  // --- Set Default Accordion ---
  function setDefaultAccordion() {
    categories.forEach((category) => {
      const $content = $("#" + category + "Content");
      const $icon = $("#" + category + "Icon");
      const $box = $(
        `button[onclick="toggleAccordion('${category}')"]`
      ).closest(".accordion-box");

      if ($content.length && $icon.length && $box.length) {
        $content.css("max-height", "0px");
        $icon.removeClass("rotate-180");
        $box.removeClass("border-black").addClass("border-gray-300");
      }
    });

    // Open default accordion (Targeting)
    const targetCategory = "targeting";
    const $targetContent = $("#" + targetCategory + "Content");
    const $targetIcon = $("#" + targetCategory + "Icon");
    const $targetBox = $(
      `button[onclick="toggleAccordion('${targetCategory}')"]`
    ).closest(".accordion-box");

    if ($targetContent.length && $targetIcon.length && $targetBox.length) {
      $targetContent.css(
        "max-height",
        $targetContent.prop("scrollHeight") + "px"
      );
      $targetIcon.addClass("rotate-180");
      $targetBox.addClass("border-black").removeClass("border-gray-300");
    }
  }

  // --- Reset Accordions ---
  function resetAccordions() {
    categories.forEach((category) => {
      const $content = $("#" + category + "Content");
      const $icon = $("#" + category + "Icon");
      const $box = $(
        `button[onclick="toggleAccordion('${category}')"]`
      ).closest(".accordion-box");

      if ($content.length && $icon.length && $box.length) {
        $content.css("max-height", "0px");
        $icon.removeClass("rotate-180");
        $box.removeClass("border-black").addClass("border-gray-300");
      }
    });
  }

  // --- Scroll Lock / Unlock ---
  function lockScroll() {
    $("body").css("overflow", "");
  }

  function unlockScroll() {
    $("body").css("overflow", "");
  }

  //theme color
  const THEME_STORAGE_KEY = "selectedThemeV2";

  // Apply theme from localStorage on page load
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    $("html").attr("class", savedTheme);
    $(".theme-btn").removeClass("active");
    $(".theme-btn[data-settheme='" + savedTheme + "']").addClass("active");
  } else {
    const defaultTheme = $(".theme-btn.active").data("settheme") || "theme-primary";
    $("html").attr("class", defaultTheme);
  }

  // Theme button click
  $(document).on("click", ".theme-btn", function (e) {
    e.preventDefault();

    var theme = $(this).data("settheme"); // get data-settheme
    setTheme(theme, $(this));
  });

  function setTheme(theme, $button) {
    // Apply theme class to <html>
    $("html").attr("class", theme);

    // Save selection in localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Toggle active class
    $(".theme-btn").removeClass("active");
    $button.addClass("active");
  }
  // end theme color

  // Select the header
  const $header = $(".header");
  const $headerButtons = $(".header-options .headers");

  // Get saved header type from localStorage or fallback to active button
  let stickyMode =
    localStorage.getItem("headerType") === "sticky" ||
    $(".headers.active").val() === "sticky";

  function updateHeader() {
    if (stickyMode) {
      const scroll = $(window).scrollTop();
      if (scroll > 0) {
        $header.addClass("fixed top-0 shadow-lg sticky-header");
      } else {
        $header.removeClass("fixed top-0 shadow-lg sticky-header");
      }
    } else {
      $header.removeClass("fixed top-0 shadow-lg sticky-header");
    }
  }

  // Apply saved header type on page load
  const savedType = localStorage.getItem("headerType");
  if (savedType) {
    $headerButtons.removeClass("active");
    $headerButtons.filter("[value='" + savedType + "']").addClass("active");
    stickyMode = savedType === "sticky";
    updateHeader();
  }

  // Button click handler
  $headerButtons.on("click", function () {
    $headerButtons.removeClass("active");
    $(this).addClass("active");

    stickyMode = $(this).val() === "sticky";

    // Save selection in localStorage
    localStorage.setItem("headerType", $(this).val());

    updateHeader();
  });

  // Scroll handler
  $(window).on("scroll", function () {
    updateHeader();
  });

  // Initial check
  updateHeader();

  // Select the header end

  $(
    ".blog-details-content p strong, h2 strong, h1 strong, h3 strong, h4 strong, h5 strong, h6 strong"
  ).each(function (index, el) {
    var $el = $(el);
    // Generate an ID from the text
    var id = $el
      .text()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    $el.attr("id", id); // ensure uniqueness
  });
  $(".insight [data-target]").first().addClass("active");
  // Helper to get the current sticky header offset
  function getHeaderOffset() {
    const $header = $("header");
    if (!$header.length) return 100;
    const height = Math.round($header.outerHeight());
    return Math.max(0, height) + 10; // spacing
  }

  // Scroll to target when sidebar item clicked
  $("[data-target]").on("click", function (e) {
    const $link = $(this);
    const targetId = $link.data("target");
    const $section = $("#" + targetId);

    if ($section.length) {
      e.preventDefault();
      const yOffset = -getHeaderOffset();
      const y = $section.offset().top + yOffset;
      $("html, body").animate({ scrollTop: y }, 300); // smooth scroll
    }
  });

  // Highlight active section when scrolling
  const $sections = $("h3[id], h4[id], p[id], strong[id]");
  const $navLinks = $("[data-target]");

  $(window).on("scroll", function () {
    let current = "";
    const threshold = getHeaderOffset() + 8;

    $sections.each(function () {
      const top = $(this).offset().top - $(window).scrollTop();
      if (top <= threshold) {
        current = $(this).attr("id");
      }
    });

    $navLinks.each(function () {
      const $link = $(this);
      const target = $link.attr("data-target");
      $link.removeClass("active");
      if (target && target.trim().toLowerCase() === current) {
        $link.addClass("active");
      }
    });
  });

  // Insights section smooth scroll + active highlight
  $(".insight [data-target]").on("click", function (e) {
    e.preventDefault();

    const $item = $(this);
    const targetId = $item.data("target");
    const $targetSection = $("#" + targetId);

    if ($targetSection.length) {
      const yOffset = getHeaderOffset();
      const y = $targetSection.offset().top - yOffset;
      $("html, body").stop().animate({ scrollTop: y }, 600);
      $(".insight .active").removeClass("active");

      $item.addClass("active");
    }
  });

  const $applyButtons = $('.apply-btn');
    const $enquiryForm = $('#enquiryForm');

    if ($applyButtons.length && $enquiryForm.length) {
        $applyButtons.on('click', function (e) {
            e.preventDefault();

            // small delay because theme scripts run heavy on click
            setTimeout(function () {
                const headerHeight = $('header').outerHeight() || 100;

                const elementPosition = $enquiryForm.offset().top;
                const offsetPosition = elementPosition - headerHeight - 10;

                $('html, body').animate(
                    { scrollTop: offsetPosition },
                    600
                );
            }, 120);
        });
    }

    $(document).on("click", ".job_btn", function (e) {
      e.preventDefault();

      const $btn = $(this);
      const jobId = $btn.data("job-id");
      const redirectUrl = $btn.data("url"); 
      const $enquiryForm = $('#enquiryForm');

      // If enquiry form exists on same page → scroll
      if ($enquiryForm.length && jobId) {
        setTimeout(function () {

         const $position = $enquiryForm.find('#position');

      // Set selected option by value
         $position.val(jobId).trigger('change');

         const headerHeight = $('header').outerHeight() || 100;
         const offsetPosition = $enquiryForm.offset().top - headerHeight - 10;

         $('html, body').animate(
          { scrollTop: offsetPosition },
          600
          );
       }, 120);
        return;
      }
      // Otherwise → redirect
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    });

});
