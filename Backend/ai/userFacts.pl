% Dynamic declaration so facts can be injected at runtime without warnings
:- dynamic user_pref/3.

% Expected format injected by Node.js during execution:
% user_pref('UserId', category, 'gaming').

