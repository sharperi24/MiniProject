import React from 'react';
import { ExternalLink, Book, Code, Globe } from 'lucide-react';

const Resources = () => {
  const resources = [
    {
      category: "Learning Platforms",
      items: [
        { title: "freeCodeCamp", url: "https://www.freecodecamp.org", description: "Learn to code for free" },
        { title: "MDN Web Docs", url: "https://developer.mozilla.org", description: "Comprehensive web development documentation" },
        { title: "W3Schools", url: "https://www.w3schools.com", description: "Web development learning tutorials" }
      ]
    },
    {
      category: "Development Tools",
      items: [
        { title: "GitHub", url: "https://github.com", description: "Code hosting platform" },
        { title: "VS Code", url: "https://code.visualstudio.com", description: "Popular code editor" },
        { title: "CodeSandbox", url: "https://codesandbox.io", description: "Online code editor" }
      ]
    },
    {
      category: "Community",
      items: [
        { title: "Stack Overflow", url: "https://stackoverflow.com", description: "Developer Q&A platform" },
        { title: "Dev.to", url: "https://dev.to", description: "Developer blogging platform" },
        { title: "Reddit r/programming", url: "https://www.reddit.com/r/programming", description: "Programming discussions" }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Development Resources</h1>
      
      <div className="space-y-8">
        {resources.map((category) => (
          <div key={category.category} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              {category.category === "Learning Platforms" && <Book className="w-5 h-5 mr-2 text-blue-500" />}
              {category.category === "Development Tools" && <Code className="w-5 h-5 mr-2 text-green-500" />}
              {category.category === "Community" && <Globe className="w-5 h-5 mr-2 text-purple-500" />}
              {category.category}
            </h2>
            
            <div className="grid gap-4">
              {category.items.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;