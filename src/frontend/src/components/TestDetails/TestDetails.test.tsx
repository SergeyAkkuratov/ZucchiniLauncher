import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import TestDetails from "./TestDetails";
import { Task } from "../../store/StoreTypes";

describe("Test details component", () => {
    it("initial state", () => {
        const task: Task = {
            id: "running",
            parameters: {
                featuresPath: "testPath",
                tags: "@TEST",
                timeout: "10s",
            },
        };
        render(<TestDetails task={task} />);
        expect(screen.getByTestId("row-test-featuresPath")).toBeInTheDocument();
        expect(screen.getByTestId("row-value-featuresPath").textContent).toBe("testPath");
        expect(screen.getByTestId("row-test-tags")).toBeInTheDocument();
        expect(screen.getByTestId("row-value-tags").textContent).toBe("@TEST");
        expect(screen.getByTestId("row-test-timeout")).toBeInTheDocument();
        expect(screen.getByTestId("row-value-timeout").textContent).toBe("10s");
    });
});
