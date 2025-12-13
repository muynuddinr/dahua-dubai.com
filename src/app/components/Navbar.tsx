"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import axios from "axios";

interface HeaderProps {
  logo: {
    url: string;
    alt?: string;
  };
  email?: string;
  telephone?: string;
  location?: string;
}

interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
  href: string;
  order: number;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  navbarCategoryId:
    | {
        _id: string;
        name: string;
      }
    | string;
  isActive: boolean;
  order: number;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  images: {
    url: string;
    publicId: string;
  }[];
  description?: string;
}

interface ReloadLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const ReloadLink = ({ href, children, ...props }: ReloadLinkProps) => {
  return (
    <a
      href={href}
      onClick={() => {
        window.location.href = href;
      }}
      {...props}
    >
      {children}
    </a>
  );
};

const Navbar = ({
  logo,
  email = "  sales@dahua-dubai.com",
  telephone = "+971 55 2929644",
  location = "Al Barsha, Dubai, UAE",
}: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileSubMenu, setMobileSubMenu] = useState<null | string>(null);
  const [navCategories, setNavCategories] = useState<NavbarCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mapsLink = `https://www.google.com/maps/place/25th+St+-+Deira+-+Dubai+-+United+Arab+Emirates/@25.279038,55.324346,16z/data=!4m6!3m5!1s0x3e5f5cb74997acd3:0x497aa605b636b17e!8m2!3d25.2790379!4d55.3243465!16s%2Fg%2F1tqnk2cw?hl=en&entry=ttu&g_ep=EgoyMDI5MTExNy4wIKXMDSoASAFQAw%3D%3D`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const navbarResponse = await axios.get("/api/navbar-category");
        if (navbarResponse.data.success) {
          const activeNavCategories = navbarResponse.data.data
            .filter((cat: NavbarCategory) => cat.isActive)
            .sort((a: NavbarCategory, b: NavbarCategory) => a.order - b.order);
          setNavCategories(activeNavCategories);
        }

        const categoryResponse = await axios.get("/api/category");
        if (categoryResponse.data.success) {
          const activeCategories = categoryResponse.data.data
            .filter((cat: Category) => cat.isActive)
            .sort((a: Category, b: Category) => a.order - b.order);
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error("Error fetching navigation data:", error);
        setNavCategories([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search functionality
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await axios.get("/api/product");
      if (response.data.success) {
        const filtered = response.data.data.filter(
          (product: Product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description?.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 8));
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      // Check if click is on search button
      const isSearchButton = (e.target as HTMLElement).closest(
        'button[aria-label*="search" i]'
      );

      // Only close search if clicking outside AND not on the search button
      if (
        searchRef.current &&
        !searchRef.current.contains(target) &&
        !isSearchButton
      ) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    // Only add listener if search is open
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (navRef.current && !navRef.current.contains(target)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [activeDropdown]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isPathActive = (currentPath: string, targetPath: string) => {
    if (targetPath === "/") {
      return currentPath === targetPath;
    }

    if (targetPath === "/products" || targetPath === "/product") {
      return currentPath.startsWith("/product");
    }

    return currentPath.startsWith(targetPath);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    {
      href: "/technologies",
      label: "Technologies",
      submenu: [
        {
          href: "/technologies/wizsense",
          label: "WizSense",
          desc: "AI-powered video analytics",
        },
        {
          href: "/technologies/wizmind",
          label: "WizMind",
          desc: "Intelligent monitoring system",
        },
        {
          href: "/technologies/full-color",
          label: "Full-color",
          desc: "24/7 colorful surveillance",
        },
        {
          href: "/technologies/auto-tracking",
          label: "Auto Tracking 3.0",
          desc: "Smart object tracking",
        },
        {
          href: "/technologies/hdcvi-ten",
          label: "HDCVI TEN Technology",
          desc: "High-definition transmission",
        },
        {
          href: "/technologies/predictive-focus",
          label: "Predictive Focus Algorithm",
          desc: "Advanced focus algorithm",
        },
      ],
    },
    {
      href: "/solutions",
      label: "Solutions",
      submenu: [
        {
          href: "/solutions/building",
          label: "Building",
          desc: "Commercial security solutions",
        },
        {
          href: "/solutions/banking",
          label: "Banking",
          desc: "Financial institution security",
        },
        {
          href: "/solutions/retail",
          label: "Retail",
          desc: "Store monitoring & analytics",
        },
        {
          href: "/solutions/transportation",
          label: "Transportation",
          desc: "Traffic & transit security",
        },
        {
          href: "/solutions/government",
          label: "Government",
          desc: "Public safety solutions",
        },
      ],
    },
    { href: "/sira", label: "Sira" },
    { href: "/about-us", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];

  const staticHrefs = navLinks.map((l) => l.href);
  const mergedNavLinks = [
    ...navLinks.slice(0, 1),
    ...navCategories
      .filter((navCat) => !staticHrefs.includes(navCat.href))
      .map((navCat) => {
        const relatedCategories = categories.filter((cat) => {
          const navbarId =
            typeof cat.navbarCategoryId === "string"
              ? cat.navbarCategoryId
              : (cat.navbarCategoryId as any)._id;
          return navbarId === navCat._id;
        });

        if (relatedCategories.length > 0) {
          return {
            href: navCat.href,
            label: navCat.name,
            submenu: relatedCategories.map((cat) => ({
              href: `/product/${cat.slug}`,
              label: cat.name,
              desc: cat.description || `View ${cat.name}`,
            })),
          };
        }

        return {
          href: navCat.href,
          label: navCat.name,
        };
      }),
    ...navLinks.slice(1),
  ];

  const uniqueNavLinks = mergedNavLinks.reduce((acc: any[], curr) => {
    const exists = acc.find((item) => item.href === curr.href);
    if (!exists) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const handleDropdownMouseEnter = (href: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(href);
  };

  const handleDropdownMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      closeTimeoutRef.current = null;
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, []);

  const getViewAllLink = (href: string) => {
    switch (href) {
      case "/technologies":
        return "/technologies";
      case "/solutions":
        return "/solutions";
      case "/products":
      case "/product":
        return "/products";
      default:
        return href;
    }
  };

  const toggleSearch = useCallback(() => {
    setSearchOpen((prev) => !prev);
    if (searchOpen) {
      // If closing, clear the search
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [searchOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white text-black shadow-md z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Mobile/tablet compact menu button and logo - now only for md and below */}
          <div className="flex w-full lg:hidden items-center justify-between">
            <Link href="/" className="block">
              <Image
                src={logo?.url || "/images/dahualogo-removebg-preview.png"}
                alt={logo?.alt || "Logo"}
                width={150}
                height={200}
                className="h-12 object-contain"
              />
            </Link>

            <div className="flex items-center gap-2">
              {/* Search Button - Mobile */}
              <button
                onClick={toggleSearch}
                className="flex items-center z-[100000] relative justify-center text-black hover:text-red-600 transition-all duration-300"
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "6px",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                }}
                aria-label={searchOpen ? "Close search" : "Search"}
              >
                {searchOpen ? (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </button>

              <button
                className="flex items-center z-[100000] relative p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 relative flex flex-col justify-center items-center">
                  <div
                    className={`w-5 h-0.5 bg-red-600 rounded-full transition-all duration-300 ease-in-out absolute ${
                      mobileOpen
                        ? "rotate-45 translate-y-0"
                        : "-translate-y-1.5"
                    }`}
                  />
                  <div
                    className={`w-5 h-0.5 bg-red-600 rounded-full transition-all duration-300 ease-in-out absolute ${
                      mobileOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <div
                    className={`w-5 h-0.5 bg-red-600 rounded-full transition-all duration-300 ease-in-out absolute ${
                      mobileOpen
                        ? "-rotate-45 translate-y-0"
                        : "translate-y-1.5"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          <div
            className="hidden lg:flex items-center justify-start"
            style={{ width: "150px" }}
          >
            <Link href="/" className="block">
              <Image
                src={logo?.url || "/images/dahualogo-removebg-preview.png"}
                alt={logo?.alt || "Logo"}
                width={160}
                height={60}
                className="object-contain transition-all duration-300 hover:scale-105 w-full"
              />
            </Link>
          </div>

          <nav
            ref={navRef}
            className="hidden lg:flex items-center gap-3"
            style={{ flex: 1, justifyContent: "center" }}
          >
            {loading ? (
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-4 h-4 border-2 border-slate-300 border-t-red-600 rounded-full animate-spin"></div>
                <span className="text-xs">Loading menu...</span>
              </div>
            ) : (
              uniqueNavLinks.map((item) => (
                <div key={item.href} className="relative">
                  {item.submenu ? (
                    <div
                      onMouseEnter={() => handleDropdownMouseEnter(item.href)}
                      onMouseLeave={() => handleDropdownMouseLeave()}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-0.5 px-3 py-2 group transition-colors duration-300 text-sm ${
                          isPathActive(pathname, item.href)
                            ? "text-red-600"
                            : "text-gray-800 hover:text-red-600"
                        }`}
                      >
                        <span className="relative">
                          {item.label}
                          <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-red-600 transition-all duration-300 ${
                              isPathActive(pathname, item.href)
                                ? "w-full"
                                : "w-0 group-hover:w-full"
                            }`}
                          ></span>
                        </span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${
                            activeDropdown === item.href
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>

                      {activeDropdown === item.href && (
                        <div
                          className="fixed left-0 right-0 w-full bg-white shadow-lg py-4 z-10 mt-0 animate-fadeIn"
                          style={{
                            top: "64px",
                            borderTop: "2px solid #dc2626",
                          }}
                          onMouseEnter={() =>
                            handleDropdownMouseEnter(item.href)
                          }
                          onMouseLeave={() => handleDropdownMouseLeave()}
                        >
                          <div className="container mx-auto px-4 py-2">
                            <div className="flex flex-col items-center">
                              <h3 className="text-xl font-bold text-center border-b-2 border-red-600 pb-2 mb-6 inline-block">
                                {item.label}
                              </h3>

                              <div className="w-full max-w-6xl">
                                <div className="flex gap-8">
                                  <div className="flex-1">
                                    <div className="grid grid-cols-2 gap-4">
                                      {item.submenu.map((subItem: any) => (
                                        <ReloadLink
                                          key={subItem.href}
                                          href={subItem.href}
                                          className={`block p-4 rounded-lg border transition-all duration-300 text-sm group hover:shadow-md ${
                                            isPathActive(pathname, subItem.href)
                                              ? "border-red-600 bg-red-50 text-red-600 shadow-sm"
                                              : "border-gray-100 bg-gray-50 hover:border-red-600 text-gray-800"
                                          }`}
                                        >
                                          <div className="font-semibold group-hover:text-red-600 transition-colors">
                                            {subItem.label}
                                          </div>
                                          <div className="text-xs text-gray-500 mt-2 leading-relaxed">
                                            {subItem.desc}
                                          </div>
                                        </ReloadLink>
                                      ))}
                                    </div>

                                    <div className="flex justify-center mt-4">
                                      <ReloadLink
                                        href={getViewAllLink(item.href)}
                                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-red-600 hover:text-white transition-all duration-300 border border-gray-200 hover:border-red-600"
                                      >
                                        <span>View All {item.label}</span>
                                        <svg
                                          className="w-3 h-3 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                          />
                                        </svg>
                                      </ReloadLink>
                                    </div>
                                  </div>
                                  <div className="hidden lg:flex w-80 flex-col items-center justify-center">
                                    <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden shadow-inner">
                                      {" "}
                                       <Image
                                        src={
                                          item.href === "/technologies"
                                            ? "/images/wiz.png"
                                            : item.href === "/solutions"
                                            ? "/images/solutions.png"
                                            : "/images/aboutus.png"
                                        }
                                        alt={item.label}
                                        width={400} // increased width (320 → 400)
                                        height={240} // increased height (192 → 240)
                                        className="object-cover transition-transform duration-500 hover:scale-105"
                                      />
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 transition-all duration-300 hover:shadow-lg">
                                      <h4 className="font-bold text-lg mb-2 text-red-700">
                                        {item.href === "/technologies"
                                          ? "Advanced Technology"
                                          : item.href === "/solutions"
                                          ? "Industry Solutions"
                                          : "Expert Services"}
                                      </h4>
                                      <p className="text-sm text-red-600 leading-relaxed">
                                        {item.href === "/technologies"
                                          ? "Cutting-edge surveillance technologies for modern security needs"
                                          : item.href === "/solutions"
                                          ? "Comprehensive security solutions tailored for your industry"
                                          : "Professional services and support for your security systems"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-3 py-2 group transition-colors duration-300 text-sm ${
                        isPathActive(pathname, item.href)
                          ? "text-red-600"
                          : "text-gray-800 hover:text-red-600"
                      }`}
                    >
                      <span className="relative">
                        {item.label}
                        <span
                          className={`absolute -bottom-1 left-0 h-0.5 bg-red-600 transition-all duration-300 ${
                            isPathActive(pathname, item.href)
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }`}
                        ></span>
                      </span>
                    </Link>
                  )}
                </div>
              ))
            )}
          </nav>

          {/* Desktop contact icons and search */}
          <div
            className="hidden lg:flex items-center gap-2"
            style={{ minWidth: "auto", justifyContent: "flex-end" }}
          >
            {/* Search Icon */}
            <button
              onClick={toggleSearch}
              className="flex items-center justify-center text-black hover:text-red-600 transition-all duration-300"
              style={{
                backgroundColor: "#f8f9fa",
                padding: "6px",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
              }}
              aria-label={searchOpen ? "Close search" : "Search"}
            >
              {searchOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </button>

            <a
              href={`https://www.google.com/maps/place/25th+St+-+Deira+-+Dubai+-+United+Arab+Emirates/@25.279038,55.324346,16z/data=!4m6!3m5!1s0x3e5f5cb74997acd3:0x497aa605b636b17e!8m2!3d25.2790379!4d55.3243465!16s%2Fg%2F1tqnk2cw?hl=en&entry=ttu&g_ep=EgoyMDI5MTExNy4wIKXMDSoASAFQAw%3D%3D`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center text-black hover:text-red-600 transition-all duration-300"
              style={{
                backgroundColor: "#f8f9fa",
                padding: "6px",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
              }}
              title={location}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1112 5.5a2.5 2.5 0 010 5z" />
              </svg>
            </a>

            <a
              href={`mailto:${email}`}
              className="flex items-center justify-center text-black hover:text-red-600 transition-all duration-300"
              style={{
                backgroundColor: "#f8f9fa",
                padding: "6px",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
              }}
              title={email}
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>

            <a
              href={`tel:${telephone}`}
              className="flex items-center justify-center text-black hover:text-red-600 transition-all duration-300"
              style={{
                backgroundColor: "#f8f9fa",
                padding: "6px",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
              }}
              title={telephone}
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Search Bar - Mobile Dropdown */}
      {searchOpen && (
        <div
          id="search-bar-container-mobile"
          className="lg:hidden  absolute top-full left-0 w-full bg-white border-t border-b border-gray-200 shadow-lg z-40"
          ref={searchRef}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4 py-4">
              {/* Search Input */}
              <div className="relative flex items-center gap-2">
                <div
                  className="flex items-center justify-center text-black"
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "6px",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 px-3 py-2 border-b-2 border-gray-200 focus:border-red-600 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-0 transition-colors duration-200"
                  autoFocus
                />
                <div className="flex items-center">
                  {searchLoading ? (
                    <div className="mr-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                  ) : (
                    searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        aria-label="Clear search"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )
                  )}
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label="Close search"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Results / Popular Categories */}
              <div className="w-full">
                {searchQuery ? (
                  searchResults.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Search Results
                      </h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {searchResults.map((result) => (
                          <ReloadLink
                            key={result._id}
                            href={`/product/${result.categoryId.slug}/${result.subcategoryId.slug}/${result.slug}`}
                            className="group block p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                            onClick={() => {
                              setSearchQuery("");
                              setSearchOpen(false);
                              setSearchResults([]);
                            }}
                          >
                            <div className="font-medium text-gray-900 group-hover:text-red-600 text-sm">
                              {result.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {result.categoryId.name}
                            </div>
                          </ReloadLink>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No results found</p>
                    </div>
                  )
                ) : (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Popular Categories
                    </h3>
                    <ul className="grid grid-cols-2 gap-2">
                      {navCategories.slice(0, 6).map((category) => (
                        <li key={category._id}>
                          <Link
                            href={category.href}
                            className="text-sm text-gray-600 hover:text-red-600 transition-colors p-2 block rounded hover:bg-gray-50"
                            onClick={() => {
                              setSearchQuery("");
                              setSearchOpen(false);
                            }}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar - Desktop Dropdown */}
      {searchOpen && (
        <div
          id="search-bar-container"
          className="hidden lg:block absolute top-full left-0 w-full bg-white border-t border-b border-gray-200 shadow-lg z-40"
          ref={searchRef}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-6 py-6">
              {/* Search Input */}
              <div className="col-span-1">
                <div className="relative flex items-center gap-2">
                  <div className="flex items-center justify-center text-black"></div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-1 px-3 py-2 border-b-2 border-gray-200 focus:border-red-600 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-0 transition-colors duration-200"
                    autoFocus
                  />
                  <div className="flex items-center">
                    {searchLoading ? (
                      <div className="mr-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
                      </div>
                    ) : (
                      searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          aria-label="Clear search"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )
                    )}
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      aria-label="Close search"
                    ></button>
                  </div>
                </div>
              </div>

              {/* Results / Popular Categories */}
              <div className="col-span-3">
                {searchQuery ? (
                  searchResults.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-medium ml-3 text-gray-900 mb-3">
                        Search Results
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {searchResults.map((result) => (
                          <ReloadLink
                            key={result._id}
                            href={`/product/${result.categoryId.slug}/${result.subcategoryId.slug}/${result.slug}`}
                            className="group p-3 rounded-lg hover:bg-gray-50"
                            onClick={() => {
                              setSearchQuery("");
                              setSearchOpen(false);
                              setSearchResults([]);
                            }}
                          >
                            <div className="font-medium ml-3 text-gray-900 group-hover:text-red-600">
                              {result.name}
                            </div>
                            <div className="text-xs ml-3 text-gray-500 mt-1">
                              Product
                            </div>
                          </ReloadLink>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No results found</p>
                    </div>
                  )
                ) : (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Popular Categories
                    </h3>
                    <ul className="grid grid-cols-3 gap-2">
                      {navCategories.slice(0, 9).map((category) => (
                        <li key={category._id}>
                          <Link
                            href={category.href}
                            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                            onClick={() => {
                              setSearchQuery("");
                              setSearchOpen(false);
                            }}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          mobileOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          top: "64px",
          height: "calc(100vh - 64px)",
          backgroundColor: "transparent",
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
        onClick={(e) => {
          if (e.target === mobileMenuRef.current) {
            setMobileOpen(false);
            setMobileSubMenu(null);
          }
        }}
      >
        <div
          className={`bg-white shadow-xl overflow-y-auto transition-all duration-300 ease-in-out ${
            mobileOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          style={{
            height: "auto",
            maxHeight: "calc(100vh - 64px)",
          }}
        >
          {!mobileSubMenu ? (
            <div className="flex flex-col">
              <nav className="px-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-slate-300 border-t-red-600 rounded-full animate-spin"></div>
                    <span className="ml-2 text-slate-400">Loading...</span>
                  </div>
                ) : (
                  uniqueNavLinks.map((item) => (
                    <div
                      key={item.href}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      {item.submenu ? (
                        <button
                          className={`w-full flex items-center justify-between py-5 px-3 text-base font-medium transition-colors duration-300 ${
                            isPathActive(pathname, item.href)
                              ? "text-red-600 bg-red-50"
                              : "text-gray-800 hover:text-red-600 hover:bg-red-50"
                          }`}
                          onClick={() => setMobileSubMenu(item.href)}
                        >
                          <span
                            className={`text-lg ${
                              isPathActive(pathname, item.href)
                                ? "font-bold"
                                : "font-semibold"
                            }`}
                          >
                            {item.label}
                          </span>
                          <svg
                            className={`w-6 h-6 transition-colors duration-300 ${
                              isPathActive(pathname, item.href)
                                ? "text-red-600"
                                : "text-gray-500"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => {
                            setMobileOpen(false);
                            setMobileSubMenu(null);
                          }}
                          className={`flex items-center py-5 px-3 text-base font-medium transition-colors duration-300 ${
                            isPathActive(pathname, item.href)
                              ? "text-red-600 bg-red-50 font-bold"
                              : "text-gray-800 hover:text-red-600 hover:bg-red-50 font-semibold"
                          }`}
                        >
                          <span className="text-lg">{item.label}</span>
                          {isPathActive(pathname, item.href) && (
                            <div className="ml-auto w-2 h-8 bg-red-600 rounded-full"></div>
                          )}
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </nav>

              <div className="p-6 border-t border-gray-200 bg-gray-50 mt-auto">
                <div className="space-y-4">
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-base text-gray-600 hover:text-red-600 transition-colors duration-300 p-3 bg-white rounded-lg border border-gray-200"
                    title={location}
                  >
                    <svg
                      className="w-6 h-6 mr-3 text-red-500 transition-transform duration-300 hover:scale-110"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1112 5.5a2.5 2.5 0 010 5z" />
                    </svg>
                    <div>
                      <div className="font-semibold">Our Location</div>
                      <div className="text-sm text-gray-500">{location}</div>
                    </div>
                  </a>

                  <a
                    href={`mailto:${email}`}
                    className="flex items-center text-base text-gray-600 hover:text-red-600 transition-colors duration-300 p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <svg
                      className="w-6 h-6 mr-3 text-red-500 transition-transform duration-300 hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <div className="font-semibold">Email Us</div>
                      <div className="text-sm text-gray-500">{email}</div>
                    </div>
                  </a>
                  <a
                    href={`tel:${telephone}`}
                    className="flex items-center text-base text-gray-600 hover:text-red-600 transition-colors duration-300 p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <svg
                      className="w-6 h-6 mr-3 text-red-500 transition-transform duration-300 hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <div className="font-semibold">Call Us</div>
                      <div className="text-sm text-gray-500">{telephone}</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center bg-red-50 sticky top-0">
                <button
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-300 p-2"
                  onClick={() => setMobileSubMenu(null)}
                >
                  <svg
                    className="w-6 h-6 mr-2 transition-transform duration-300 hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="font-semibold text-lg">Back</span>
                </button>
                <span className="ml-2 font-bold text-red-600 text-lg">
                  {
                    uniqueNavLinks.find((item) => item.href === mobileSubMenu)
                      ?.label
                  }
                </span>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="p-4">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {
                        uniqueNavLinks.find(
                          (item) => item.href === mobileSubMenu
                        )?.label
                      }
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Explore our comprehensive range of options
                    </p>
                  </div>

                  <div className="space-y-3">
                    {uniqueNavLinks
                      .find((item) => item.href === mobileSubMenu)
                      ?.submenu?.map((subItem: any) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => {
                            setMobileOpen(false);
                            setMobileSubMenu(null);
                          }}
                          className={`block p-4 rounded-xl transition-all duration-300 border-2 shadow-sm ${
                            isPathActive(pathname, subItem.href)
                              ? "bg-red-50 text-red-600 border-red-600 shadow-md"
                              : "bg-white text-gray-900 hover:text-red-600 border-gray-200 hover:border-red-400 hover:shadow-md"
                          }`}
                        >
                          <div
                            className={`font-semibold text-lg mb-2 ${
                              isPathActive(pathname, subItem.href)
                                ? "font-bold"
                                : ""
                            }`}
                          >
                            {subItem.label}
                            {isPathActive(pathname, subItem.href) && (
                              <span className="ml-3 inline-flex items-center px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-sm leading-relaxed ${
                              isPathActive(pathname, subItem.href)
                                ? "text-red-500"
                                : "text-gray-600"
                            }`}
                          >
                            {subItem.desc}
                          </div>
                        </Link>
                      ))}

                    <div className="flex justify-center mt-4">
                      <ReloadLink
                        href={getViewAllLink(mobileSubMenu || "")}
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileSubMenu(null);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-red-600 hover:text-white transition-all duration-300 border border-gray-200 hover:border-red-600"
                      >
                        <span>
                          View All{" "}
                          {
                            uniqueNavLinks.find(
                              (item) => item.href === mobileSubMenu
                            )?.label
                          }
                        </span>
                        <svg
                          className="w-3 h-3 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </ReloadLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Navbar;