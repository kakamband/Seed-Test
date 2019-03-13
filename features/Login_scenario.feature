Feature: Login scenario

Scenario: successful Login

Given As a "Guest"  

When I want to visit this site: "https://www.adesso.de/de/" 
When I want to click the Button: "Login"  
When I want to select from the "Pets" multiple selection, the values "Cat""Dog""Spider" 

Then So I will be navigated to the site: "www.adesso.de/myProfile" 
Then So I can see in the "Validation" textbox, the text "Successfully logged in" 


Scenario: failed Login

Given As a "User"

When I want to visit this site: "www.gamestar.de" 
When I want to click the Button: "Login"  
When I want to select from the "Games" selection, the value "Rpg" 

Then So I will be navigated to the site: "www.gamestar.de/login" 
Then So I can see in the "Validation" textbox, the text "Password or User incorrect" 


