import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo users
  const hashedPass = await bcrypt.hash("demo1234", 12);

  await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@demo.com",
      password: hashedPass,
      role: "ADMIN",
      bio: "Platform administrator",
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@demo.com" },
    update: {},
    create: {
      name: "Jane Smith",
      email: "instructor@demo.com",
      password: hashedPass,
      role: "INSTRUCTOR",
      bio: "Senior Software Engineer with 8 years of experience in full-stack development.",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@demo.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "student@demo.com",
      password: hashedPass,
      role: "STUDENT",
    },
  });

  // Create courses
  const reactCourse = await prisma.course.upsert({
    where: { id: "seed-course-react-001" },
    update: {},
    create: {
      id: "seed-course-react-001",
      title: "Complete React.js & Next.js Masterclass",
      description:
        "Master React.js and Next.js from scratch to advanced concepts. This comprehensive course covers everything from component-based architecture and state management to server-side rendering, API routes, and deployment. Perfect for both beginners and developers looking to deepen their knowledge.",
      category: "Web Development",
      difficulty: "INTERMEDIATE",
      tags: ["react", "nextjs", "javascript", "frontend", "typescript"],
      published: true,
      price: 0,
      instructorId: instructor.id,
    },
  });

  await prisma.course.upsert({
    where: { id: "seed-course-ai-001" },
    update: {},
    create: {
      id: "seed-course-ai-001",
      title: "AI & Machine Learning Fundamentals",
      description:
        "Dive into the world of artificial intelligence and machine learning. Learn core algorithms, neural networks, natural language processing, and how to build AI-powered applications using modern frameworks and APIs.",
      category: "AI/ML",
      difficulty: "BEGINNER",
      tags: ["ai", "machine learning", "python", "neural networks", "nlp"],
      published: true,
      price: 0,
      instructorId: instructor.id,
    },
  });

  // Create modules
  await prisma.module.upsert({
    where: { id: "seed-module-r1" },
    update: {},
    create: {
      id: "seed-module-r1",
      title: "Introduction to React",
      description: "Learn the fundamentals of React.js",
      content: `# Introduction to React

React is a JavaScript library for building user interfaces, developed by Facebook. It allows you to create reusable UI components and manage application state efficiently.

## Why React?

React uses a **virtual DOM** to efficiently update the UI. Instead of manipulating the real DOM directly, React:
1. Creates a virtual representation of the UI
2. Compares it with the previous version (diffing)
3. Updates only what changed (reconciliation)

## Core Concepts

### JSX (JavaScript XML)
JSX is a syntax extension that lets you write HTML-like code in JavaScript:
\`\`\`jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

### Components
Everything in React is a component. Components can be:
- **Functional**: Simple JavaScript functions (preferred)
- **Class-based**: ES6 classes (legacy)

### Props
Props are how components receive data from their parent:
\`\`\`jsx
function Button({ label, onClick, variant = "primary" }) {
  return <button onClick={onClick} className={variant}>{label}</button>;
}
\`\`\`

### State with useState
State allows components to manage and react to data changes:
\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
\`\`\`

## Key Hooks
- **useState**: Manage local state
- **useEffect**: Side effects (data fetching, subscriptions)
- **useContext**: Access context without prop drilling
- **useCallback / useMemo**: Performance optimization

React's component model encourages reusable, testable, and maintainable code. The unidirectional data flow makes state changes predictable and easy to debug.`,
      order: 0,
      duration: 30,
      courseId: reactCourse.id,
    },
  });

  await prisma.module.upsert({
    where: { id: "seed-module-r2" },
    update: {},
    create: {
      id: "seed-module-r2",
      title: "State Management & Hooks",
      description: "Deep dive into React Hooks and state management patterns",
      content: `# State Management & Hooks

Effective state management is crucial for building scalable React applications. Let's explore the most important patterns.

## useState in Depth

useState returns a stateful value and a setter function:
\`\`\`jsx
const [state, setState] = useState(initialValue);
// Functional update (recommended for derived state)
setState(prev => prev + 1);
\`\`\`

## useEffect

useEffect handles side effects — things that happen outside the React rendering cycle:
\`\`\`jsx
useEffect(() => {
  // Runs after every render
  document.title = count;

  return () => {
    // Cleanup (runs before next effect or unmount)
  };
}, [count]); // Only re-runs when count changes
\`\`\`

## useContext — Avoiding Prop Drilling

Create shared state accessible anywhere in the component tree:
\`\`\`jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <DeepChild />
    </ThemeContext.Provider>
  );
}

function DeepChild() {
  const theme = useContext(ThemeContext); // 'dark'
}
\`\`\`

## useReducer — Complex State Logic

For state with multiple sub-values or complex update logic:
\`\`\`jsx
function reducer(state, action) {
  switch(action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'reset': return { count: 0 };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return <button onClick={() => dispatch({ type: 'increment' })}>
    {state.count}
  </button>;
}
\`\`\`

## Custom Hooks

Extract reusable stateful logic into custom hooks:
\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) ?? initialValue;
  });

  const set = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, newValue);
  };

  return [value, set];
}
\`\`\`

Custom hooks make complex logic reusable and keep components clean.`,
      order: 1,
      duration: 45,
      courseId: reactCourse.id,
    },
  });

  // Create enrollment for student
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: reactCourse.id } },
    update: {},
    create: {
      userId: student.id,
      courseId: reactCourse.id,
      progress: 35,
    },
  });

  console.log("✅ Seed complete!");
  console.log("\nDemo accounts:");
  console.log("  Admin:      admin@demo.com / demo1234");
  console.log("  Instructor: instructor@demo.com / demo1234");
  console.log("  Student:    student@demo.com / demo1234");
  console.log("\nUse module IDs for AI Quiz:");
  console.log("  Module 1: seed-module-r1");
  console.log("  Module 2: seed-module-r2");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
