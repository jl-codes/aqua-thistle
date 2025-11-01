// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      route: '/',
      query: {},
      asPath: '/',
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock lucide-react icons globally
jest.mock('lucide-react', () => ({
  DollarSign: ({ className, ...props }) => (
    <div data-testid="dollar-sign-icon" className={className} {...props} />
  ),
  TrendingDown: ({ className, ...props }) => (
    <div data-testid="trending-down-icon" className={className} {...props} />
  ),
  Target: ({ className, ...props }) => (
    <div data-testid="target-icon" className={className} {...props} />
  ),
  Star: ({ className, ...props }) => (
    <div data-testid="star-icon" className={className} {...props} />
  ),
  CheckCircle: ({ className, ...props }) => (
    <div data-testid="check-circle-icon" className={className} {...props} />
  ),
  Circle: ({ className, ...props }) => (
    <div data-testid="circle-icon" className={className} {...props} />
  ),
  Zap: ({ className, ...props }) => (
    <div data-testid="zap-icon" className={className} {...props} />
  ),
  TrendingUp: ({ className, ...props }) => (
    <div data-testid="trending-up-icon" className={className} {...props} />
  ),
  Percent: ({ className, ...props }) => (
    <div data-testid="percent-icon" className={className} {...props} />
  ),
  Calendar: ({ className, ...props }) => (
    <div data-testid="calendar-icon" className={className} {...props} />
  ),
  ArrowLeft: ({ className, ...props }) => (
    <div data-testid="arrow-left-icon" className={className} {...props} />
  ),
  Menu: ({ className, ...props }) => (
    <div data-testid="menu-icon" className={className} {...props} />
  ),
  Mic: ({ className, ...props }) => (
    <div data-testid="mic-icon" className={className} {...props} />
  ),
}))

// Mock recharts for chart components
jest.mock('recharts', () => ({
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
