% Master recommendation entry point
:- consult('rules.pl').

% recommend(User, RankedProducts)
% Finds all products with a score > 0, sorts them descending, and unifies RankedProducts.
recommend(User, RankedProducts) :-
    % setof automatically sorts ascending. We store as -(Score)-ProductId to get descending order.
    % If no products match > 0 score, it fails, so we catch it and return [] using -> ;
    (   setof([Score, ProductId], 
              (product_score(User, ProductId, Score), Score > 70), 
              AscendingList)                      
    ->  reverse(AscendingList,
         RankedProducts)
    ;   RankedProducts = []
    ).
