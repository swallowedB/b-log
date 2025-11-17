import nextJest from "next/jest.js";
import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config = {
  // React 컴포넌트 테스트를 위한 환경
  testEnvironment: "jest-environment-jsdom",

  // import "@/lib/..." 같은 경로 별칭을 Jest도 이해하게 해줌
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // jest-dom, Testing Library 설정 불러오기
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

};

export default createJestConfig(customJestConfig);
