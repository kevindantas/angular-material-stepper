# angular-material-stepper

## Status: In-Development

An AngularJS 1.x component based on the specifications of the Stepper from [Material Design](https://www.google.com/design/spec/components/steppers.html)

## Install 

`bower install --save ...`

or

`npm install --save ...`
 
 
## Dependencies 
 - [Angular](https://angularjs.org/)
 - [Angular Material Design](https://material.angularjs.org)

## Usage
 
 ```html
 <kds-stepper>
   <kds-step label="Let's Begin!" step-done="steps.begin">
     <h2>Step One</h2>
     <h3>Here </h3>
     {{ a }}
     <p>Click on the button bellow to continue</p>
     <md-button ng-click="steps.begin = true">Let's Go!!!</md-button>
   </kds-step>
 </kds-stepper>
 ```
 
 
## Attributes 
 
 Parameter       | Type    | Description
-----------------|---------|-------------------------
current-step     | integer | Index of the active / selected step