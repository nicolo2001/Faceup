import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Menu, X, Video, Star, Globe, Clock, 
  Sliders, ChevronDown, UserCircle, LogOut,
  Settings, MessageSquare, FileText
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { actors } from '../../data/mockData';
import { supabase } from '../../lib/supabase';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [filteredActors, setFilteredActors] = useState(actors);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    // Initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      // If no profile exists, create one with default values
      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            full_name: '',
            email: user?.email,
            user_type: 'creator',
            created_at: new Date().toISOString()
          }])
          .select()
          .maybeSingle();

        if (createError) throw createError;
        setUserProfile(newProfile);
      } else {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = actors.filter(actor => 
        actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actor.videoTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        actor.languages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase())) ||
        actor.tones.some(tone => tone.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredActors(results.slice(0, 5));
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  }, [searchTerm]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const popularSearches = [
    'Tutorial Videos',
    'Product Demo',
    'Corporate',
    'English',
    'Professional'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearchDropdown(false);
    }
  };

  return (
    <>
      <div className={`h-[${isScrolled ? '72px' : '88px'}]`}></div>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? 'shadow-md py-2' : 'py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 flex-shrink-0"
            >
              <Video className={`transition-all duration-300 ${
                isScrolled ? 'h-8 w-8' : 'h-10 w-10'
              } text-blue-600`} />
              <span className={`font-bold transition-all duration-300 ${
                isScrolled ? 'text-xl' : 'text-2xl'
              } text-gray-900`}>
                FaceUp
              </span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search actors by name, skills, languages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onFocus={() => setShowSearchDropdown(true)}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowSearchDropdown(true)}
                  >
                    <Sliders className="h-5 w-5" />
                  </button>
                </div>
              </form>

              {/* Search Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  {searchTerm.length >= 2 ? (
                    <>
                      {filteredActors.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {filteredActors.map((actor) => (
                            <div
                              key={actor.id}
                              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => {
                                navigate(`/actor/${actor.id}`);
                                setShowSearchDropdown(false);
                              }}
                            >
                              <img
                                src={actor.avatarUrl}
                                alt={actor.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="ml-3 flex-1">
                                <h4 className="font-medium text-gray-900">{actor.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  {actor.languages.slice(0, 1).map(lang => (
                                    <div key={lang} className="flex items-center text-sm text-gray-500">
                                      <Globe className="h-3 w-3 mr-1" />
                                      {lang}
                                    </div>
                                  ))}
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {actor.standardDeliveryTime}d delivery
                                  </div>
                                </div>
                              </div>
                              <div className="ml-auto pl-4">
                                <Badge variant="primary" size="sm">
                                  ${actor.basePrice}
                                </Badge>
                              </div>
                            </div>
                          ))}
                          <div className="p-3 bg-gray-50">
                            <Button
                              fullWidth
                              variant="outline"
                              onClick={() => {
                                navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                                setShowSearchDropdown(false);
                              }}
                            >
                              See all results
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No actors found for "{searchTerm}"
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Star className="h-4 w-4 text-amber-400 mr-2" />
                        Popular Searches
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                            onClick={() => {
                              setSearchTerm(term);
                              navigate(`/search?q=${encodeURIComponent(term)}`);
                              setShowSearchDropdown(false);
                            }}
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation & Actions */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex items-center space-x-6">
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    location.pathname === '/' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/search"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    location.pathname === '/search' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  Find Actors
                </Link>
                <Link
                  to="/how-it-works"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    location.pathname === '/how-it-works' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  How It Works
                </Link>
              </nav>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      {userProfile?.avatar_url ? (
                        <img
                          src={userProfile.avatar_url}
                          alt={userProfile.full_name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <UserCircle className="h-6 w-6 text-indigo-600" />
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{userProfile?.full_name || 'Guest User'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      {userProfile?.user_type === 'actor' ? (
                        <Link
                          to="/actor/dashboard"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      ) : null}
                      
                      <Link
                        to="/messages"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Messages
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => navigate('/login')}
                  >
                    <UserCircle className="h-5 w-5" />
                    Sign In
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                    onClick={() => navigate('/become-actor')}
                  >
                    Become an Actor
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <nav className="flex flex-col space-y-2 mb-4">
                <Link
                  to="/"
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    location.pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/search"
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    location.pathname === '/search' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Actors
                </Link>
                <Link
                  to="/how-it-works"
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    location.pathname === '/how-it-works' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </Link>
              </nav>

              <div className="flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="p-4 border-b border-gray-200 mb-2">
                      <p className="font-medium text-gray-900">{userProfile?.full_name || 'Guest User'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    {userProfile?.user_type === 'actor' && (
                      <Button
                        fullWidth
                        variant="outline"
                        onClick={() => {
                          navigate('/actor/dashboard');
                          setIsMenuOpen(false);
                        }}
                      >
                        Dashboard
                      </Button>
                    )}
                    <Button
                      fullWidth
                      variant="outline"
                      onClick={() => {
                        navigate('/messages');
                        setIsMenuOpen(false);
                      }}
                    >
                      Messages
                    </Button>
                    <Button
                      fullWidth
                      variant="outline"
                      onClick={() => {
                        navigate('/settings');
                        setIsMenuOpen(false);
                      }}
                    >
                      Settings
                    </Button>
                    <Button
                      fullWidth
                      variant="outline"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      fullWidth
                      variant="outline"
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => {
                        navigate('/become-actor');
                        setIsMenuOpen(false);
                      }}
                    >
                      Become an Actor
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;