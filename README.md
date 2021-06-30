# Programming-Language-Interpreter

## General information

The language build on Reverse Polish notation (postfix notation). As stated in the assignment description I could choose any programming language, so I then decided to go for Javascript. I definitly noticed how haskell could be a very strong choice of language for this assignment, but I still think it was interresting to work with Javascript on this one so I don't regret it a bit.

An example of an simple syntax is:  ```5 10 +``` which returns  ```15``` <br />
An example of an more advanced syntax is:  ```5 10 + 5 - 3 3 + +``` which returns  ```16``` <br />
An example of an even more advanced syntax is:```1 loop { dup 4 > } { dup 1 + } [ ] 5 times { cons } ``` which returns  ```[ 1 2 3 4 5 ]``` <br />


## How to run it
In order to run the program/language you need [Node](https://nodejs.org/en/) in order to run in.
Then you need to install the packages with ```npm install```, and you can then run the program with ```node main.js```

You can write the programming language in input.bprog and run the code with ```node main.js < input.bprog``` or you can just run the main.js with ```node main.js``` and then write the code directly in the program, and then execute by exiting the stdin with ```ctrl+c```. It is also possible to run the program in repl mode by writing -repl eks: ```node main.js -repl```. If you want to show the types in the stack (JFloat 5 instead of 5 for an example), then use the -showtype, this works together with repl also. eks: ```node main.js -repl -showtype```
 
## types
The types I have is: <br />
JInt (eks: JInt 4)  <br />
JFloat (eks: JFloat 5.5) <br />
JString (eks: JString some text here) <br />
JBool (eks JBool True) <br />
Array/List (eks: [ 4 5.5 “ some text here “ ]) <br />
Quotation (eks: { 2 *  }) <br />
 

## Display stack
When stack is being displayed it will show with the bottom stack on the left and the top stack on the right. Eks [1,2,3,4], the 1 is the bottom and the 4 is the top. If a list or quotation is shown in the stack, even when the -showtype is activated it will not show type inside arrays, this is because what you see in the array is tokens, which is not parsed. The content in the array will be parsed when the array is getting used for an operation.
 
## Testing
When it comes to testing, I could not use the same testing tool as in Haskell, so I decided to make my own testing program. The testing program is written in test.js and can be run by  ```node test.js```, it will not list successful tests, but only failed tests, with information about what test it failed on, what it got as a result, and what it expected as a result. Since the format of my stack and how I store array and quotation is a little different from the examples in the assignment description, I have edited the tests slightly so the expectation matches what would be expected with my way of displaying values. Example: ```[ [ ] [ ] ]``` will be  displayed as ```[ [ ] [ ] ] ``` and not ```[[],[]]```. and ```age 20 := [ 10 age ]``` would displayed as ```[ 10 age ]``` in stack and not ```[ 10 20 ]```, again this is not a bug, but the purpose because I find it a better solution to wait to parse the elements inside until it should be used. Off all the tests it only failed on two tests from the whole test list. It does not give an error on the last test, but that is because of a bug with the testing program (it’s related with characters in the piping), but I have manually checked all the tests and it fails only on two as far as I can tell.

## Errors
Errors are dynamicly, like the type on the stack does not match the expected type, it will dynamicly create an error message with the expected types. Eksempel: ```errorMessage = error.checkifCorrectType(valStack[valStack.length-1], ["JInt", "JFloat", "JString"])``` if the element on the stack is of wrong type this will be thee generated error message: ```ExpectedJIntOrJFloatOrJString``` errors like ```EmptyStack``` and ```ProgramFinishedWithMultipleValuesOnStack``` will only happen when not in repl mode, as is repl mode it is expected todo more operations before closing the program.

## FizzBuZZ
I have implemented FizzBuzz with this programming language. You can see it in fizzbuzz.bprog, and you can run the code with ```node main.js < fizzbuzz.bprog``` <br />

## All operations
Here is a list of all the operations I have implemented:
 
pop - Pop the top element on the stack <br />
swap - Swaps the two top element on the stack <br />
dup - Duplicates the element on top of the stack <br />
add - adds the two elements on the stack together <br />
sub - Subtracts the second top element on the stack with the last element on the stack <br />
mult - multiply the two elements on the stack together <br />
/ - Divides the the second top element on the stack with the last element on the stack (returns float) <br />
div - Divides the the second top element on the stack with the last element on the stack (returns int) <br />
% - modulo <br />
< - returns True if element on top of the stack is bigger than the second top element, else False  <br />
\> - returns True if second top element of the stack is bigger than the top element, else False <br />
== - returns True if the two top elements on the stack are equal <br />
&& - return True if both two top elements on the stack are True <br />
|| - return True if one of the two top elements on the stack are True <br />
not - returns the opposite of the boolean on top of the stack.  <br />
:= - creates a variable <br />
parseInteger - Convert string to int <br />
parseFloat - Convert string to float <br />
words - split string in to array of words <br />
head - returns the top element in array <br />
tail - return all the elements in an array except the top element <br />
empty - returns true if array is empty <br />
cons - pushes element in array <br />
length - returns the length <br />
map - loops through each element in an array and perform and operation on each element in array <br />
each -  loops through each element in an array and perform and operation with each element in array, but return the value to the stack <br />
append - concatenate two arrays <br />
fold - loops through each element in an array and performs and operates with each element in array with the result of the last iteration. <br />
times - execute an operation n times <br />
loop - loops through quotation until block quotation tell the loop to stop. <br />
exec - executes a quotation <br />
fun - creates a function <br />
if - if statement <br />
jumpinstack - stakes a value and insert it in the programstack (which is different from the normal stack) <br />
read - reads string and saves it to the stack <br />
print - print element from stack <br />
