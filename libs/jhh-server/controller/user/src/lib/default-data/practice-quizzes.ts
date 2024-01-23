import { Quiz } from '@jhh/shared/interfaces';

type DefaultQuiz = Omit<Quiz, 'userId' | 'createdAt' | 'updatedAt' | 'id'>;
const defaultPracticeQuizzes: DefaultQuiz[] = [
  {
    name: 'TypeScript',
    slug: 'typescript',
    description:
      'This TypeScript quiz is a brief test covering key concepts, perfect for both beginners and experienced developers to assess and enhance their skills.',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/125px-Typescript_logo_2020.svg.png',
    items: [
      {
        question: 'What is TypeScript primarily used for?',
        answers: [
          { isCorrect: false, text: 'Back-end development' },
          { isCorrect: false, text: 'Front-end development' },
          { isCorrect: true, text: 'Adding static typing to JavaScript' },
          { isCorrect: false, text: 'Database management' },
        ],
      },
      {
        question:
          'Which of the following is a valid way to define a variable in TypeScript?',
        answers: [
          { isCorrect: true, text: 'var name: string = "John";' },
          { isCorrect: false, text: 'string name = "John";' },
          { isCorrect: true, text: 'let name: string = "John";' },
          { isCorrect: false, text: 'name: string = "John";' },
          { isCorrect: false, text: 'string name = new String("John");' },
        ],
      },
      {
        question: 'Which is a key feature of TypeScript?',
        answers: [
          { isCorrect: false, text: 'Interpreted language' },
          { isCorrect: false, text: 'Dynamic typing' },
          { isCorrect: true, text: 'Optional static typing' },
          { isCorrect: false, text: 'No support for libraries' },
          { isCorrect: false, text: 'Incompatibility with JavaScript' },
        ],
      },
      {
        question: 'What does the `any` type represent in TypeScript?',
        answers: [
          { isCorrect: false, text: 'Any number' },
          {
            isCorrect: true,
            text: "Any type of value, bypassing the compiler's type checking",
          },
          { isCorrect: false, text: 'Any string' },
          { isCorrect: false, text: 'Undefined values only' },
          { isCorrect: false, text: 'Any array' },
        ],
      },
      {
        question:
          'Which TypeScript feature allows for specifying an exact value for a variable?',
        answers: [
          { isCorrect: false, text: 'Enums' },
          { isCorrect: true, text: 'Literal Types' },
          { isCorrect: false, text: 'Generics' },
          { isCorrect: false, text: 'Interfaces' },
        ],
      },
      {
        question: 'How do you define an interface in TypeScript?',
        answers: [
          {
            isCorrect: true,
            text: 'interface Person { name: string; age: number; }',
          },
          {
            isCorrect: false,
            text: 'class Person { name: string; age: number; }',
          },
          {
            isCorrect: true,
            text: 'type Person = { name: string; age: number; }',
          },
          { isCorrect: false, text: 'Person = { name: string; age: number; }' },
          {
            isCorrect: false,
            text: 'model Person { name: string; age: number; }',
          },
        ],
      },
      {
        question:
          "Which of the following is true about TypeScript's type inference?",
        answers: [
          { isCorrect: false, text: 'TypeScript cannot infer types.' },
          {
            isCorrect: false,
            text: 'TypeScript always requires explicit type annotations.',
          },
          {
            isCorrect: true,
            text: 'TypeScript can infer variable types in certain situations.',
          },
          {
            isCorrect: false,
            text: 'Type inference is only available in TypeScript version 3.0 and later.',
          },
          {
            isCorrect: false,
            text: 'Type inference applies to all variables, regardless of complexity.',
          },
        ],
      },
      {
        question: 'In TypeScript, what is a Tuple?',
        answers: [
          { isCorrect: false, text: 'A function that returns multiple values' },
          { isCorrect: true, text: 'An array with fixed size and types' },
          { isCorrect: false, text: 'A type that represents a set of values' },
          { isCorrect: false, text: 'A method to combine multiple types' },
          {
            isCorrect: false,
            text: 'An interface for complex data structures',
          },
        ],
      },
      {
        question:
          'Which is a correct method to make a property optional in a TypeScript interface?',
        answers: [
          { isCorrect: true, text: 'interface User { name?: string; }' },
          { isCorrect: false, text: 'interface User { name: string?; }' },
          {
            isCorrect: false,
            text: 'interface User { optional name: string; }',
          },
          {
            isCorrect: false,
            text: 'interface User { name: optional string; }',
          },
        ],
      },
      {
        question:
          'What is the output of this TypeScript code snippet: console.log(typeof null);?',
        answers: [
          { isCorrect: false, text: 'null' },
          { isCorrect: false, text: 'undefined' },
          { isCorrect: true, text: 'object' },
          { isCorrect: false, text: 'number' },
          { isCorrect: false, text: 'string' },
        ],
      },
    ],
    results: [],
  },
  {
    name: 'CSS',
    slug: 'css',
    description:
      'This CSS quiz is a way to test and reinforce knowledge on CSS fundamentals, ranging from syntax to styling techniques, suitable for both beginners and experienced web developers.',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1024px-CSS3_logo_and_wordmark.svg.png',
    items: [
      {
        question: 'What does CSS stand for?',
        answers: [
          { isCorrect: false, text: 'Computer Style Sheets' },
          { isCorrect: false, text: 'Creative Style Systems' },
          { isCorrect: true, text: 'Cascading Style Sheets' },
          { isCorrect: false, text: 'Colorful Style Sheets' },
        ],
      },
      {
        question:
          'Which of the following is the correct syntax for referring to an external style sheet?',
        answers: [
          { isCorrect: false, text: '<style src="mystyle.css">' },
          { isCorrect: false, text: '<stylesheet>mystyle.css</stylesheet>' },
          {
            isCorrect: true,
            text: '<link rel="stylesheet" type="text/css" href="mystyle.css">',
          },
          { isCorrect: false, text: '<css>mystyle.css</css>' },
        ],
      },
      {
        question: 'How do you insert a comment in a CSS file?',
        answers: [
          { isCorrect: false, text: '// this is a comment' },
          { isCorrect: false, text: '<!-- this is a comment -->' },
          { isCorrect: true, text: '/* this is a comment */' },
          { isCorrect: false, text: '# this is a comment' },
        ],
      },
      {
        question: 'Which property is used to change the background color?',
        answers: [
          { isCorrect: false, text: 'color' },
          { isCorrect: false, text: 'bgcolor' },
          { isCorrect: true, text: 'background-color' },
          { isCorrect: false, text: 'background' },
        ],
      },
      {
        question: 'How do you select an element with the id "demo"?',
        answers: [
          { isCorrect: true, text: '#demo' },
          { isCorrect: false, text: '.demo' },
          { isCorrect: false, text: 'demo' },
          { isCorrect: false, text: '*demo' },
        ],
      },
      {
        question: 'How do you select elements with the class name "test"?',
        answers: [
          { isCorrect: false, text: '#test' },
          { isCorrect: false, text: 'test' },
          { isCorrect: true, text: '.test' },
          { isCorrect: false, text: '*test' },
        ],
      },
      {
        question: 'What is the default value of the position property?',
        answers: [
          { isCorrect: false, text: 'absolute' },
          { isCorrect: false, text: 'fixed' },
          { isCorrect: false, text: 'relative' },
          { isCorrect: true, text: 'static' },
        ],
      },
      {
        question:
          'How do you make each word in a text start with a capital letter?',
        answers: [
          { isCorrect: true, text: 'text-transform: capitalize' },
          { isCorrect: false, text: 'text-style: capitalize' },
          { isCorrect: false, text: 'text-decoration: capitalize' },
          { isCorrect: false, text: 'font-style: capitalize' },
        ],
      },
      {
        question: 'Which property is used to change the font of an element?',
        answers: [
          { isCorrect: false, text: 'font-weight' },
          { isCorrect: false, text: 'font-style' },
          { isCorrect: true, text: 'font-family' },
          { isCorrect: false, text: 'font-size' },
        ],
      },
      {
        question: 'How do you select all <p> elements inside a <div> element?',
        answers: [
          { isCorrect: false, text: 'div + p' },
          { isCorrect: true, text: 'div p' },
          { isCorrect: false, text: 'div.p' },
          { isCorrect: false, text: 'p > div' },
        ],
      },
    ],
    results: [],
  },
];

export default defaultPracticeQuizzes;
