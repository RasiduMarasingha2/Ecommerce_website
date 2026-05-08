% Dynamic declaration so facts can be injected at runtime without warnings
:- dynamic user_pref/3.

% Expected format injected by Node.js during execution:
% user_pref('UserId', category, 'gaming').
% user_pref('UserId', budget, 'medium').
% user_pref('UserId', purpose, 'gaming').
% user_pref('UserId', brand, 'premium').
% user_pref('UserId', style, 'modern').
