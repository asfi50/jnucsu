// Demo component to showcase the LoadingSpinner variations
"use client";

import { useState } from "react";
import LoadingSpinner from "./loading-spinner";
import Button from "../ui/Button";

const LoadingSpinnerDemo = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const demos = [
    {
      id: "primary-md",
      name: "Primary Medium",
      props: { variant: "primary" as const, size: "md" as const },
    },
    {
      id: "secondary-lg",
      name: "Secondary Large",
      props: { variant: "secondary" as const, size: "lg" as const },
    },
    {
      id: "minimal-sm",
      name: "Minimal Small",
      props: { variant: "minimal" as const, size: "sm" as const },
    },
    {
      id: "custom-text",
      name: "Custom Text",
      props: {
        variant: "primary" as const,
        size: "md" as const,
        customText: "Processing your data",
      },
    },
    {
      id: "no-text",
      name: "No Text",
      props: {
        variant: "primary" as const,
        size: "lg" as const,
        showText: false,
      },
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Loading Spinner Variations
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Click the buttons below to see different spinner configurations
        </p>
      </div>

      {/* Demo Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        {demos.map((demo) => (
          <Button
            key={demo.id}
            variant={activeDemo === demo.id ? "primary" : "outline"}
            size="sm"
            onClick={() =>
              setActiveDemo(activeDemo === demo.id ? null : demo.id)
            }
          >
            {demo.name}
          </Button>
        ))}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setActiveDemo("fullscreen")}
        >
          Full Screen Demo
        </Button>
      </div>

      {/* Demo Display */}
      {activeDemo && activeDemo !== "fullscreen" && (
        <div className="flex justify-center">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 min-h-[200px] flex items-center justify-center">
            <LoadingSpinner
              {...demos.find((d) => d.id === activeDemo)?.props}
            />
          </div>
        </div>
      )}

      {/* Full Screen Demo */}
      {activeDemo === "fullscreen" && (
        <LoadingSpinner
          variant="primary"
          size="lg"
          fullScreen
          customText="This is a full-screen loading overlay"
        />
      )}

      {/* Usage Examples */}
      <div className="mt-12 space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Usage Examples
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-2">Basic Usage</h4>
            <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
              {`<LoadingSpinner />

<LoadingSpinner 
  size="lg" 
  variant="secondary" 
/>`}
            </pre>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-2">Custom Text</h4>
            <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
              {`<LoadingSpinner 
  customText="Loading your data" 
/>

<LoadingSpinner 
  showText={false} 
/>`}
            </pre>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-2">Full Screen Overlay</h4>
            <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
              {`<LoadingSpinner 
  fullScreen 
  size="xl"
  customText="Processing..."
/>`}
            </pre>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-2">In Components</h4>
            <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
              {`{isLoading && (
  <LoadingSpinner 
    variant="minimal"
    className="my-4"
  />
)}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinnerDemo;
