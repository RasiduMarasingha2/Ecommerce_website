% Rules for scoring products based on user_pref facts

:- consult('userFacts.pl').
:- consult('productFacts.pl').

% Category Match (+40)
match_category(User, ProductId, Score) :-
    user_pref(User, category, C),
    product(ProductId, _, ProductCat, _, _, _),
    (C == ProductCat -> Score = 40 ; Score = 0).

% Budget Match (+20)
match_budget(User, ProductId, Score) :-
    user_pref(User, budget, B),
    product(ProductId, _, _, ProductBudget, _, _),
    (B == ProductBudget -> Score = 20 ; Score = 0).

% Purpose Match (+30)
match_purpose(User, ProductId, Score) :-
    user_pref(User, purpose, P),
    product(ProductId, _, _, _, _, ProductPurpose),
    (P == ProductPurpose -> Score = 30 ; Score = 0).

% Brand Match (+10)
match_brand(User, ProductId, Score) :-
    user_pref(User, brand, Br),
    product(ProductId, _, _, _, ProductBrand, _),
    ((Br == ProductBrand ; ProductBrand == any) -> Score = 10 ; Score = 0).

% Total Score Calculation for a specific user and product
product_score(User, ProductId, TotalScore) :-
    product(ProductId, _, _, _, _, _), % Ensure product exists
    match_category(User, ProductId, S1),
    match_budget(User, ProductId, S2),
    match_purpose(User, ProductId, S3),
    match_brand(User, ProductId, S4),
    TotalScore is S1 + S2 + S3 + S4. 
